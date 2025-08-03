import { ZendeskPhoto } from "./common";

export interface ZendeskBrand {
  id: number;
  name: string;
  active: boolean;
  brand_url: string;
  created_at: string;
  updated_at: string;
  default: boolean;
  has_help_center: boolean;
  help_center_state: string;
  host_mapping: string;
  is_deleted: boolean;
  logo?: ZendeskPhoto;
  signature_template: string;
  subdomain: string;
  ticket_form_ids?: number[];
  url: string;
}

export interface ZendeskBrandSearchResponse {
  brands: ZendeskBrand[];
  count: number;
  next_page: string | null;
  previous_page: string | null;
}

export interface ZendeskSupportAddress {
  id: number;
  url: string;
  email: string;
  name: string;
  default: boolean;
  brand_id: number;
  cname_status: string;
  dns_results: string;
  domain_verification_code: string;
  domain_verification_status: string;
  forwarding_status: string;
  spf_status: string;
  created_at: string;
  updated_at: string;
}

export interface ZendeskSupportAddressSearchResponse {
  recipient_addresses: ZendeskSupportAddress[];
  next_page: string | null;
}
