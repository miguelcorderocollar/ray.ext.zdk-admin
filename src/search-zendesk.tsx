import { List, showToast, Toast, Image, Color, Icon } from "@raycast/api";
import { getUserRoleColor, getActiveStatusColor, getVerificationStatusColor, getBooleanIcon } from "./utils/colors";
import { getFieldTypeInfo } from "./utils/fieldTypes";
import { formatInstanceColor } from "./utils/formatters";
import { TimestampMetadata, InstanceMetadata } from "./components/common/MetadataHelpers";
import { SearchTypeSelector, SearchType } from "./components/common/SearchTypeSelector";

import { useState, useEffect } from "react";
import { getZendeskInstances, ZendeskInstance } from "./utils/preferences";
import { useDebounce } from "./hooks/useDebounce";
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
  searchZendeskBrands,
  ZendeskBrand,
  searchZendeskAutomations,
  ZendeskAutomation,
  searchZendeskCustomRoles,
  ZendeskCustomRole,
} from "./api/zendesk";

import { TicketListItem } from "./components/lists/TicketListItem";
import { BrandListItem } from "./components/lists/BrandListItem";
import { CustomRoleListItem } from "./components/lists/CustomRoleListItem";
import { AutomationListItem } from "./components/lists/AutomationListItem";
import { ZendeskActions } from "./components/actions/ZendeskActions";

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
    | ZendeskBrand[]
    | ZendeskAutomation[]
    | ZendeskCustomRole[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>("tickets");

  const [allDynamicContent, setAllDynamicContent] = useState<ZendeskDynamicContent[]>([]);
  const [dynamicContentLoaded, setDynamicContentLoaded] = useState(false);
  const [allSupportAddresses, setAllSupportAddresses] = useState<ZendeskSupportAddress[]>([]);
  const [supportAddressesLoaded, setSupportAddressesLoaded] = useState(false);
  const [allGroups, setAllGroups] = useState<ZendeskGroup[]>([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [allAutomations, setAllAutomations] = useState<ZendeskAutomation[]>([]);
  const [automationsLoaded, setAutomationsLoaded] = useState(false);
  const [allCustomRoles, setAllCustomRoles] = useState<ZendeskCustomRole[]>([]);
  const [customRolesLoaded, setCustomRolesLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    setResults([]);
    setSearchText("");
    if (searchType === "dynamic_content") {
      setDynamicContentLoaded(false);
      setAllDynamicContent([]);
    } else if (searchType === "support_addresses") {
      setSupportAddressesLoaded(false);
      setAllSupportAddresses([]);
    } else if (searchType === "groups") {
      setGroupsLoaded(false);
      setAllGroups([]);
    } else if (searchType === "automations") {
      setAutomationsLoaded(false);
      setAllAutomations([]);
    } else if (searchType === "custom_roles") {
      setCustomRolesLoaded(false);
      setAllCustomRoles([]);
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
    } else if (searchType === "automations") {
      if (!automationsLoaded) {
        performSearch();
      } else {
        const filteredResults = allAutomations.filter((item) =>
          item.title.toLowerCase().includes(debouncedSearchText.toLowerCase()),
        );
        setResults(filteredResults);
      }
    } else if (searchType === "custom_roles") {
      if (!customRolesLoaded) {
        performSearch();
      } else {
        const filteredResults = allCustomRoles.filter((item) =>
          item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()),
        );
        setResults(filteredResults);
      }
    } else {
      performSearch();
    }
  }, [
    debouncedSearchText,
    searchType,
    currentInstance,
    dynamicContentLoaded,
    supportAddressesLoaded,
    groupsLoaded,
    automationsLoaded,
    customRolesLoaded,
  ]);

  async function performSearch() {
    if (!currentInstance) {
      showToast(Toast.Style.Failure, "Configuration Error", "No Zendesk instances configured.");
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
      } else if (searchType === "automations") {
        if (!automationsLoaded) {
          setAllAutomations([]);
          const fetchedAutomations = await searchZendeskAutomations(debouncedSearchText, currentInstance);
          setAllAutomations(fetchedAutomations);
          setResults(fetchedAutomations);
          setAutomationsLoaded(true);
          setIsLoading(false);
        } else {
          const filteredResults = allAutomations.filter((item) =>
            item.title.toLowerCase().includes(debouncedSearchText.toLowerCase()),
          );
          setResults(filteredResults);
        }
      } else if (searchType === "custom_roles") {
        if (!customRolesLoaded) {
          setAllCustomRoles([]);
          const fetchedCustomRoles = await searchZendeskCustomRoles(debouncedSearchText, currentInstance);
          setAllCustomRoles(fetchedCustomRoles);
          setResults(fetchedCustomRoles);
          setCustomRolesLoaded(true);
          setIsLoading(false);
        } else {
          const filteredResults = allCustomRoles.filter((item) =>
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
          | ZendeskView[]
          | ZendeskBrand[]
          | ZendeskAutomation[]
          | ZendeskCustomRole[] = [];
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
        } else if (searchType === "triggers") {
          searchResults = await searchZendeskTriggers(debouncedSearchText, currentInstance);
        } else if (searchType === "brands") {
          searchResults = await searchZendeskBrands(debouncedSearchText, currentInstance);
        } else if (searchType === "automations") {
          searchResults = await searchZendeskAutomations(debouncedSearchText, currentInstance);
        } else if (searchType === "custom_roles") {
          searchResults = await searchZendeskCustomRoles(debouncedSearchText, currentInstance);
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
      isShowingDetail={showDetails}
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
                            : searchType === "brands"
                              ? "Search brands by name or subdomain"
                              : searchType === "automations"
                                ? "Search automations by name"
                                : searchType === "custom_roles"
                                  ? "Search roles by name"
                                  : "Search Zendesk triggers by name"
      }
      throttle
      searchBarAccessory={<SearchTypeSelector value={searchType} onChange={setSearchType} />}
    >
      {(results || []).length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}
      {(results || []).length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title={`Start Typing to Search ${searchType === "users" ? "Users" : searchType === "organizations" ? "Organizations" : searchType === "dynamic_content" ? "Dynamic Content" : searchType === "macros" ? "Macros" : searchType === "ticket_fields" ? "Ticket Fields" : searchType === "support_addresses" ? "Support Addresses" : searchType === "ticket_forms" ? "Ticket Forms" : searchType === "groups" ? "Groups" : searchType === "tickets" ? "Tickets" : searchType === "views" ? "Views" : searchType === "brands" ? "Brands" : searchType === "automations" ? "Automations" : searchType === "custom_roles" ? "Roles" : "Triggers"}`}
          description={`Enter a name, email, or other keyword to find Zendesk ${searchType}.`}
        />
      )}
      {searchType === "triggers"
        ? (() => {
            const triggers = results as ZendeskTrigger[];
            const groupedTriggers = triggers.reduce(
              (acc, trigger) => {
                const categoryId = trigger.category_id || "Unidentified";
                if (!acc[categoryId]) {
                  acc[categoryId] = [];
                }
                acc[categoryId].push(trigger);
                return acc;
              },
              {} as Record<string, ZendeskTrigger[]>,
            );

            // Sort categories: identified categories first, then "Unidentified"
            const sortedCategories = Object.keys(groupedTriggers).sort((a, b) => {
              if (a === "Unidentified") return 1;
              if (b === "Unidentified") return -1;
              return a.localeCompare(b);
            });

            return sortedCategories.map((categoryId) => (
              <List.Section key={categoryId} title={categoryId}>
                {groupedTriggers[categoryId].map((trigger) => (
                  <List.Item
                    key={trigger.id}
                    title={trigger.title}
                    icon={undefined}
                    accessories={
                      !trigger.active
                        ? [
                            {
                              icon: {
                                source: Icon.CircleDisabled,
                              },
                              tooltip: "Inactive",
                            },
                          ]
                        : []
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
                                    color={formatInstanceColor(currentInstance.color)}
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
                                color={getActiveStatusColor(trigger.active)}
                              />
                            </List.Item.Detail.Metadata.TagList>
                            {trigger.created_at && trigger.updated_at && (
                              <TimestampMetadata created_at={trigger.created_at} updated_at={trigger.updated_at} />
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
                        showDetails={showDetails}
                        onShowDetailsChange={setShowDetails}
                      />
                    }
                  />
                ))}
              </List.Section>
            ));
          })()
        : (results || []).map((item) => {
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
                  accessories={
                    user.role && (user.role === "agent" || user.role === "admin")
                      ? [
                          {
                            icon: {
                              source: Icon.Person,
                              tintColor: getUserRoleColor(user.role),
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
                          {currentInstance && <InstanceMetadata instance={currentInstance} />}
                          <List.Item.Detail.Metadata.Label title="Name" text={user.name} />
                          <List.Item.Detail.Metadata.Label title="ID" text={user.id.toString()} />
                          {user.email && (
                            <List.Item.Detail.Metadata.Link
                              title="Email"
                              text={user.email}
                              target={`mailto:${user.email}`}
                            />
                          )}
                          {user.alias && <List.Item.Detail.Metadata.Label title="Alias" text={user.alias} />}
                          {user.phone && <List.Item.Detail.Metadata.Label title="Phone" text={user.phone} />}
                          {user.role && (
                            <List.Item.Detail.Metadata.TagList title="Role">
                              <List.Item.Detail.Metadata.TagList.Item
                                text={user.role}
                                color={getUserRoleColor(user.role)}
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
                              {user.created_at && user.updated_at && (
                                <TimestampMetadata created_at={user.created_at} updated_at={user.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
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
                          {organization.created_at && organization.updated_at && (
                            <TimestampMetadata
                              created_at={organization.created_at}
                              updated_at={organization.updated_at}
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
                    />
                  }
                />
              );
            } else if (searchType === "dynamic_content") {
              const dynamicContent = item as ZendeskDynamicContent;
              const nameParts = (dynamicContent.name ?? "").split("::");
              const title = nameParts?.length > 1 ? nameParts[nameParts.length - 1] : dynamicContent.name;
              const tags = nameParts?.length > 1 ? nameParts.slice(0, nameParts.length - 1) : [];
              const defaultVariant = dynamicContent.variants?.find((v) => v.default === true);

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
                      markdown={
                        defaultVariant
                          ? `## ${title}\n\n${defaultVariant.content.replace(/\r\n|\r|\n/g, "\n")}`
                          : `## ${title}\n\nNo default variant content available.`
                      }
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
                          <TimestampMetadata
                            created_at={dynamicContent.created_at}
                            updated_at={dynamicContent.updated_at}
                          />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
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
                  accessories={[
                    ...(tags.length > 2
                      ? [...tags.slice(0, 2).map((tag) => ({ text: tag })), { text: "..." }]
                      : tags.map((tag) => ({ text: tag }))),
                    ...(!macro.active
                      ? [
                          {
                            icon: {
                              source: Icon.CircleDisabled,
                            },
                            tooltip: "Inactive",
                          },
                        ]
                      : []),
                  ]}
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
                              color={getActiveStatusColor(macro.active)}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          {macro.description && (
                            <List.Item.Detail.Metadata.Label title="Description" text={macro.description} />
                          )}
                          <TimestampMetadata created_at={macro.created_at} updated_at={macro.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
                    />
                  }
                />
              );
            } else if (searchType === "ticket_fields") {
              const ticketField = item as ZendeskTicketField;
              if (!ticketField) {
                return null; // Skip rendering if ticketField is null or undefined
              }
              const fieldTypeInfo = getFieldTypeInfo(ticketField.type);

              return (
                <List.Item
                  key={ticketField.id}
                  title={ticketField.title}
                  accessories={[
                    {
                      tag: {
                        value: fieldTypeInfo.label,
                        color: fieldTypeInfo.color,
                      },
                    },
                    ...(!ticketField.active
                      ? [
                          {
                            icon: {
                              source: Icon.CircleDisabled,
                            },
                            tooltip: "Inactive",
                          },
                        ]
                      : []),
                  ]}
                  detail={
                    <List.Item.Detail
                      metadata={
                        <List.Item.Detail.Metadata>
                          <List.Item.Detail.Metadata.Label title="Title" text={ticketField.title} />
                          <List.Item.Detail.Metadata.Label title="ID" text={ticketField.id.toString()} />
                          <List.Item.Detail.Metadata.TagList title="Type">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={fieldTypeInfo.label}
                              color={fieldTypeInfo.color}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.TagList title="Active">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={ticketField.active ? "Active" : "Inactive"}
                              color={getActiveStatusColor(ticketField.active)}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                          <List.Item.Detail.Metadata.Label
                            title="Visible in Portal"
                            icon={getBooleanIcon(ticketField.visible_in_portal)}
                          />
                          <List.Item.Detail.Metadata.Label
                            title="Editable in Portal"
                            icon={getBooleanIcon(ticketField.editable_in_portal)}
                          />
                          <List.Item.Detail.Metadata.Label
                            title="Required in Portal"
                            icon={getBooleanIcon(ticketField.required_in_portal)}
                          />
                          <List.Item.Detail.Metadata.Separator />
                          <List.Item.Detail.Metadata.Label
                            title="Agent Can Edit"
                            icon={getBooleanIcon(ticketField.editable_in_portal)}
                          />
                          <List.Item.Detail.Metadata.Separator />
                          {ticketField.tag && <List.Item.Detail.Metadata.Label title="Tag" text={ticketField.tag} />}
                          <TimestampMetadata created_at={ticketField.created_at} updated_at={ticketField.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
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
                          <List.Item.Detail.Metadata.Link
                            title="Email"
                            text={supportAddress.email}
                            target={`mailto:${supportAddress.email}`}
                          />
                          <List.Item.Detail.Metadata.Label title="ID" text={supportAddress.id.toString()} />
                          {supportAddress.brand_id && (
                            <List.Item.Detail.Metadata.Label
                              title="Brand ID"
                              text={supportAddress.brand_id.toString()}
                            />
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
                                color={getVerificationStatusColor(supportAddress.cname_status === "verified")}
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
                                color={getVerificationStatusColor(
                                  supportAddress.domain_verification_status === "verified",
                                )}
                              />
                            </List.Item.Detail.Metadata.TagList>
                          )}
                          {supportAddress.spf_status && (
                            <List.Item.Detail.Metadata.TagList title="SPF Status">
                              <List.Item.Detail.Metadata.TagList.Item
                                text={supportAddress.spf_status}
                                color={getVerificationStatusColor(supportAddress.spf_status === "verified")}
                              />
                            </List.Item.Detail.Metadata.TagList>
                          )}
                          <List.Item.Detail.Metadata.Separator />
                          {supportAddress.forwarding_status && (
                            <List.Item.Detail.Metadata.TagList title="Forwarding Status">
                              <List.Item.Detail.Metadata.TagList.Item
                                text={supportAddress.forwarding_status}
                                color={getVerificationStatusColor(supportAddress.forwarding_status === "verified")}
                              />
                            </List.Item.Detail.Metadata.TagList>
                          )}
                          <List.Item.Detail.Metadata.Separator />
                          {supportAddress.created_at && supportAddress.updated_at && (
                            <TimestampMetadata
                              created_at={supportAddress.created_at}
                              updated_at={supportAddress.updated_at}
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
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
                  accessories={
                    !ticketForm.active
                      ? [
                          {
                            icon: {
                              source: Icon.CircleDisabled,
                            },
                            tooltip: "Inactive",
                          },
                        ]
                      : []
                  }
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
                              color={getActiveStatusColor(ticketForm.active)}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          <List.Item.Detail.Metadata.Separator />
                          <List.Item.Detail.Metadata.Label
                            title="End User Visible"
                            icon={getBooleanIcon(ticketForm.end_user_visible)}
                          />
                          <List.Item.Detail.Metadata.Label
                            title="In All Brands"
                            icon={getBooleanIcon(ticketForm.in_all_brands)}
                          />
                          {ticketForm.restricted_brand_ids && ticketForm.restricted_brand_ids.length > 0 && (
                            <List.Item.Detail.Metadata.TagList title="Restricted Brand IDs">
                              {ticketForm.restricted_brand_ids.map((brandId) => (
                                <List.Item.Detail.Metadata.TagList.Item key={brandId} text={brandId.toString()} />
                              ))}
                            </List.Item.Detail.Metadata.TagList>
                          )}
                          <List.Item.Detail.Metadata.Separator />
                          <TimestampMetadata created_at={ticketForm.created_at} updated_at={ticketForm.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
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
                          <List.Item.Detail.Metadata.Label title="Default" icon={getBooleanIcon(group.default)} />
                          <List.Item.Detail.Metadata.Label title="Deleted" icon={getBooleanIcon(group.deleted)} />
                          <List.Item.Detail.Metadata.Label title="Is Public" icon={getBooleanIcon(group.is_public)} />
                          <List.Item.Detail.Metadata.Separator />
                          <TimestampMetadata created_at={group.created_at} updated_at={group.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
                    />
                  }
                />
              );
            } else if (searchType === "tickets") {
              const ticket = item as ZendeskTicket;
              return (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                  showDetails={showDetails}
                  onShowDetailsChange={setShowDetails}
                />
              );
            } else if (searchType === "views") {
              const view = item as ZendeskView;
              return (
                <List.Item
                  key={view.id}
                  title={view.title}
                  icon={undefined}
                  accessories={
                    !view.active
                      ? [
                          {
                            icon: {
                              source: Icon.CircleDisabled,
                            },
                            tooltip: "Inactive",
                          },
                        ]
                      : []
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
                          <List.Item.Detail.Metadata.Label title="Title" text={view.title} />
                          <List.Item.Detail.Metadata.Label title="ID" text={view.id.toString()} />
                          <List.Item.Detail.Metadata.TagList title="Active">
                            <List.Item.Detail.Metadata.TagList.Item
                              text={view.active ? "Active" : "Inactive"}
                              color={getActiveStatusColor(view.active)}
                            />
                          </List.Item.Detail.Metadata.TagList>
                          {view.created_at && view.updated_at && (
                            <TimestampMetadata created_at={view.created_at} updated_at={view.updated_at} />
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
                      showDetails={showDetails}
                      onShowDetailsChange={setShowDetails}
                    />
                  }
                />
              );
            } else if (searchType === "brands") {
              const brand = item as ZendeskBrand;
              return (
                <BrandListItem
                  key={brand.id}
                  brand={brand}
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                  showDetails={showDetails}
                  onShowDetailsChange={setShowDetails}
                />
              );
            } else if (searchType === "automations") {
              const automation = item as ZendeskAutomation;
              return (
                <AutomationListItem
                  key={automation.id}
                  automation={automation}
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                  showDetails={showDetails}
                  onShowDetailsChange={setShowDetails}
                />
              );
            } else if (searchType === "custom_roles") {
              const customRole = item as ZendeskCustomRole;
              return (
                <CustomRoleListItem
                  key={customRole.id}
                  customRole={customRole}
                  instance={currentInstance}
                  onInstanceChange={setCurrentInstance}
                  showDetails={showDetails}
                  onShowDetailsChange={setShowDetails}
                />
              );
            }
          })}
    </List>
  );
}
