import { useState, useEffect } from "react";
import { showToast, Toast } from "@raycast/api";
import { ZendeskInstance } from "../utils/preferences";
import { SearchType } from "../types/search";
import {
  searchZendeskUsers,
  searchZendeskOrganizations,
  searchZendeskTriggers,
  searchZendeskDynamicContent,
  searchZendeskMacros,
  searchZendeskTicketFields,
  searchZendeskSupportAddresses,
  searchZendeskTicketForms,
  searchZendeskGroups,
  searchZendeskTickets,
  searchZendeskViews,
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
} from "../api/zendesk";

// Custom debounce hook
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

// Generic search hook for different entity types
export function useZendeskSearch<T>(
  searchType: SearchType,
  searchText: string,
  instance: ZendeskInstance | undefined,
  debounceMs: number = 500,
) {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchText = useDebounce(searchText, debounceMs);

  // Reset results when search type or instance changes
  useEffect(() => {
    setResults([]);
    setError(null);
  }, [searchType, instance]);

  useEffect(() => {
    const performSearch = async () => {
      if (!instance) {
        setError("No Zendesk instance configured");
        return;
      }

      // Allow empty searches for types that can show initial results
      if (
        !debouncedSearchText &&
        ![
          "dynamic_content",
          "support_addresses",
          "groups",
          "views",
          "triggers",
          "macros",
          "ticket_fields",
          "ticket_forms",
        ].includes(searchType)
      ) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let searchResults: T[] = [];

        switch (searchType) {
          case "users":
            searchResults = (await searchZendeskUsers(debouncedSearchText, instance)) as T[];
            break;
          case "organizations":
            searchResults = (await searchZendeskOrganizations(debouncedSearchText, instance)) as T[];
            break;
          case "triggers":
            searchResults = (await searchZendeskTriggers(debouncedSearchText, instance)) as T[];
            break;
          case "dynamic_content":
            // Dynamic content loads all items and filters client-side
            await searchZendeskDynamicContent(debouncedSearchText, instance, (page) => {
              setResults((prev) => [...prev, ...page] as T[]);
            });
            return; // Early return to avoid setting results again
          case "macros":
            searchResults = (await searchZendeskMacros(debouncedSearchText, instance)) as T[];
            break;
          case "ticket_fields":
            searchResults = (await searchZendeskTicketFields(debouncedSearchText, instance)) as T[];
            break;
          case "support_addresses":
            // Support addresses loads all items with callback, similar to dynamic content
            await searchZendeskSupportAddresses(instance, (page) => {
              setResults((prev) => [...prev, ...page] as T[]);
            });
            return; // Early return to avoid setting results again
          case "ticket_forms":
            searchResults = (await searchZendeskTicketForms(debouncedSearchText, instance)) as T[];
            break;
          case "groups":
            searchResults = (await searchZendeskGroups(instance)) as T[];
            break;
          case "tickets":
            searchResults = (await searchZendeskTickets(debouncedSearchText, instance)) as T[];
            break;
          case "views":
            searchResults = (await searchZendeskViews(debouncedSearchText, instance)) as T[];
            break;
          default:
            throw new Error(`Unknown search type: ${searchType}`);
        }

        setResults(searchResults);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        showToast(Toast.Style.Failure, "Search Failed", errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchText, searchType, instance]);

  return {
    results,
    isLoading,
    error,
    debouncedSearchText,
  };
}

// Specific typed hooks for each search type
export const useUserSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskUser>("users", searchText, instance);

export const useOrganizationSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskOrganization>("organizations", searchText, instance);

export const useTriggerSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskTrigger>("triggers", searchText, instance);

export const useDynamicContentSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskDynamicContent>("dynamic_content", searchText, instance);

export const useMacroSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskMacro>("macros", searchText, instance);

export const useTicketFieldSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskTicketField>("ticket_fields", searchText, instance);

export const useSupportAddressSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskSupportAddress>("support_addresses", searchText, instance);

export const useTicketFormSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskTicketForm>("ticket_forms", searchText, instance);

export const useGroupSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskGroup>("groups", searchText, instance);

export const useTicketSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskTicket>("tickets", searchText, instance);

export const useViewSearch = (searchText: string, instance: ZendeskInstance | undefined) =>
  useZendeskSearch<ZendeskView>("views", searchText, instance);
