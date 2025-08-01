import { List, showToast, Toast, Image, Color, Icon } from "@raycast/api";

import { useState, useEffect } from "react";
import { getZendeskInstances, ZendeskInstance } from "./utils/preferences";
import {
  searchZendeskUsers,
  ZendeskUser,
  searchZendeskOrganizations,
  ZendeskOrganization,
  searchZendeskTriggers,
  ZendeskTrigger,
  searchZendeskDynamicContent,
  ZendeskDynamicContent,
  searchZendeskMacros,
  ZendeskMacro,
  searchZendeskTicketFields,
  ZendeskTicketField,
  searchZendeskSupportAddresses,
  ZendeskSupportAddress,
  searchZendeskTicketForms,
  ZendeskTicketForm,
  searchZendeskGroups,
  ZendeskGroup,
  searchZendeskTickets,
  ZendeskTicket,
  searchZendeskViews,
  ZendeskView,
} from "./api/zendesk";

import { ZendeskActions } from "./components/ZendeskActions";

// Custom useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchZendesk() {
  const allInstances = getZendeskInstances();
  const [currentInstance, setCurrentInstance] = useState<ZendeskInstance | undefined>(allInstances[0]);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [results, setResults] = useState<
    | ZendeskUser[]
    | ZendeskOrganization[]
    | ZendeskTrigger[]
    | ZendeskDynamicContent[]
    | ZendeskMacro[]
    | ZendeskTicketField[]
    | ZendeskSupportAddress[]
    | ZendeskTicketForm[]
    | ZendeskGroup[]
    | ZendeskTicket[]
    | ZendeskView[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<
    | "users"
    | "organizations"
    | "triggers"
    | "dynamic_content"
    | "macros"
    | "ticket_fields"
    | "support_addresses"
    | "ticket_forms"
    | "groups"
    | "tickets"
    | "views"
  >("tickets");

  const [allDynamicContent, setAllDynamicContent] = useState<ZendeskDynamicContent[]>([]);
  const [dynamicContentLoaded, setDynamicContentLoaded] = useState(false);
  const [allSupportAddresses, setAllSupportAddresses] = useState<ZendeskSupportAddress[]>([]);
  const [supportAddressesLoaded, setSupportAddressesLoaded] = useState(false);
  const [allGroups, setAllGroups] = useState<ZendeskGroup[]>([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  useEffect(() => {
    if (searchType === "dynamic_content") {
      setDynamicContentLoaded(false);
      setAllDynamicContent([]);
      setResults([]);
    } else if (searchType === "support_addresses") {
      setSupportAddressesLoaded(false);
      setAllSupportAddresses([]);
      setResults([]);
    }
  }, [currentInstance, searchType]);

  useEffect(() => {
    if (searchType === "dynamic_content") {
      if (!dynamicContentLoaded) {
        performSearch();
      } else {
        const filteredResults = allDynamicContent.filter(
          (item) =>
            item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            item.variants.some((variant) => variant.content.toLowerCase().includes(debouncedSearchText.toLowerCase())),
        );
        setResults(filteredResults);
      }
    } else if (searchType === "support_addresses") {
      if (!supportAddressesLoaded) {
        performSearch();
      } else {
        const filteredResults = allSupportAddresses.filter(
          (item) =>
            item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            item.email.toLowerCase().includes(debouncedSearchText.toLowerCase()),
        );
        setResults(filteredResults);
      }
    } else if (searchType === "groups") {
      if (!groupsLoaded) {
        performSearch();
      } else {
        const filteredResults = allGroups.filter((item) =>
          item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()),
        );
        setResults(filteredResults);
      }
    } else {
      performSearch();
    }
  }, [debouncedSearchText, searchType, currentInstance, dynamicContentLoaded, supportAddressesLoaded, groupsLoaded]);

  async function performSearch() {
    if (!currentInstance) {
      showToast(Toast.Style.Failure, "Configuration Error", "No Zendesk instances configured.");
      return;
    }

    if (searchType === "triggers" && !debouncedSearchText) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (searchType === "dynamic_content") {
        if (!dynamicContentLoaded) {
          setAllDynamicContent([]);
          await searchZendeskDynamicContent(debouncedSearchText, currentInstance, (page) => {
            setAllDynamicContent((prev) => [...prev, ...page]);
            setResults(
              (prev) =>
                [...prev, ...page] as
                  | ZendeskUser[]
                  | ZendeskOrganization[]
                  | ZendeskTrigger[]
                  | ZendeskDynamicContent[]
                  | ZendeskMacro[]
                  | ZendeskTicketField[]
                  | ZendeskSupportAddress[]
                  | ZendeskTicketForm[]
                  | ZendeskGroup[]
                  | ZendeskTicket[]
                  | ZendeskView[],
            );
          });
          setDynamicContentLoaded(true);
          setIsLoading(false);
        } else {
          const filteredResults = allDynamicContent.filter(
            (item) =>
              item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
              item.variants.some((variant) =>
                variant.content.toLowerCase().includes(debouncedSearchText.toLowerCase()),
              ),
          );
          setResults(filteredResults);
        }
      } else if (searchType === "support_addresses") {
        if (!supportAddressesLoaded) {
          setAllSupportAddresses([]);
          await searchZendeskSupportAddresses(currentInstance, (page) => {
            setAllSupportAddresses((prev) => [...prev, ...page]);
            setResults(
              (prev) =>
                [...prev, ...page] as
                  | ZendeskUser[]
                  | ZendeskOrganization[]
                  | ZendeskTrigger[]
                  | ZendeskDynamicContent[]
                  | ZendeskMacro[]
                  | ZendeskTicketField[]
                  | ZendeskSupportAddress[]
                  | ZendeskTicketForm[]
                  | ZendeskGroup[]
                  | ZendeskTicket[]
                  | ZendeskView[],
            );
          });
          setSupportAddressesLoaded(true);
          setIsLoading(false);
        } else {
          const filteredResults = allSupportAddresses.filter(
            (item) =>
              item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
              item.email.toLowerCase().includes(debouncedSearchText.toLowerCase()),
          );
          setResults(filteredResults);
        }
      } else if (searchType === "groups") {
        if (!groupsLoaded) {
          setAllGroups([]);
          const fetchedGroups = await searchZendeskGroups(currentInstance);
          setAllGroups(fetchedGroups);
          setResults(fetchedGroups);
          setGroupsLoaded(true);
          setIsLoading(false);
        } else {
          const filteredResults = allGroups.filter((item) =>
            item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()),
          );
          setResults(filteredResults);
        }
      } else {
        let searchResults:
          | ZendeskUser[]
          | ZendeskOrganization[]
          | ZendeskTrigger[]
          | ZendeskDynamicContent[]
          | ZendeskMacro[]
          | ZendeskTicketField[]
          | ZendeskSupportAddress[]
          | ZendeskTicketForm[]
          | ZendeskGroup[]
          | ZendeskTicket[]
          | ZendeskView[] = [];
        if (searchType === "users") {
          searchResults = await searchZendeskUsers(debouncedSearchText, currentInstance);
        } else if (searchType === "organizations") {
          searchResults = await searchZendeskOrganizations(debouncedSearchText, currentInstance);
        } else if (searchType === "macros") {
          searchResults = await searchZendeskMacros(debouncedSearchText, currentInstance);
        } else if (searchType === "ticket_fields") {
          searchResults = await searchZendeskTicketFields(debouncedSearchText, currentInstance);
        } else if (searchType === "ticket_forms") {
          searchResults = await searchZendeskTicketForms(debouncedSearchText, currentInstance);
        } else if (searchType === "tickets") {
          searchResults = await searchZendeskTickets(debouncedSearchText, currentInstance);
        } else if (searchType === "views") {
          searchResults = await searchZendeskViews(debouncedSearchText, currentInstance);
        } else {
          searchResults = await searchZendeskTriggers(debouncedSearchText, currentInstance);
        }
        setResults(searchResults);
        setIsLoading(false);
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast(Toast.Style.Failure, "Search Failed", errorMessage);
      setResults([]);
      setIsLoading(false);
    }
  }

  return (
    <List
      isShowingDetail
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={
        searchType === "users"
          ? "Search Zendesk users by name, email, etc."
          : searchType === "organizations"
            ? "Search Zendesk organizations by name, domain, etc."
            : searchType === "dynamic_content"
              ? "Search Zendesk dynamic content by name or content"
              : searchType === "macros"
                ? "Search Zendesk macros by name or description"
                : searchType === "ticket_fields"
                  ? "Search ticket fields by title"
                  : searchType === "support_addresses"
                    ? "Search support addresses by name or email"
                    : searchType === "ticket_forms"
                      ? "Search ticket forms by name"
                      : searchType === "groups"
                        ? "Search groups by name"
                        : searchType === "tickets"
                          ? "Search tickets by subject, description, etc."
                          : searchType === "views"
                            ? "Search views by title"
                            : "Search Zendesk triggers by name"
      }
      throttle
      searchBarAccessory={
        <List.Dropdown
          onChange={(newValue) =>
            setSearchType(
              newValue as
                | "users"
                | "organizations"
                | "triggers"
                | "dynamic_content"
                | "macros"
                | "ticket_fields"
                | "support_addresses"
                | "ticket_forms"
                | "groups"
                | "tickets"
                | "views",
            )
          }
          tooltip="Select Search Type"
          value={searchType}
        >
          <List.Dropdown.Section title="Ticketing">
            <List.Dropdown.Item title="Tickets" value="tickets" />
            <List.Dropdown.Item title="Users" value="users" />
            <List.Dropdown.Item title="Organizations" value="organizations" />
            <List.Dropdown.Item title="Views" value="views" />
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Admin">
            <List.Dropdown.Item title="Groups" value="groups" />
            <List.Dropdown.Item title="Triggers" value="triggers" />
            <List.Dropdown.Item title="Dynamic Content" value="dynamic_content" />
            <List.Dropdown.Item title="Macros" value="macros" />
            <List.Dropdown.Item title="Ticket Fields" value="ticket_fields" />
            <List.Dropdown.Item title="Support Addresses" value="support_addresses" />
            <List.Dropdown.Item title="Ticket Forms" value="ticket_forms" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {(results || []).length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}
      {(results || []).length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title={`Start Typing to Search ${searchType === "users" ? "Users" : searchType === "organizations" ? "Organizations" : searchType === "dynamic_content" ? "Dynamic Content" : searchType === "macros" ? "Macros" : searchType === "ticket_fields" ? "Ticket Fields" : searchType === "support_addresses" ? "Support Addresses" : searchType === "ticket_forms" ? "Ticket Forms" : searchType === "groups" ? "Groups" : searchType === "tickets" ? "Tickets" : "Triggers"}`}
          description={`Enter a name, email, or other keyword to find Zendesk ${searchType}.`}
        />
      )}
      {(results || []).map((item) => {
        if (searchType === "users") {
          const user = item as ZendeskUser;
          const hasDetailsOrNotes = user.details || user.notes;
          const hasTimestamps = user.created_at || user.updated_at;

          return (
            <List.Item
              key={user.id}
              title={user.name}
              icon={
                user.photo?.content_url
                  ? { source: user.photo.content_url, mask: Image.Mask.Circle }
                  : { source: "placeholder-user.svg", mask: Image.Mask.Circle }
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Name" text={user.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={user.id.toString()} />
                      {user.email && <List.Item.Detail.Metadata.Label title="Email" text={user.email} />}
                      {user.alias && <List.Item.Detail.Metadata.Label title="Alias" text={user.alias} />}
                      {user.phone && <List.Item.Detail.Metadata.Label title="Phone" text={user.phone} />}
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
                      {user.tags && user.tags.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Tags">
                          {user.tags.map((tag) => (
                            <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}

                      {hasDetailsOrNotes && (
                        <>
                          <List.Item.Detail.Metadata.Separator />
                          {user.details && <List.Item.Detail.Metadata.Label title="Details" text={user.details} />}
                          {user.notes && <List.Item.Detail.Metadata.Label title="Notes" text={user.notes} />}
                        </>
                      )}

                      {hasTimestamps && (
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

                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View User Profile"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/agent/users/${user.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={user}
                  searchType="users"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "organizations") {
          const organization = item as ZendeskOrganization;
          const hasDetailsOrNotes = organization.details || organization.notes;
          const hasTimestamps = organization.created_at || organization.updated_at;

          return (
            <List.Item
              key={organization.id}
              title={organization.name}
              icon={undefined}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Name" text={organization.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={organization.id.toString()} />
                      {organization.domain_names && organization.domain_names.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Domains">
                          {organization.domain_names.map((domain) => (
                            <List.Item.Detail.Metadata.TagList.Item key={domain} text={domain} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}

                      {hasDetailsOrNotes && (
                        <>
                          <List.Item.Detail.Metadata.Separator />
                          {organization.details && (
                            <List.Item.Detail.Metadata.Label title="Details" text={organization.details} />
                          )}
                          {organization.notes && (
                            <List.Item.Detail.Metadata.Label title="Notes" text={organization.notes} />
                          )}
                        </>
                      )}

                      {(hasTimestamps || organization.external_id) && <List.Item.Detail.Metadata.Separator />}

                      {organization.external_id && (
                        <List.Item.Detail.Metadata.Label title="External ID" text={organization.external_id} />
                      )}
                      {organization.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(organization.created_at).toLocaleString()}
                        />
                      )}
                      {organization.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(organization.updated_at).toLocaleString()}
                        />
                      )}

                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View Organization Profile"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/agent/organizations/${organization.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={organization}
                  searchType="organizations"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "dynamic_content") {
          const dynamicContent = item as ZendeskDynamicContent;
          const nameParts = (dynamicContent.name ?? "").split("::");
          const title = nameParts?.length > 1 ? nameParts[nameParts.length - 1] : dynamicContent.name;
          const tags = nameParts?.length > 1 ? nameParts.slice(0, nameParts.length - 1) : [];
          const defaultVariant = dynamicContent.variants?.find((v) => v.id === dynamicContent.default_locale_id);

          return (
            <List.Item
              key={dynamicContent.id}
              title={title}
              accessories={
                tags.length > 2
                  ? [...tags.slice(0, 2).map((tag) => ({ text: tag })), { text: "..." }]
                  : tags.map((tag) => ({ text: tag }))
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Name" text={dynamicContent.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={dynamicContent.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Placeholder" text={dynamicContent.placeholder} />
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(dynamicContent.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(dynamicContent.updated_at).toLocaleString()}
                      />
                      {defaultVariant && (
                        <List.Item.Detail.Metadata.Label title="Content" text={defaultVariant.content} />
                      )}
                      <List.Item.Detail.Metadata.TagList title="Locales">
                        {dynamicContent.variants?.map((variant) => (
                          <List.Item.Detail.Metadata.TagList.Item key={variant.id} text={`${variant.locale_id}`} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={dynamicContent}
                  searchType="dynamic_content"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "macros") {
          const macro = item as ZendeskMacro;
          const nameParts = macro.title?.split("::");
          const title = nameParts?.length > 1 ? nameParts[nameParts.length - 1] : macro.title;
          const tags = nameParts?.length > 1 ? nameParts.slice(0, nameParts.length - 1) : [];

          return (
            <List.Item
              key={macro.id}
              title={title}
              accessories={
                tags.length > 2
                  ? [...tags.slice(0, 2).map((tag) => ({ text: tag })), { text: "..." }]
                  : tags.map((tag) => ({ text: tag }))
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Name" text={macro.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={macro.id.toString()} />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={macro.active ? "Active" : "Inactive"}
                          color={macro.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      {macro.description && (
                        <List.Item.Detail.Metadata.Label title="Description" text={macro.description} />
                      )}
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(macro.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(macro.updated_at).toLocaleString()}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={macro}
                  searchType="macros"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "ticket_fields") {
          const ticketField = item as ZendeskTicketField;
          const fieldTypeMapping: { [key: string]: string } = {
            text: "Text",
            textarea: "Textarea",
            checkbox: "Checkbox",
            date: "Date",
            integer: "Integer",
            decimal: "Decimal",
            regexp: "Regex",
            partialcreditcard: "Partial Credit Card",
            multiselect: "Multi-select",
            tagger: "Dropdown",
            lookup: "Lookup",
          };

          return (
            <List.Item
              key={ticketField.id}
              title={ticketField.title}
              accessories={[{ text: fieldTypeMapping[ticketField.type] || ticketField.type }]}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Title" text={ticketField.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={ticketField.id.toString()} />
                      <List.Item.Detail.Metadata.Label
                        title="Type"
                        text={fieldTypeMapping[ticketField.type] || ticketField.type}
                      />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={ticketField.active ? "Active" : "Inactive"}
                          color={ticketField.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Visible in Portal"
                        icon={
                          ticketField.visible_in_portal
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Editable in Portal"
                        icon={
                          ticketField.editable_in_portal
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Required in Portal"
                        icon={
                          ticketField.required_in_portal
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Agent Can Edit"
                        icon={
                          ticketField.editable_in_portal
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Separator />
                      {ticketField.tag && <List.Item.Detail.Metadata.Label title="Tag" text={ticketField.tag} />}
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(ticketField.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(ticketField.updated_at).toLocaleString()}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={ticketField}
                  searchType="ticket_fields"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "support_addresses") {
          const supportAddress = item as ZendeskSupportAddress;

          return (
            <List.Item
              key={supportAddress.id}
              title={supportAddress.email}
              accessories={[{ icon: supportAddress.default ? Icon.Star : undefined }]}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {supportAddress.name && (
                        <List.Item.Detail.Metadata.Label title="Name" text={supportAddress.name} />
                      )}
                      <List.Item.Detail.Metadata.Label title="Email" text={supportAddress.email} />
                      <List.Item.Detail.Metadata.Label title="ID" text={supportAddress.id.toString()} />
                      {supportAddress.brand_id && (
                        <List.Item.Detail.Metadata.Label title="Brand ID" text={supportAddress.brand_id.toString()} />
                      )}
                      <List.Item.Detail.Metadata.Label
                        title="Default"
                        icon={
                          supportAddress.default
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle }
                        }
                      />
                      <List.Item.Detail.Metadata.Separator />
                      {supportAddress.cname_status && (
                        <List.Item.Detail.Metadata.TagList title="CNAME Status">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={supportAddress.cname_status}
                            color={supportAddress.cname_status === "verified" ? Color.Green : Color.Orange}
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {supportAddress.dns_results && (
                        <List.Item.Detail.Metadata.Label title="DNS Results" text={supportAddress.dns_results} />
                      )}
                      {supportAddress.domain_verification_code && (
                        <List.Item.Detail.Metadata.Label
                          title="Domain Verification Code"
                          text={supportAddress.domain_verification_code}
                        />
                      )}
                      {supportAddress.domain_verification_status && (
                        <List.Item.Detail.Metadata.TagList title="Domain Verification Status">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={supportAddress.domain_verification_status}
                            color={
                              supportAddress.domain_verification_status === "verified" ? Color.Green : Color.Orange
                            }
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {supportAddress.spf_status && (
                        <List.Item.Detail.Metadata.TagList title="SPF Status">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={supportAddress.spf_status}
                            color={supportAddress.spf_status === "verified" ? Color.Green : Color.Orange}
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      {supportAddress.forwarding_status && (
                        <List.Item.Detail.Metadata.TagList title="Forwarding Status">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={supportAddress.forwarding_status}
                            color={supportAddress.forwarding_status === "verified" ? Color.Green : Color.Orange}
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      {supportAddress.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(supportAddress.created_at).toLocaleString()}
                        />
                      )}
                      {supportAddress.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(supportAddress.updated_at).toLocaleString()}
                        />
                      )}
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={supportAddress}
                  searchType="support_addresses"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "ticket_forms") {
          const ticketForm = item as ZendeskTicketForm;

          return (
            <List.Item
              key={ticketForm.id}
              title={ticketForm.name}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={ticketForm.name} />
                      {ticketForm.display_name && (
                        <List.Item.Detail.Metadata.Label title="Display Name" text={ticketForm.display_name} />
                      )}
                      <List.Item.Detail.Metadata.Label title="ID" text={ticketForm.id.toString()} />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={ticketForm.active ? "Active" : "Inactive"}
                          color={ticketForm.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="End User Visible"
                        icon={
                          ticketForm.end_user_visible
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Label
                        title="In All Brands"
                        icon={
                          ticketForm.in_all_brands
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      {ticketForm.restricted_brand_ids && ticketForm.restricted_brand_ids.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Restricted Brand IDs">
                          {ticketForm.restricted_brand_ids.map((brandId) => (
                            <List.Item.Detail.Metadata.TagList.Item key={brandId} text={brandId.toString()} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(ticketForm.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(ticketForm.updated_at).toLocaleString()}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={ticketForm}
                  searchType="ticket_forms"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "groups") {
          const group = item as ZendeskGroup;
          const nameParts = (group.name ?? "").split(".");
          const title = nameParts.length > 1 ? nameParts.slice(1).join(".") : group.name;
          const accessory = nameParts.length > 1 ? nameParts[0] : "";

          return (
            <List.Item
              key={group.id}
              title={title}
              accessories={[{ text: accessory }]}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={group.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={group.id.toString()} />
                      {group.description && (
                        <List.Item.Detail.Metadata.Label title="Description" text={group.description} />
                      )}
                      <List.Item.Detail.Metadata.Link
                        title="Open Group Details"
                        text="View Group Details"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/admin/people/groups/${group.id}`}
                      />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Default"
                        icon={
                          group.default
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Deleted"
                        icon={
                          group.deleted
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Is Public"
                        icon={
                          group.is_public
                            ? { source: Icon.CheckCircle, tintColor: Color.Green }
                            : { source: Icon.XMarkCircle, tintColor: Color.Red }
                        }
                      />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(group.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(group.updated_at).toLocaleString()}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={group}
                  searchType="groups"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "tickets") {
          const ticket = item as ZendeskTicket;
          const statusColor = (() => {
            switch (ticket.status) {
              case "new":
                return Color.Yellow;
              case "open":
                return Color.Red;
              case "pending":
                return Color.Blue;
              case "hold":
              case "on-hold":
                return Color.Purple;
              case "solved":
                return Color.Blue;
              case "closed":
                return Color.PrimaryText; // Using PrimaryText as a darker alternative
              default:
                return Color.PrimaryText;
            }
          })();

          const priorityColor = (() => {
            switch (ticket.priority) {
              case "urgent":
                return Color.Red;
              case "high":
                return Color.Orange;
              case "normal":
                return Color.Blue;
              case "low":
                return Color.Green;
              default:
                return Color.PrimaryText;
            }
          })();

          return (
            <List.Item
              key={ticket.id}
              title={ticket.subject}
              icon={{ source: Icon.Circle, tintColor: statusColor }}
              accessories={[{ text: `#${ticket.id}` }]}
              detail={
                <List.Item.Detail
                  markdown={`## ${ticket.subject}

${ticket.description}`}
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.TagList title="Status">
                        <List.Item.Detail.Metadata.TagList.Item text={ticket.status} color={statusColor} />
                      </List.Item.Detail.Metadata.TagList>
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.TagList title="Associations">
                        {ticket.organization_id && (
                          <List.Item.Detail.Metadata.TagList.Item text={`Organization: ${ticket.organization_id}`} />
                        )}
                        {ticket.brand_id && (
                          <List.Item.Detail.Metadata.TagList.Item text={`Brand: ${ticket.brand_id}`} />
                        )}
                        {ticket.group_id && (
                          <List.Item.Detail.Metadata.TagList.Item text={`Group: ${ticket.group_id}`} />
                        )}
                      </List.Item.Detail.Metadata.TagList>
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(ticket.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(ticket.updated_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.TagList title="Custom Fields">
                        {ticket.custom_fields?.map(
                          (field) =>
                            field.value && (
                              <List.Item.Detail.Metadata.TagList.Item
                                key={field.id}
                                text={`${field.id}: ${field.value}`}
                              />
                            ),
                        )}
                      </List.Item.Detail.Metadata.TagList>
                      <List.Item.Detail.Metadata.Separator />
                      {ticket.external_id && (
                        <List.Item.Detail.Metadata.Label title="External ID" text={ticket.external_id} />
                      )}
                      {ticket.recipient && (
                        <List.Item.Detail.Metadata.Label title="Recipient" text={ticket.recipient} />
                      )}
                      {ticket.tags && ticket.tags.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Tags">
                          {ticket.tags.map((tag) => (
                            <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {ticket.ticket_form_id && (
                        <List.Item.Detail.Metadata.Label title="Ticket Form ID" text={String(ticket.ticket_form_id)} />
                      )}
                      {ticket.priority && (
                        <List.Item.Detail.Metadata.TagList title="Priority">
                          <List.Item.Detail.Metadata.TagList.Item text={ticket.priority} color={priorityColor} />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {ticket.type && (
                        <List.Item.Detail.Metadata.TagList title="Type">
                          <List.Item.Detail.Metadata.TagList.Item text={ticket.type} />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {ticket.via && (
                        <List.Item.Detail.Metadata.TagList title="Via">
                          <List.Item.Detail.Metadata.TagList.Item text={ticket.via.channel} />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={ticket}
                  searchType="tickets"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "triggers") {
          const trigger = item as unknown as ZendeskTrigger;
          return (
            <List.Item
              key={trigger.id}
              title={trigger.title}
              icon={undefined}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Title" text={trigger.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={trigger.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Category ID" text={trigger.category_id} />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={trigger.active ? "Active" : "Inactive"}
                          color={trigger.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      {trigger.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(trigger.created_at).toLocaleString()}
                        />
                      )}
                      {trigger.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(trigger.updated_at).toLocaleString()}
                        />
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View Trigger"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/admin/objects-rules/rules/triggers/${trigger.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={trigger}
                  searchType="triggers"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        } else if (searchType === "views") {
          const view = item as ZendeskView;
          return (
            <List.Item
              key={view.id}
              title={view.title}
              icon={undefined}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      {currentInstance && (
                        <>
                          <List.Item.Detail.Metadata.TagList title="Instance">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={currentInstance.subdomain}
                              color={currentInstance.color || Color.Blue}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                        </>
                      )}
                      <List.Item.Detail.Metadata.Label title="Title" text={view.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={view.id.toString()} />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={view.active ? "Active" : "Inactive"}
                          color={view.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      {view.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(view.created_at).toLocaleString()}
                        />
                      )}
                      {view.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(view.updated_at).toLocaleString()}
                        />
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open Agent View"
                        text="View in Agent Interface"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/agent/views/${view.id}`}
                      />
                      <List.Item.Detail.Metadata.Link
                        title="Open Admin Edit View"
                        text="Edit in Admin Interface"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/admin/objects-rules/rules/views/${view.id}`}
                      />
                      <List.Item.Detail.Metadata.Link
                        title="Open Admin Views Page"
                        text="All Views in Admin Interface"
                        target={`https://${currentInstance?.subdomain}.zendesk.com/admin/objects-rules/rules/views`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ZendeskActions
                  item={view}
                  searchType="views"
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                />
              }
            />
          );
        }
      })}
    </List>
  );
}
