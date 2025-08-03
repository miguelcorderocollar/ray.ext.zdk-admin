import { ZendeskInstance } from "../../utils/preferences";

export type { ZendeskInstance };

// Common photo/logo structure used across entities
export interface ZendeskPhoto {
  url: string;
  id: number;
  file_name: string;
  content_url: string;
  mapped_content_url: string;
  content_type: string;
  size: number;
  width: number;
  height: number;
  inline: boolean;
  deleted: boolean;
  thumbnails: Array<{
    url: string;
    id: number;
    file_name: string;
    content_url: string;
    mapped_content_url: string;
    content_type: string;
    size: number;
    width: number;
    height: number;
    inline: boolean;
    deleted: boolean;
  }>;
}

// Common pagination metadata
export interface ZendeskPaginationMeta {
  after_cursor?: string;
  before_cursor?: string;
  has_more?: boolean;
}

// Common pagination links
export interface ZendeskPaginationLinks {
  next?: string;
  prev?: string;
}

// Common base fields for most Zendesk entities
export interface ZendeskBaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}
