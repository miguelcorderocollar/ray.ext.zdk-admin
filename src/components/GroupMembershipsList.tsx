import { List, Color, Icon, Image } from "@raycast/api";
import { getUserRoleColor, getDefaultStatusColor } from "../utils/colors";
import { TimestampMetadata } from "./common/MetadataHelpers";
import { useEntitySearch } from "../hooks/useEntitySearch";
import { ZendeskInstance } from "../utils/preferences";
import { searchZendeskGroupMemberships, ZendeskGroupMembership, getGroupUsers, ZendeskUser } from "../api/zendesk";
import { ZendeskActions } from "./ZendeskActions";
import { useState } from "react";

interface GroupMembershipsListProps {
  groupId: number;
  groupName: string;
  instance: ZendeskInstance | undefined;
}

interface MembershipWithUser extends ZendeskGroupMembership {
  user?: ZendeskUser;
}

export default function GroupMembershipsList({ groupId, groupName, instance }: GroupMembershipsListProps) {
  const [showDetails, setShowDetails] = useState(true);

  // Use the new search hook
  const { results: memberships, isLoading } = useEntitySearch<MembershipWithUser>({
    searchFunction: async (instance, onPage) => {
      // First, get the group memberships
      const membershipData: MembershipWithUser[] = [];
      await searchZendeskGroupMemberships(groupId, instance, (page) => {
        membershipData.push(...page.map((membership) => ({ ...membership, user: undefined })));
      });

      // Then, fetch user data for all memberships
      try {
        const users = await getGroupUsers(groupId, instance);

        // Merge user data with memberships
        const enrichedMemberships = membershipData.map((membership) => {
          const user = users.find((u) => u.id === membership.user_id);
          return { ...membership, user };
        });

        onPage(enrichedMemberships);
      } catch (userError) {
        // If user data fetch fails, still show memberships with just IDs
        console.warn("Failed to fetch user data:", userError);
        onPage(membershipData);
      }
    },
    instance,
    dependencies: [groupId],
  });

  return (
    <List
      isShowingDetail={showDetails}
      isLoading={isLoading}
      searchBarPlaceholder="Search group memberships..."
      throttle
    >
      {memberships.length === 0 && !isLoading && (
        <List.EmptyView
          title="No Group Memberships Found"
          description={`No users are members of the group "${groupName}".`}
        />
      )}
      {memberships.map((membership) => (
        <List.Item
          key={membership.id}
          title={membership.user ? membership.user.name : `User ID: ${membership.user_id}`}
          subtitle={membership.user?.email}
          icon={
            membership.user?.photo?.content_url
              ? { source: membership.user.photo.content_url, mask: Image.Mask.Circle }
              : { source: "placeholder-user.svg", mask: Image.Mask.Circle }
          }
          accessories={[
            ...(membership.user?.role && (membership.user.role === "agent" || membership.user.role === "admin")
              ? [
                  {
                    icon: {
                      source: Icon.Person,
                      tintColor: getUserRoleColor(membership.user.role),
                    },
                    tooltip: membership.user.role,
                  },
                ]
              : []),
            ...(membership.default
              ? [
                  {
                    icon: {
                      source: Icon.Star,
                      tintColor: Color.Yellow,
                    },
                    tooltip: "Default Group",
                  },
                ]
              : []),
          ]}
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Membership ID" text={membership.id.toString()} />
                  <List.Item.Detail.Metadata.Label title="User ID" text={membership.user_id.toString()} />
                  <List.Item.Detail.Metadata.Label title="Group ID" text={membership.group_id.toString()} />
                  {membership.user && (
                    <>
                      <List.Item.Detail.Metadata.Label title="User Name" text={membership.user.name} />
                      {membership.user.email && (
                        <List.Item.Detail.Metadata.Label title="Email" text={membership.user.email} />
                      )}
                      {membership.user.role && (
                        <List.Item.Detail.Metadata.TagList title="Role">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={membership.user.role}
                            color={getUserRoleColor(membership.user.role)}
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {membership.user.phone && (
                        <List.Item.Detail.Metadata.Label title="Phone" text={membership.user.phone} />
                      )}
                    </>
                  )}
                  <List.Item.Detail.Metadata.TagList title="Default Membership">
                    <List.Item.Detail.Metadata.TagList.Item
                      text={membership.default ? "Default" : "Not Default"}
                      color={getDefaultStatusColor(membership.default)}
                    />
                  </List.Item.Detail.Metadata.TagList>
                  <List.Item.Detail.Metadata.Separator />
                  {/* Use the new TimestampMetadata component */}
                  <TimestampMetadata created_at={membership.created_at} updated_at={membership.updated_at} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Link
                    title="Open User Profile"
                    text="View User"
                    target={`https://${instance?.subdomain}.zendesk.com/agent/users/${membership.user_id}`}
                  />
                  <List.Item.Detail.Metadata.Link
                    title="Open Group Details"
                    text="View Group"
                    target={`https://${instance?.subdomain}.zendesk.com/admin/people/groups/${membership.group_id}`}
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ZendeskActions
              item={membership}
              searchType="group_memberships"
              instance={instance}
              onInstanceChange={() => {}}
              showDetails={showDetails}
              onShowDetailsChange={setShowDetails}
            />
          }
        />
      ))}
    </List>
  );
}
