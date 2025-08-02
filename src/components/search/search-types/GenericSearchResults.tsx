import { List, Color, Icon } from "@raycast/api";
import { SearchResultsProps } from "../../../types/search";
import { ZendeskActions } from "../../ZendeskActions";
import {
  ZendeskOrganization,
  ZendeskTrigger,
  ZendeskDynamicContent,
  ZendeskMacro,
  ZendeskTicketField,
  ZendeskSupportAddress,
  ZendeskTicketForm,
  ZendeskGroup,
  ZendeskTicket,
  ZendeskView,
} from "../../../api/zendesk";

// Type definition for reference (not used due to complex union type issues)
// type GenericEntity =
//   | ZendeskOrganization
//   | ZendeskTrigger
//   | ZendeskDynamicContent
//   | ZendeskMacro
//   | ZendeskTicketField
//   | ZendeskSupportAddress
//   | ZendeskTicketForm
//   | ZendeskGroup
//   | ZendeskTicket
//   | ZendeskView;

interface GenericSearchResultsProps extends Omit<SearchResultsProps<unknown>, "results"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[];
  searchType:
    | "organizations"
    | "triggers"
    | "dynamic_content"
    | "macros"
    | "ticket_fields"
    | "support_addresses"
    | "ticket_forms"
    | "groups"
    | "tickets"
    | "views";
}

