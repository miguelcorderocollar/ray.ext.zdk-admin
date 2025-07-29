import { Detail, Image } from "@raycast/api";
import { ZendeskUser } from "./api/zendesk"; // Import ZendeskUser from api/zendesk

interface UserDetailProps {
  user: ZendeskUser; // Use the imported ZendeskUser interface
}

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <Detail
      isLoading={false}
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
        </Detail.Metadata>
      }
    />
  );
}

