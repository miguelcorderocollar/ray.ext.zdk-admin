import { Detail, ActionPanel, Action } from "@raycast/api";
import { ZendeskUser, getZendeskUrl } from "./api/zendesk";

interface UserDetailProps {
  user: ZendeskUser;
}

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <Detail
      navigationTitle={user.name}
      markdown={`
${user.photo?.content_url ? `![](${user.photo.content_url})
` : ''}
# ${user.name}

Email: ${user.email}
ID: ${user.id}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Name" text={user.name} />
          <Detail.Metadata.Label title="Email" text={user.email} />
          <Detail.Metadata.Label title="ID" text={user.id.toString()} />
          {user.role && <Detail.Metadata.Label title="Role" text={user.role} />}
          {user.phone && <Detail.Metadata.Label title="Phone" text={user.phone} />}
          {user.details && <Detail.Metadata.Label title="Details" text={user.details} />}
          {user.notes && <Detail.Metadata.Label title="Notes" text={user.notes} />}
          {user.created_at && <Detail.Metadata.Label title="Created At" text={new Date(user.created_at).toLocaleString()} />}
          {user.updated_at && <Detail.Metadata.Label title="Updated At" text={new Date(user.updated_at).toLocaleString()} />}
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

