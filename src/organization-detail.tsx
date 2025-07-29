import { Detail, ActionPanel, Action } from "@raycast/api";
import { ZendeskOrganization, getZendeskUrl } from "./api/zendesk";

interface OrganizationDetailProps {
  organization: ZendeskOrganization;
}

export default function OrganizationDetail({ organization }: OrganizationDetailProps) {
  return (
    <Detail
      navigationTitle={organization.name}
      markdown={`# ${organization.name}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Name" text={organization.name} />
          {organization.domain_names && organization.domain_names.length > 0 && (
            <Detail.Metadata.Label title="Domains" text={organization.domain_names.join(", ")} />
          )}
          {organization.details && <Detail.Metadata.Label title="Details" text={organization.details} />}
          {organization.notes && <Detail.Metadata.Label title="Notes" text={organization.notes} />}
          {organization.external_id && <Detail.Metadata.Label title="External ID" text={organization.external_id} />}
          {organization.created_at && <Detail.Metadata.Label title="Created At" text={new Date(organization.created_at).toLocaleString()} />}
          {organization.updated_at && <Detail.Metadata.Label title="Updated At" text={new Date(organization.updated_at).toLocaleString()} />}
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
