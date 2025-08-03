import { ZendeskInstance } from "../utils/preferences";
import { ZendeskUser, ZendeskTicket, ZendeskTicketField } from "../api/zendesk";

// Import mock data
import mockInstances from "./instances.json";
import mockTickets from "./tickets.json";
import mockUsers from "./users.json";
import mockTicketFields from "./ticket_fields.json";

export class MockDataService {
  private static instance: MockDataService;

  private constructor() {}

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  public getMockInstances(): ZendeskInstance[] {
    return mockInstances as ZendeskInstance[];
  }

  public getMockTickets(): ZendeskTicket[] {
    return mockTickets as ZendeskTicket[];
  }

  public getMockUsers(): ZendeskUser[] {
    return mockUsers as ZendeskUser[];
  }

  public getMockTicketFields(): ZendeskTicketField[] {
    return mockTicketFields as ZendeskTicketField[];
  }

  public searchMockUsers(query: string): ZendeskUser[] {
    const users = this.getMockUsers();
    if (!query) return users;

    const searchTerm = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.alias?.toLowerCase().includes(searchTerm) ||
        user.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  public searchMockTickets(query: string): ZendeskTicket[] {
    const tickets = this.getMockTickets();
    if (!query) return tickets;

    const searchTerm = query.toLowerCase();
    return tickets.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        ticket.external_id.toLowerCase().includes(searchTerm)
    );
  }

  public searchMockTicketFields(query: string): ZendeskTicketField[] {
    const fields = this.getMockTicketFields();
    if (!query) return fields;

    const searchTerm = query.toLowerCase();
    return fields.filter(
      (field) =>
        field.title.toLowerCase().includes(searchTerm) ||
        field.description.toLowerCase().includes(searchTerm)
    );
  }
} 