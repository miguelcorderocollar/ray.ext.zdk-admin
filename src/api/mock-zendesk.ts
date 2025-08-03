/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZendeskInstance } from "../utils/preferences";
import { MockDataService } from "../mock-data/mock-data-service";
import {
  ZendeskUser,
  ZendeskOrganization,
  ZendeskTrigger,
  ZendeskTriggerCategory,
  ZendeskAutomation,
  ZendeskDynamicContent,
  ZendeskMacro,
  ZendeskTicketField,
  ZendeskSupportAddress,
  ZendeskTicketForm,
  ZendeskGroup,
  ZendeskTicket,
  ZendeskView,
  ZendeskBrand,
  ZendeskCustomRole,
} from "./zendesk";

const mockService = MockDataService.getInstance();

// Mock API functions that mirror the real Zendesk API
export async function searchZendeskUsers(query: string, _instance: ZendeskInstance): Promise<ZendeskUser[]> {
  return mockService.searchMockUsers(query);
}

export async function searchZendeskOrganizations(
  query: string,
  _instance: ZendeskInstance,
): Promise<ZendeskOrganization[]> {
  return mockService.searchMockOrganizations(query);
}

export async function searchZendeskTriggers(query: string, _instance: ZendeskInstance): Promise<ZendeskTrigger[]> {
  return mockService.searchMockTriggers(query);
}

export async function searchZendeskTriggerCategories(
  _instance: ZendeskInstance,
  onPage: (categories: ZendeskTriggerCategory[]) => void,
): Promise<void> {
  const categories = mockService.getMockTriggerCategories();
  onPage(categories);
}

export async function searchZendeskAutomations(
  query: string,
  _instance: ZendeskInstance,
): Promise<ZendeskAutomation[]> {
  return mockService.searchMockAutomations(query);
}

export async function searchZendeskDynamicContent(
  query: string,
  _instance: ZendeskInstance,
  onPage: (items: ZendeskDynamicContent[]) => void,
): Promise<void> {
  const content = mockService.searchMockDynamicContent(query);
  onPage(content);
}

export async function searchZendeskMacros(query: string, _instance: ZendeskInstance): Promise<ZendeskMacro[]> {
  return mockService.searchMockMacros(query);
}

export async function searchZendeskTicketFields(
  query: string,
  _instance: ZendeskInstance,
): Promise<ZendeskTicketField[]> {
  return mockService.searchMockTicketFields(query);
}

export async function searchZendeskSupportAddresses(
  _instance: ZendeskInstance,
  onPage: (addresses: ZendeskSupportAddress[]) => void,
): Promise<void> {
  const addresses = mockService.getMockSupportAddresses();
  onPage(addresses);
}

export async function searchZendeskTicketForms(
  query: string,
  _instance: ZendeskInstance,
): Promise<ZendeskTicketForm[]> {
  return mockService.searchMockTicketForms(query);
}

export async function searchZendeskGroups(_instance: ZendeskInstance): Promise<ZendeskGroup[]> {
  return mockService.getMockGroups();
}

export async function searchZendeskBrands(
  _instance: ZendeskInstance,
  onPage: (brands: ZendeskBrand[]) => void,
): Promise<void> {
  const brands = mockService.getMockBrands();
  onPage(brands);
}

export async function searchZendeskTickets(
  query: string,
  _instance: ZendeskInstance,
  _filters?: {
    userEmail?: string;
    groupId?: string;
    organizationId?: string;
    brandId?: string;
    formId?: string;
    recipient?: string;
    roleId?: string;
  },
): Promise<ZendeskTicket[]> {
  return mockService.searchMockTickets(query);
}

export async function searchZendeskViews(query: string, _instance: ZendeskInstance): Promise<ZendeskView[]> {
  return mockService.searchMockViews(query);
}

export async function searchZendeskCustomRoles(
  query: string,
  _instance: ZendeskInstance,
): Promise<ZendeskCustomRole[]> {
  return mockService.searchMockCustomRoles(query);
}

// Mock functions for other operations that might be needed
export async function updateUser(
  userId: number,
  updatedFields: Record<string, unknown>,
  _instance: ZendeskInstance,
): Promise<ZendeskUser> {
  // Return a mock user for update operations
  const users = mockService.getMockUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  return { ...user, ...updatedFields } as ZendeskUser;
}

export async function createUser(name: string, email: string, _instance: ZendeskInstance): Promise<ZendeskUser> {
  // Return a mock user for create operations
  const newUser: ZendeskUser = {
    id: Math.floor(Math.random() * 10000) + 1000,
    name,
    email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
    verified: true,
    role: "end-user",
  };
  return newUser;
}

export async function addTicketFieldOption(
  _ticketFieldId: number,
  _label: string,
  _tag: string,
  _instance: ZendeskInstance,
): Promise<void> {
  // Mock implementation - just return successfully
  return Promise.resolve();
}

export async function searchZendeskGroupMemberships(
  _groupId: number,
  _instance: ZendeskInstance,
  onPage: (memberships: Record<string, unknown>[]) => void,
): Promise<void> {
  // Return empty array for group memberships
  onPage([]);
}

export async function searchZendeskUserGroupMemberships(
  _userId: number,
  _instance: ZendeskInstance,
  onPage: (memberships: Record<string, unknown>[]) => void,
): Promise<void> {
  // Return empty array for user group memberships
  onPage([]);
}

export async function getGroupUsers(_groupId: number, _instance: ZendeskInstance): Promise<ZendeskUser[]> {
  // Return a subset of mock users for group users
  const users = mockService.getMockUsers();
  return users.slice(0, 3); // Return first 3 users as mock group members
}

export async function getUserGroups(_userId: number, _instance: ZendeskInstance): Promise<ZendeskGroup[]> {
  // Return a subset of mock groups for user groups
  const groups = mockService.getMockGroups();
  return groups.slice(0, 2); // Return first 2 groups as mock user groups
}