export function GenericSearchResults({
  results,
  searchType,
  instance,
  onInstanceChange,
  showDetails,
  onShowDetailsChange,
}: GenericSearchResultsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEntityTitle = (item: any): string => {
    if ("name" in item && item.name) return item.name;
    if ("title" in item && item.title) return item.title;
    if ("email" in item && item.email) return item.email;
    return `${searchType} ${item.id}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEntitySubtitle = (item: any): string | undefined => {
    if (searchType === "organizations" && "domain_names" in item && item.domain_names) {
      return item.domain_names.join(", ");
    }
    if (searchType === "support_addresses" && "name" in item && item.name) {
      return item.name;
    }
    return undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEntityAccessories = (item: any) => {
    const accessories = [];

    // Add inactive indicator for items that can be inactive
    if ("active" in item && item.active === false) {
      accessories.push({
        icon: { source: Icon.CircleDisabled },
        tooltip: "Inactive",
      });
    }

    // Add default indicator for support addresses
    if (searchType === "support_addresses" && "default" in item && item.default) {
      accessories.push({
        icon: { source: Icon.Star },
        tooltip: "Default",
      });
    }

    return accessories;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMetadata = (item: any) => {
    return (
      <List.Item.Detail.Metadata>
        {/* Instance Tag */}
        {instance && (
          <>
            <List.Item.Detail.Metadata.TagList title="Instance">
              <List.Item.Detail.Metadata.TagList.Item text={instance.subdomain} color={instance.color || Color.Blue} />
            </List.Item.Detail.Metadata.TagList>
            <List.Item.Detail.Metadata.Separator />
          </>
        )}

        {/* Basic Info */}
        <List.Item.Detail.Metadata.Label title="Title" text={getEntityTitle(item)} />
        <List.Item.Detail.Metadata.Label title="ID" text={item.id.toString()} />

        {/* Type-specific metadata */}
        {searchType === "organizations" && item.domain_names && (
          <List.Item.Detail.Metadata.TagList title="Domains">
            {item.domain_names.map((domain: string) => (
              <List.Item.Detail.Metadata.TagList.Item key={domain} text={domain} />
            ))}
          </List.Item.Detail.Metadata.TagList>
        )}

        {searchType === "support_addresses" && (
          <>
            {item.name && <List.Item.Detail.Metadata.Label title="Name" text={item.name} />}
            {item.email && <List.Item.Detail.Metadata.Label title="Email" text={item.email} />}
            {item.default !== undefined && (
              <List.Item.Detail.Metadata.Label
                title="Default"
                icon={
                  item.default
                    ? { source: Icon.CheckCircle, tintColor: Color.Green }
                    : { source: Icon.XMarkCircle, tintColor: Color.Red }
                }
              />
            )}
          </>
        )}

        {searchType === "ticket_fields" && (
          <>
            {item.type && (
              <List.Item.Detail.Metadata.TagList title="Type">
                <List.Item.Detail.Metadata.TagList.Item text={item.type} color={Color.Blue} />
              </List.Item.Detail.Metadata.TagList>
            )}
            {item.required_in_portal !== undefined && (
              <List.Item.Detail.Metadata.Label
                title="Required in Portal"
                icon={
                  item.required_in_portal
                    ? { source: Icon.CheckCircle, tintColor: Color.Green }
                    : { source: Icon.XMarkCircle, tintColor: Color.Red }
                }
              />
            )}
          </>
        )}

        {/* Active status for items that can be active/inactive */}
        {item.active !== undefined && (
          <List.Item.Detail.Metadata.TagList title="Status">
            <List.Item.Detail.Metadata.TagList.Item
              text={item.active ? "Active" : "Inactive"}
              color={item.active ? Color.Green : Color.Red}
            />
          </List.Item.Detail.Metadata.TagList>
        )}

        {/* Description for items that have it */}
        {item.description && (
          <>
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Description" text={item.description} />
          </>
        )}

        {/* Timestamps */}
        {(item.created_at || item.updated_at) && (
          <>
            <List.Item.Detail.Metadata.Separator />
            {item.created_at && (
              <List.Item.Detail.Metadata.Label title="Created At" text={new Date(item.created_at).toLocaleString()} />
            )}
            {item.updated_at && (
              <List.Item.Detail.Metadata.Label title="Updated At" text={new Date(item.updated_at).toLocaleString()} />
            )}
          </>
        )}

        {/* Link to Zendesk */}
        <List.Item.Detail.Metadata.Separator />
        <List.Item.Detail.Metadata.Link
          title="Open in Zendesk"
          text={`View ${searchType.replace("_", " ")}`}
          target={getZendeskUrl(item, searchType, instance)}
        />
      </List.Item.Detail.Metadata>
    );
  };

  const getZendeskUrl = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    type: string,
    instance: { subdomain: string } | undefined,
  ): string => {
    const baseUrl = `https://${instance?.subdomain}.zendesk.com`;

    switch (type) {
      case "organizations":
        return `${baseUrl}/agent/organizations/${item.id}`;
      case "triggers":
        return `${baseUrl}/admin/objects-rules/rules/triggers/${item.id}`;
      case "dynamic_content":
        return `${baseUrl}/dynamic_content/items/${item.id}`;
      case "macros":
        return `${baseUrl}/admin/workspaces/agent-workspace/macros/${item.id}`;
      case "ticket_fields":
        return `${baseUrl}/admin/objects-rules/tickets/ticket-fields/${item.id}`;
      case "support_addresses":
        return `${baseUrl}/admin/channels/talk_and_email/email`;
      case "ticket_forms":
        return `${baseUrl}/admin/objects-rules/tickets/ticket-forms/edit/${item.id}`;
      case "groups":
        return `${baseUrl}/admin/people/groups/${item.id}`;
      case "tickets":
        return `${baseUrl}/agent/tickets/${item.id}`;
      case "views":
        return `${baseUrl}/agent/views/${item.id}`;
      default:
        return baseUrl;
    }
  };

  return (
    <>
      {results.map((item, index) => (
        <List.Item
          key={item.id || index}
          title={getEntityTitle(item)}
          subtitle={getEntitySubtitle(item)}
          accessories={getEntityAccessories(item)}
          detail={<List.Item.Detail metadata={renderMetadata(item)} />}
          actions={
            <ZendeskActions
              item={item}
              searchType={searchType}
              instance={instance}
              onInstanceChange={onInstanceChange}
              showDetails={showDetails}
              onShowDetailsChange={onShowDetailsChange}
            />
          }
        />
      ))}
    </>
  );
}
