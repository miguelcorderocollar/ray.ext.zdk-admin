export interface ZendeskOrganization {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  domain_names?: string[];
  details?: string;
  notes?: string;
  shared_tickets?: boolean;
  shared_comments?: boolean;
  external_id?: string;
  group_id?: number;
  organization_fields?: Record<string, unknown>;
  tags?: string[];
}

export interface ZendeskOrganizationSearchResponse {
  results: ZendeskOrganization[];
  count: number;
}
