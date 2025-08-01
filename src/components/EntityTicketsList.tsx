import { List, showToast, Toast, Color, Icon } from "@raycast/api";
import { useState, useEffect } from "react";
import { ZendeskInstance } from "../utils/preferences";
import { searchZendeskTickets, ZendeskTicket } from "../api/zendesk";
import { ZendeskActions } from "./ZendeskActions";

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

interface EntityTicketsListProps {
  entityType: "user" | "group" | "organization" | "brand" | "form" | "recipient";
  entityId?: string;
  entityEmail?: string;
  instance: ZendeskInstance | undefined;
}

type SortOrder = "created_at_desc" | "created_at_asc" | "updated_at_desc" | "updated_at_asc" | "status" | "priority";

export default function EntityTicketsList({ entityType, entityId, entityEmail, instance }: EntityTicketsListProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [tickets, setTickets] = useState<ZendeskTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("updated_at_desc");

  useEffect(() => {
    if (instance && (entityId || entityEmail)) {
      performSearch();
    } else {
      setIsLoading(false);
    }
  }, [debouncedSearchText, sortOrder, instance, entityId, entityEmail]);

  async function performSearch() {
    if (!instance) {
      showToast(Toast.Style.Failure, "Configuration Error", "No Zendesk instances configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedTickets = await searchZendeskTickets(debouncedSearchText, instance, {
        userEmail: entityType === "user" ? entityEmail : undefined,
        groupId: entityType === "group" ? entityId : undefined,
        organizationId: entityType === "organization" ? entityId : undefined,
        brandId: entityType === "brand" ? entityId : undefined,
        formId: entityType === "form" ? entityId : undefined,
        recipient: entityType === "recipient" ? entityEmail : undefined,
      });
      const sortedTickets = sortTickets(fetchedTickets, sortOrder);
      setTickets(sortedTickets);
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast(Toast.Style.Failure, "Search Failed", errorMessage);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }

  const sortTickets = (ticketsToSort: ZendeskTicket[], order: SortOrder): ZendeskTicket[] => {
    return [...ticketsToSort].sort((a, b) => {
      switch (order) {
        case "created_at_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "created_at_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "updated_at_desc":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "updated_at_asc":
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "priority": {
          const priorityOrder: { [key: string]: number } = { urgent: 4, high: 3, normal: 2, low: 1, undefined: 0 };
          return (priorityOrder[b.priority || "undefined"] || 0) - (priorityOrder[a.priority || "undefined"] || 0);
        }
        default:
          return 0;
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
        return Color.Green;
      case "closed":
        return Color.PrimaryText;
      default:
        return Color.PrimaryText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
  };

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={`Search tickets for ${entityEmail || entityId || entityType}...`}
      throttle
      isShowingDetail
      searchBarAccessory={
        <List.Dropdown
          tooltip="Sort Tickets"
          value={sortOrder}
          onChange={(newValue) => setSortOrder(newValue as SortOrder)}
        >
          <List.Dropdown.Section title="Sort Order">
            <List.Dropdown.Item title="Updated At (Newest First)" value="updated_at_desc" />
            <List.Dropdown.Item title="Updated At (Oldest First)" value="updated_at_asc" />
            <List.Dropdown.Item title="Created At (Newest First)" value="created_at_desc" />
            <List.Dropdown.Item title="Created At (Oldest First)" value="created_at_asc" />
            <List.Dropdown.Item title="Status" value="status" />
            <List.Dropdown.Item title="Priority" value="priority" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {tickets.length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title="No tickets found for this entity."
          description="Try a different search query or check the entity's details."
        />
      )}
      {tickets.length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No matching tickets found." description="Try a different search query." />
      )}
      {tickets.map((ticket) => (
        <List.Item
          key={ticket.id}
          title={ticket.subject}
          icon={{ source: Icon.Circle, tintColor: getStatusColor(ticket.status) }}
          accessories={[
            { text: `#${ticket.id}` },
            { tag: { value: ticket.status, color: getStatusColor(ticket.status) } },
            ...(ticket.priority ? [{ tag: { value: ticket.priority, color: getPriorityColor(ticket.priority) } }] : []),
            { date: new Date(ticket.updated_at), tooltip: `Updated: ${new Date(ticket.updated_at).toLocaleString()}` },
          ]}
          detail={
            <List.Item.Detail
              markdown={`## ${ticket.subject}

${ticket.description}`}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.TagList title="Status">
                    <List.Item.Detail.Metadata.TagList.Item
                      text={ticket.status}
                      color={getStatusColor(ticket.status)}
                    />
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
                  {ticket.priority && (
                    <List.Item.Detail.Metadata.TagList title="Priority">
                      <List.Item.Detail.Metadata.TagList.Item
                        text={ticket.priority}
                        color={getPriorityColor(ticket.priority)}
                      />
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
                  {ticket.tags && ticket.tags.length > 0 && (
                    <List.Item.Detail.Metadata.TagList title="Tags">
                      {ticket.tags.map((tag) => (
                        <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  )}
                  {ticket.custom_fields?.map(
                    (field) =>
                      field.value && (
                        <List.Item.Detail.Metadata.TagList.Item key={field.id} text={`${field.id}: ${field.value}`} />
                      ),
                  )}
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ZendeskActions
              item={ticket}
              searchType="tickets"
              instance={instance}
              onInstanceChange={() => {
                /* No-op for now, instance change not directly supported here */
              }}
            />
          }
        />
      ))}
    </List>
  );
}
