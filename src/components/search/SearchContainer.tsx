import { useState } from "react";
import { List } from "@raycast/api";
import { SearchType, SEARCH_TYPE_PLACEHOLDERS } from "../../types/search";
import { useInstanceManagement } from "../../hooks/useInstanceManagement";
import { useZendeskSearch } from "../../hooks/useZendeskSearch";
import { SearchTypeSelector } from "./SearchTypeSelector";
import { UserSearchResults } from "./search-types/UserSearchResults";
import { GenericSearchResults } from "./search-types/GenericSearchResults";
import {
  ZendeskUser,
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
} from "../../api/zendesk";

type GenericEntity =
  | ZendeskOrganization
  | ZendeskTrigger
  | ZendeskDynamicContent
  | ZendeskMacro
  | ZendeskTicketField
  | ZendeskSupportAddress
  | ZendeskTicketForm
  | ZendeskGroup
  | ZendeskTicket
  | ZendeskView;

export default function SearchContainer() {
  const [searchType, setSearchType] = useState<SearchType>("tickets");
  const [searchText, setSearchText] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const { currentInstance, switchInstance, hasInstances } = useInstanceManagement();

  const { results, isLoading } = useZendeskSearch(searchType, searchText, currentInstance);

  // Show configuration error if no instances
  if (!hasInstances) {
    return (
      <List>
        <List.EmptyView
          title="No Zendesk Instances Configured"
          description="Please add your Zendesk instances in the extension preferences."
        />
      </List>
    );
  }

  const renderSearchResults = () => {
    if (searchType === "users") {
      return (
        <UserSearchResults
          results={results as ZendeskUser[]}
          isLoading={isLoading}
          searchText={searchText}
          instance={currentInstance}
          onInstanceChange={switchInstance}
          showDetails={showDetails}
          onShowDetailsChange={setShowDetails}
        />
      );
    }

    // Use GenericSearchResults for all other search types
    return (
      <GenericSearchResults
        results={results as never[]}
        searchType={searchType as Exclude<SearchType, "users">}
        isLoading={isLoading}
        searchText={searchText}
        instance={currentInstance}
        onInstanceChange={switchInstance}
        showDetails={showDetails}
        onShowDetailsChange={setShowDetails}
      />
    );
  };

  return (
    <List
      isShowingDetail={showDetails}
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={SEARCH_TYPE_PLACEHOLDERS[searchType]}
      throttle
      searchBarAccessory={<SearchTypeSelector value={searchType} onChange={setSearchType} />}
    >
      {/* Empty state handling */}
      {results.length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}

      {results.length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title={`Start Typing to Search ${searchType}`}
          description={`Enter a keyword to find Zendesk ${searchType}.`}
        />
      )}

      {/* Render search results */}
      {renderSearchResults()}
    </List>
  );
}
