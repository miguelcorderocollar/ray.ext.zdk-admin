export interface ZendeskDynamicContent {
  id: number;
  name: string;
  placeholder: string;
  default_locale_id: number;
  created_at: string;
  updated_at: string;
  variants: ZendeskDynamicContentVariant[];
}

export interface ZendeskDynamicContentVariant {
  id: number;
  locale_id: number;
  active: boolean;
  default: boolean;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ZendeskDynamicContentListResponse {
  items: ZendeskDynamicContent[];
  next_page: string | null;
}

export interface ZendeskTicketField {
  id: number;
  url: string;
  type: string;
  title: string;
  raw_title: string;
  description: string;
  raw_description: string;
  position: number;
  active: boolean;
  required: boolean;
  collapsed_for_agents: boolean;
  regexp_for_validation: string | null;
  title_in_portal: string;
  raw_title_in_portal: string;
  visible_in_portal: boolean;
  editable_in_portal: boolean;
  required_in_portal: boolean;
  tag: string | null;
  created_at: string;
  updated_at: string;
  removable: boolean;
  agent_description: string | null;
  system_field_options: unknown[];
  custom_field_options?: ZendeskCustomFieldOption[];
  sub_type_id: number | null;
  permission_group_id: number | null;
}

export interface ZendeskCustomFieldOption {
  id: number;
  name: string;
  value: string | null;
  default: boolean;
}

export interface ZendeskTicketFieldSearchResponse {
  ticket_fields: ZendeskTicketField[];
}

export interface ZendeskTicketForm {
  id: number;
  name: string;
  display_name: string;
  position: number;
  active: boolean;
  end_user_visible: boolean;
  default: boolean;
  in_all_brands: boolean;
  restricted_brand_ids: number[];
  created_at: string;
  updated_at: string;
}

export interface ZendeskTicketFormSearchResponse {
  ticket_forms: ZendeskTicketForm[];
}

export interface ZendeskView {
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
}

export interface ZendeskViewSearchResponse {
  views: ZendeskView[];
  count: number;
}
