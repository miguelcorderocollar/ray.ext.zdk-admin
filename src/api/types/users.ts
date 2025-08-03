import { ZendeskPhoto } from "./common";

export interface ZendeskUser {
  id: number;
  name: string;
  email: string;
  alias?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  time_zone?: string;
  locale?: string;
  role?: string;
  verified?: boolean;
  active?: boolean;
  details?: string;
  notes?: string;
  phone?: string;
  photo?: ZendeskPhoto;
}

export interface ZendeskUserSearchResponse {
  users: ZendeskUser[];
  count: number;
}
