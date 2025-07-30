import { Detail, ActionPanel, Action } from "@raycast/api";
import { ZendeskOrganization, getZendeskUrl } from "./api/zendesk";

interface OrganizationDetailProps {
  organization: ZendeskOrganization;
}

export default function OrganizationDetail({ organization }: OrganizationDetailProps) {
  const hasDetailsOrNotes = organization.details || organization.notes;
  const hasTimestamps = organization.created_at || organization.updated_at;

  return (
    <Detail
      navigationTitle={organization.name}
      markdown={`# ${organization.name}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="ID" text={organization.id.toString()} />
          {organization.domain_names && organization.domain_names.length > 0 && (
            <Detail.Metadata.TagList title="Domains">
              {organization.domain_names.map((domain) => (
                <Detail.Metadata.TagList.Item key={domain} text={domain} />
              ))}
            </Detail.Metadata.TagList>
          )}

          {hasDetailsOrNotes && (
            <>
              <Detail.Metadata.Separator />
              {organization.details && <Detail.Metadata.Label title="Details" text={organization.details} />}
              {organization.notes && <Detail.Metadata.Label title="Notes" text={organization.notes} />}
            </>
          )}

          {(hasTimestamps || organization.external_id) && <Detail.Metadata.Separator />}

          {organization.external_id && <Detail.Metadata.Label title="External ID" text={organization.external_id} />}
          {organization.created_at && (
            <Detail.Metadata.Label title="Created At" text={new Date(organization.created_at).toLocaleString()} />
          )}
          {organization.updated_at && (
            <Detail.Metadata.Label title="Updated At" text={new Date(organization.updated_at).toLocaleString()} />
          )}

          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="Open in Zendesk"
            text="View Organization Profile"
            target={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
          />
        </ActionPanel>
      }
    />
  );
}
