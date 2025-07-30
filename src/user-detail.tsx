import { Detail, ActionPanel, Action } from "@raycast/api";
import { ZendeskUser, getZendeskUrl } from "./api/zendesk";

interface UserDetailProps {
  user: ZendeskUser;
}

export default function UserDetail({ user }: UserDetailProps) {
  const hasDetailsOrNotes = user.details || user.notes;
  const hasTimestamps = user.created_at || user.updated_at;

  return (
    <Detail
      navigationTitle={user.name}
      markdown={`# ${user.name}

${user.photo?.content_url ? `![User Photo](${user.photo.content_url})` : ""}

`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="ID" text={user.id.toString()} />
          <Detail.Metadata.Label title="Email" text={user.email} />
          {user.phone && <Detail.Metadata.Label title="Phone" text={user.phone} />}
          {user.role && (
            <Detail.Metadata.TagList title="Role">
              <Detail.Metadata.TagList.Item text={user.role} />
            </Detail.Metadata.TagList>
          )}

          {hasDetailsOrNotes && (
            <>
              <Detail.Metadata.Separator />
              {user.details && <Detail.Metadata.Label title="Details" text={user.details} />}
              {user.notes && <Detail.Metadata.Label title="Notes" text={user.notes} />}
            </>
          )}

          {hasTimestamps && (
            <>
              <Detail.Metadata.Separator />
              {user.created_at && (
                <Detail.Metadata.Label title="Created At" text={new Date(user.created_at).toLocaleString()} />
              )}
              {user.updated_at && (
                <Detail.Metadata.Label title="Updated At" text={new Date(user.updated_at).toLocaleString()} />
              )}
            </>
          )}

          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="Open in Zendesk"
            text="View User Profile"
            target={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
          />
        </ActionPanel>
      }
    />
  );
}
