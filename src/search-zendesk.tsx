import { List, showToast, Toast, Image, Color, Icon } from "@raycast/api";
import { getUserRoleColor, getActiveStatusColor, getVerificationStatusColor } from "./utils/colors";
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
  searchZendeskTriggerCategories,
  ZendeskTriggerCategory,
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
import { ViewListItem } from "./components/lists/ViewListItem";
import { TicketFormListItem } from "./components/lists/TicketFormListItem";
import { GroupListItem } from "./components/lists/GroupListItem";
import { MacroListItem } from "./components/lists/MacroListItem";
import { TicketFieldListItem } from "./components/lists/TicketFieldListItem";
import { ZendeskActions } from "./components/actions/ZendeskActions";

export default function SearchZendesk() {
  const allInstances = getZendeskInstances();

  // Helper function to get category name from category ID
  const getCategoryName = (categoryId: string | null | undefined): string => {
    if (!categoryId) return "Unidentified";
    const category = allTriggerCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Helper function to get brand name from brand ID
  const getBrandName = (brandId: number | null | undefined): string => {
    if (!brandId) return "Unidentified";
    const brand = allBrands.find((brand) => brand.id === brandId);
    return brand ? brand.name : `Brand ${brandId}`;
  };
  const [currentInstance, setCurrentInstance] = useState<ZendeskInstance | undefined>(allInstances[0]);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 350);
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
    | ZendeskTriggerCategory[]
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
  const [allTriggerCategories, setAllTriggerCategories] = useState<ZendeskTriggerCategory[]>([]);
  const [triggerCategoriesLoaded, setTriggerCategoriesLoaded] = useState(false);
  const [allBrands, setAllBrands] = useState<ZendeskBrand[]>([]);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
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
      setBrandsLoaded(false);
      setAllBrands([]);
    } else if (searchType === "brands") {
      setBrandsLoaded(false);
      setAllBrands([]);
    } else if (searchType === "groups") {
      setGroupsLoaded(false);
      setAllGroups([]);
    } else if (searchType === "automations") {
      setAutomationsLoaded(false);
      setAllAutomations([]);
    } else if (searchType === "custom_roles") {
      setCustomRolesLoaded(false);
      setAllCustomRoles([]);
    } else if (searchType === "triggers") {
      setTriggerCategoriesLoaded(false);
      setAllTriggerCategories([]);
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
    } else if (searchType === "brands") {
      if (!brandsLoaded) {
        performSearch();
      } else {
        const filteredResults = allBrands.filter(
          (item) =>
            item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            item.subdomain.toLowerCase().includes(debouncedSearchText.toLowerCase()),
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
    brandsLoaded,
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
          let allDynamicContentItems: ZendeskDynamicContent[] = [];
          await searchZendeskDynamicContent(debouncedSearchText, currentInstance, (page) => {
            allDynamicContentItems = [...allDynamicContentItems, ...page];
            setAllDynamicContent(allDynamicContentItems);
            setResults(allDynamicContentItems);
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
          // Load brands if not already loaded
          if (!brandsLoaded) {
            setAllBrands([]);
            await searchZendeskBrands(currentInstance, (page) => {
              setAllBrands((prev) => [...prev, ...page]);
            });
            setBrandsLoaded(true);
          }

          setAllSupportAddresses([]);
          let allAddresses: ZendeskSupportAddress[] = [];
          await searchZendeskSupportAddresses(currentInstance, (page) => {
            allAddresses = [...allAddresses, ...page];
            setAllSupportAddresses(allAddresses);
          });
          setSupportAddressesLoaded(true);
          setResults(allAddresses);
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
          // Load trigger categories if not already loaded
          if (!triggerCategoriesLoaded) {
            setAllTriggerCategories([]);
            await searchZendeskTriggerCategories(currentInstance, (page) => {
              setAllTriggerCategories((prev) => [...prev, ...page]);
            });
            setTriggerCategoriesLoaded(true);
          }
          searchResults = await searchZendeskTriggers(debouncedSearchText, currentInstance);
        } else if (searchType === "brands") {
          if (!brandsLoaded) {
            setAllBrands([]);
            let allBrandsItems: ZendeskBrand[] = [];
            await searchZendeskBrands(currentInstance, (page) => {
              allBrandsItems = [...allBrandsItems, ...page];
              setAllBrands(allBrandsItems);
              setResults(allBrandsItems);
            });
            setBrandsLoaded(true);
            setIsLoading(false);
          } else {
            const filteredResults = allBrands.filter(
              (item) =>
                item.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                item.subdomain.toLowerCase().includes(debouncedSearchText.toLowerCase()),
            );
            setResults(filteredResults);
          }
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
                const categoryName = getCategoryName(trigger.category_id);
                if (!acc[categoryName]) {
                  acc[categoryName] = [];
                }
                acc[categoryName].push(trigger);
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

            return sortedCategories.map((categoryName) => (
              <List.Section key={categoryName} title={categoryName}>
                {groupedTriggers[categoryName].map((trigger) => (
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
                            {trigger.description && (
                              <List.Item.Detail.Metadata.Label title="Description" text={trigger.description} />
                            )}
                            <List.Item.Detail.Metadata.Label title="ID" text={trigger.id.toString()} />
                            <List.Item.Detail.Metadata.Label
                              title="Category"
                              text={getCategoryName(trigger.category_id)}
                            />
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
        : searchType === "support_addresses"
          ? (() => {
              const supportAddresses = results as ZendeskSupportAddress[];

              const groupedSupportAddresses = supportAddresses.reduce(
                (acc, supportAddress) => {
                  const brandName = getBrandName(supportAddress.brand_id);
                  if (!acc[brandName]) {
                    acc[brandName] = [];
                  }
                  acc[brandName].push(supportAddress);
                  return acc;
                },
                {} as Record<string, ZendeskSupportAddress[]>,
              );

              // Sort brands: identified brands first, then "Unidentified"
              const sortedBrands = Object.keys(groupedSupportAddresses).sort((a, b) => {
                if (a === "Unidentified") return 1;
                if (b === "Unidentified") return -1;
                return a.localeCompare(b);
              });

              return sortedBrands.map((brandName) => (
                <List.Section key={brandName} title={brandName}>
                  {groupedSupportAddresses[brandName].map((supportAddress) => {
                    // Check if any verification status is not verified
                    const hasUnverifiedStatus =
                      (supportAddress.cname_status && supportAddress.cname_status !== "verified") ||
                      (supportAddress.domain_verification_status &&
                        supportAddress.domain_verification_status !== "verified") ||
                      (supportAddress.spf_status && supportAddress.spf_status !== "verified") ||
                      (supportAddress.forwarding_status && supportAddress.forwarding_status !== "verified");

                    const accessories: List.Item.Accessory[] = [];

                    // Add default star icon if it's the default address
                    if (supportAddress.default) {
                      accessories.push({ icon: Icon.Star });
                    }

                    // Add warning icon if there are unverified statuses
                    if (hasUnverifiedStatus) {
                      accessories.push({
                        icon: {
                          source: Icon.Warning,
                          tintColor: Color.Yellow,
                        },
                        tooltip: "Unverified status detected",
                      });
                    }

                    return (
                      <List.Item
                        key={supportAddress.id}
                        title={supportAddress.email || ""}
                        accessories={accessories}
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
                                {supportAddress.name && (
                                  <List.Item.Detail.Metadata.Label title="Name" text={supportAddress.name} />
                                )}
                                {supportAddress.email && (
                                  <List.Item.Detail.Metadata.Link
                                    title="Email"
                                    text={supportAddress.email}
                                    target={`mailto:${supportAddress.email}`}
                                  />
                                )}
                                <List.Item.Detail.Metadata.Label title="ID" text={supportAddress.id.toString()} />
                                {supportAddress.brand_id && (
                                  <List.Item.Detail.Metadata.Label
                                    title="Brand"
                                    text={getBrandName(supportAddress.brand_id)}
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
                                  <List.Item.Detail.Metadata.Label
                                    title="DNS Results"
                                    text={supportAddress.dns_results}
                                  />
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
                                      color={getVerificationStatusColor(
                                        supportAddress.forwarding_status === "verified",
                                      )}
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
                  })}
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
                    accessories={[
                      ...(user.role && (user.role === "agent" || user.role === "admin")
                        ? [
                            {
                              icon: {
                                source: Icon.Person,
                                tintColor: getUserRoleColor(user.role),
                              },
                              tooltip: user.role === "agent" ? "Agent" : "Admin",
                            },
                          ]
                        : []),
                      ...(!showDetails && user.email ? [{ text: user.email }] : []),
                    ]}
                    detail={
                      showDetails ? (
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
                                  {user.details && (
                                    <List.Item.Detail.Metadata.Label title="Details" text={user.details} />
                                  )}
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
                      ) : undefined
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
                const hasAdditionalFields =
                  organization.external_id ||
                  organization.group_id ||
                  (organization.organization_fields && Object.keys(organization.organization_fields).length > 0) ||
                  (organization.tags && organization.tags.length > 0);

                // Build metadata sections with smart separators
                const metadataElements = [];

                // Instance section
                if (currentInstance) {
                  metadataElements.push(
                    <List.Item.Detail.Metadata.TagList key="instance" title="Instance">
                      <List.Item.Detail.Metadata.TagList.Item
                        text={currentInstance.subdomain}
                        color={currentInstance.color || Color.Blue}
                      />
                    </List.Item.Detail.Metadata.TagList>,
                  );
                }

                // Basic info section
                metadataElements.push(
                  <List.Item.Detail.Metadata.Label key="name" title="Name" text={organization.name} />,
                  <List.Item.Detail.Metadata.Label key="id" title="ID" text={organization.id.toString()} />,
                );

                // Domains section
                if (organization.domain_names && organization.domain_names.length > 0) {
                  metadataElements.push(
                    <List.Item.Detail.Metadata.TagList key="domains" title="Domains">
                      {organization.domain_names.map((domain) => (
                        <List.Item.Detail.Metadata.TagList.Item key={domain} text={domain} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>,
                  );
                }

                // Details and Notes section
                if (hasDetailsOrNotes) {
                  if (organization.details) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.Label key="details" title="Details" text={organization.details} />,
                    );
                  }
                  if (organization.notes) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.Label key="notes" title="Notes" text={organization.notes} />,
                    );
                  }
                }

                // Additional fields section
                if (hasAdditionalFields) {
                  if (organization.external_id) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.Label
                        key="external_id"
                        title="External ID"
                        text={organization.external_id}
                      />,
                    );
                  }
                  if (organization.group_id) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.Label
                        key="group_id"
                        title="Group ID"
                        text={organization.group_id.toString()}
                      />,
                    );
                  }
                  if (organization.organization_fields && Object.keys(organization.organization_fields).length > 0) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.TagList key="org_fields" title="Organization Fields">
                        {Object.entries(organization.organization_fields).map(([key, value]) => (
                          <List.Item.Detail.Metadata.TagList.Item key={key} text={`${key}: ${value}`} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>,
                    );
                  }
                  if (organization.tags && organization.tags.length > 0) {
                    metadataElements.push(
                      <List.Item.Detail.Metadata.TagList key="tags" title="Tags">
                        {organization.tags.map((tag) => (
                          <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>,
                    );
                  }
                }

                // Timestamps section
                if (hasTimestamps && organization.created_at && organization.updated_at) {
                  metadataElements.push(
                    <TimestampMetadata
                      key="timestamps"
                      created_at={organization.created_at}
                      updated_at={organization.updated_at}
                    />,
                  );
                }

                // Link section
                metadataElements.push(
                  <List.Item.Detail.Metadata.Link
                    key="link"
                    title="Open in Zendesk"
                    text="View Organization Profile"
                    target={`https://${currentInstance?.subdomain}.zendesk.com/agent/organizations/${organization.id}`}
                  />,
                );

                // Add separators between sections
                const finalElements: React.ReactNode[] = [];
                metadataElements.forEach((element, index) => {
                  if (index > 0) {
                    finalElements.push(<List.Item.Detail.Metadata.Separator key={`separator-${index}`} />);
                  }
                  finalElements.push(element);
                });

                return (
                  <List.Item
                    key={organization.id}
                    title={organization.name}
                    icon={undefined}
                    detail={
                      <List.Item.Detail
                        metadata={
                          <List.Item.Detail.Metadata>
                            <>{finalElements}</>
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
                                <List.Item.Detail.Metadata.TagList.Item
                                  key={variant.id}
                                  text={`${variant.locale_id}`}
                                />
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
                return (
                  <MacroListItem
                    key={macro.id}
                    macro={macro}
                    instance={currentInstance}
                    onInstanceChange={setCurrentInstance}
                    showDetails={showDetails}
                    onShowDetailsChange={setShowDetails}
                  />
                );
              } else if (searchType === "ticket_fields") {
                const ticketField = item as ZendeskTicketField;
                return (
                  <TicketFieldListItem
                    key={ticketField.id}
                    ticketField={ticketField}
                    instance={currentInstance}
                    onInstanceChange={setCurrentInstance}
                    showDetails={showDetails}
                    onShowDetailsChange={setShowDetails}
                  />
                );
              } else if (searchType === "ticket_forms") {
                const ticketForm = item as ZendeskTicketForm;
                return (
                  <TicketFormListItem
                    key={ticketForm.id}
                    ticketForm={ticketForm}
                    instance={currentInstance}
                    onInstanceChange={setCurrentInstance}
                    showDetails={showDetails}
                    onShowDetailsChange={setShowDetails}
                  />
                );
              } else if (searchType === "groups") {
                const group = item as ZendeskGroup;
                return (
                  <GroupListItem
                    key={group.id}
                    group={group}
                    instance={currentInstance}
                    onInstanceChange={setCurrentInstance}
                    showDetails={showDetails}
                    onShowDetailsChange={setShowDetails}
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
                  <ViewListItem
                    key={view.id}
                    view={view}
                    instance={currentInstance}
                    onInstanceChange={setCurrentInstance}
                    showDetails={showDetails}
                    onShowDetailsChange={setShowDetails}
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
