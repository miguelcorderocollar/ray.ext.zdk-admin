export interface ZendeskTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  organization_id: number;
  brand_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  external_id: string;
  recipient: string;
  tags: string[];
  ticket_form_id: number;
  priority: string;
  type: string;
  via: { channel: string; source: { from: Record<string, unknown>; to: Record<string, unknown> }; rel: string };
  custom_fields: { id: number; value: string | null }[];
}

export interface ZendeskTicketSearchResponse {
  results: ZendeskTicket[];
  count: number;
}
