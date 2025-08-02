import { List, Image, Icon, Color } from "@raycast/api";
import { ZendeskUser } from "../../../api/zendesk";
import { SearchResultsProps } from "../../../types/search";
import { ZendeskActions } from "../../ZendeskActions";

export function UserSearchResults({
  results,
  instance,
  onInstanceChange,
  showDetails,
  onShowDetailsChange,
}: SearchResultsProps<ZendeskUser>) {
  return (
    <>
      {results.map((user) => {
        const hasDetailsOrNotes = user.details || user.notes;

        return (
          <List.Item
            key={user.id}
            title={user.name}
            icon={
              user.photo?.content_url
                ? { source: user.photo.content_url, mask: Image.Mask.Circle }
                : { source: "placeholder-user.svg", mask: Image.Mask.Circle }
            }
            accessories={
              user.role && (user.role === "agent" || user.role === "admin")
                ? [
                    {
                      icon: {
                        source: Icon.Person,
                        tintColor: user.role === "agent" ? Color.Green : Color.Red,
                      },
                      tooltip: user.role === "agent" ? "Agent" : "Admin",
                    },
                  ]
                : []
            }
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    {/* Instance Tag */}
                    {instance && (
                      <>
                        <List.Item.Detail.Metadata.TagList title="Instance">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={instance.subdomain}
                            color={instance.color || Color.Blue}
                          />
                        </List.Item.Detail.Metadata.TagList>
                        <List.Item.Detail.Metadata.Separator />
                      </>
                    )}

                    {/* Basic Info */}
                    <List.Item.Detail.Metadata.Label title="Name" text={user.name} />
                    <List.Item.Detail.Metadata.Label title="ID" text={user.id.toString()} />
                    {user.email && <List.Item.Detail.Metadata.Label title="Email" text={user.email} />}

                    {/* User-specific metadata */}
                    {user.alias && <List.Item.Detail.Metadata.Label title="Alias" text={user.alias} />}
                    {user.phone && <List.Item.Detail.Metadata.Label title="Phone" text={user.phone} />}

                    {/* Role */}
                    {user.role && (
                      <List.Item.Detail.Metadata.TagList title="Role">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={user.role}
                          color={(() => {
                            switch (user.role) {
                              case "end-user":
                                return Color.Blue;
                              case "agent":
                                return Color.Green;
                              case "admin":
                                return Color.Red;
                              default:
                                return Color.PrimaryText;
                            }
                          })()}
                        />
                      </List.Item.Detail.Metadata.TagList>
                    )}

                    {/* Tags */}
                    {user.tags && user.tags.length > 0 && (
                      <List.Item.Detail.Metadata.TagList title="Tags">
                        {user.tags.map((tag) => (
                          <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    )}

                    {/* Details and Notes */}
                    {hasDetailsOrNotes && (
                      <>
                        <List.Item.Detail.Metadata.Separator />
                        {user.details && <List.Item.Detail.Metadata.Label title="Details" text={user.details} />}
                        {user.notes && <List.Item.Detail.Metadata.Label title="Notes" text={user.notes} />}
                      </>
                    )}

                    {/* Timestamps */}
                    {(user.created_at || user.updated_at) && (
                      <>
                        <List.Item.Detail.Metadata.Separator />
                        {user.created_at && (
                          <List.Item.Detail.Metadata.Label
                            title="Created At"
                            text={new Date(user.created_at).toLocaleString()}
                          />
                        )}
                        {user.updated_at && (
                          <List.Item.Detail.Metadata.Label
                            title="Updated At"
                            text={new Date(user.updated_at).toLocaleString()}
                          />
                        )}
                      </>
                    )}

                    {/* Link to Zendesk */}
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Link
                      title="Open in Zendesk"
                      text="View User Profile"
                      target={`https://${instance?.subdomain}.zendesk.com/agent/users/${user.id}`}
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ZendeskActions
                item={user}
                searchType="users"
                instance={instance}
                onInstanceChange={onInstanceChange}
                showDetails={showDetails}
                onShowDetailsChange={onShowDetailsChange}
              />
            }
          />
        );
      })}
    </>
  );
}
