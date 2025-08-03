import { ZendeskInstance } from "../utils/preferences";
import {
  ZendeskUser,
  ZendeskTicket,
  ZendeskTicketField,
  ZendeskOrganization,
  ZendeskTrigger,
  ZendeskTriggerCategory,
  ZendeskAutomation,
  ZendeskDynamicContent,
  ZendeskMacro,
  ZendeskSupportAddress,
  ZendeskTicketForm,
  ZendeskGroup,
  ZendeskView,
  ZendeskBrand,
  ZendeskCustomRole,
} from "../api/zendesk";

// Import mock data
import mockInstances from "./instances.json";
import mockTickets from "./tickets.json";
import mockUsers from "./users.json";
import mockTicketFields from "./ticket_fields.json";
import mockOrganizations from "./organizations.json";
import mockTriggers from "./triggers.json";
import mockTriggerCategories from "./trigger_categories.json";
import mockAutomations from "./automations.json";
import mockDynamicContent from "./dynamic_content.json";
import mockMacros from "./macros.json";
import mockSupportAddresses from "./support_addresses.json";
import mockTicketForms from "./ticket_forms.json";
import mockGroups from "./groups.json";
import mockViews from "./views.json";
import mockBrands from "./brands.json";
import mockCustomRoles from "./custom_roles.json";

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

  public getMockOrganizations(): ZendeskOrganization[] {
    return mockOrganizations as ZendeskOrganization[];
  }

  public getMockTriggers(): ZendeskTrigger[] {
    return mockTriggers as ZendeskTrigger[];
  }

  public getMockTriggerCategories(): ZendeskTriggerCategory[] {
    return mockTriggerCategories as ZendeskTriggerCategory[];
  }

  public getMockAutomations(): ZendeskAutomation[] {
    return mockAutomations as ZendeskAutomation[];
  }

  public getMockDynamicContent(): ZendeskDynamicContent[] {
    return mockDynamicContent as ZendeskDynamicContent[];
  }

  public getMockMacros(): ZendeskMacro[] {
    return mockMacros as ZendeskMacro[];
  }

  public getMockSupportAddresses(): ZendeskSupportAddress[] {
    return mockSupportAddresses as ZendeskSupportAddress[];
  }

  public getMockTicketForms(): ZendeskTicketForm[] {
    return mockTicketForms as ZendeskTicketForm[];
  }

  public getMockGroups(): ZendeskGroup[] {
    return mockGroups as ZendeskGroup[];
  }

  public getMockViews(): ZendeskView[] {
    return mockViews as ZendeskView[];
  }

  public getMockBrands(): ZendeskBrand[] {
    return mockBrands as ZendeskBrand[];
  }

  public getMockCustomRoles(): ZendeskCustomRole[] {
    return mockCustomRoles as ZendeskCustomRole[];
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
        user.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
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
        ticket.external_id.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockTicketFields(query: string): ZendeskTicketField[] {
    const fields = this.getMockTicketFields();
    if (!query) return fields;

    const searchTerm = query.toLowerCase();
    return fields.filter(
      (field) => field.title.toLowerCase().includes(searchTerm) || field.description.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockOrganizations(query: string): ZendeskOrganization[] {
    const organizations = this.getMockOrganizations();
    if (!query) return organizations;

    const searchTerm = query.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(searchTerm) ||
        org.details?.toLowerCase().includes(searchTerm) ||
        org.notes?.toLowerCase().includes(searchTerm) ||
        org.domain_names?.some((domain) => domain.toLowerCase().includes(searchTerm)) ||
        org.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  }

  public searchMockTriggers(query: string): ZendeskTrigger[] {
    const triggers = this.getMockTriggers();
    if (!query) return triggers;

    const searchTerm = query.toLowerCase();
    return triggers.filter(
      (trigger) =>
        trigger.title.toLowerCase().includes(searchTerm) ||
        trigger.description?.toLowerCase().includes(searchTerm) ||
        trigger.raw_title.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockTriggerCategories(query: string): ZendeskTriggerCategory[] {
    const categories = this.getMockTriggerCategories();
    if (!query) return categories;

    const searchTerm = query.toLowerCase();
    return categories.filter((category) => category.name.toLowerCase().includes(searchTerm));
  }

  public searchMockAutomations(query: string): ZendeskAutomation[] {
    const automations = this.getMockAutomations();
    if (!query) return automations;

    const searchTerm = query.toLowerCase();
    return automations.filter(
      (automation) =>
        automation.title.toLowerCase().includes(searchTerm) || automation.raw_title.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockDynamicContent(query: string): ZendeskDynamicContent[] {
    const content = this.getMockDynamicContent();
    if (!query) return content;

    const searchTerm = query.toLowerCase();
    return content.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.placeholder.toLowerCase().includes(searchTerm) ||
        item.variants.some((variant) => variant.content.toLowerCase().includes(searchTerm)),
    );
  }

  public searchMockMacros(query: string): ZendeskMacro[] {
    const macros = this.getMockMacros();
    if (!query) return macros;

    const searchTerm = query.toLowerCase();
    return macros.filter(
      (macro) =>
        macro.title.toLowerCase().includes(searchTerm) || macro.description?.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockSupportAddresses(query: string): ZendeskSupportAddress[] {
    const addresses = this.getMockSupportAddresses();
    if (!query) return addresses;

    const searchTerm = query.toLowerCase();
    return addresses.filter(
      (address) => address.name.toLowerCase().includes(searchTerm) || address.email.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockTicketForms(query: string): ZendeskTicketForm[] {
    const forms = this.getMockTicketForms();
    if (!query) return forms;

    const searchTerm = query.toLowerCase();
    return forms.filter(
      (form) => form.name.toLowerCase().includes(searchTerm) || form.display_name.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockGroups(query: string): ZendeskGroup[] {
    const groups = this.getMockGroups();
    if (!query) return groups;

    const searchTerm = query.toLowerCase();
    return groups.filter(
      (group) => group.name.toLowerCase().includes(searchTerm) || group.description.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockViews(query: string): ZendeskView[] {
    const views = this.getMockViews();
    if (!query) return views;

    const searchTerm = query.toLowerCase();
    return views.filter((view) => view.title.toLowerCase().includes(searchTerm));
  }

  public searchMockBrands(query: string): ZendeskBrand[] {
    const brands = this.getMockBrands();
    if (!query) return brands;

    const searchTerm = query.toLowerCase();
    return brands.filter(
      (brand) => brand.name.toLowerCase().includes(searchTerm) || brand.subdomain.toLowerCase().includes(searchTerm),
    );
  }

  public searchMockCustomRoles(query: string): ZendeskCustomRole[] {
    const roles = this.getMockCustomRoles();
    if (!query) return roles;

    const searchTerm = query.toLowerCase();
    return roles.filter(
      (role) => role.name.toLowerCase().includes(searchTerm) || role.description.toLowerCase().includes(searchTerm),
    );
  }
}
