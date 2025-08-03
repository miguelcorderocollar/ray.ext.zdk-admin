export interface ZendeskTrigger {
  url: string;
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
  default: boolean;
  actions: Array<{ field: string; value: string | string[] }>;
  conditions: { all: Array<unknown>; any: Array<unknown> };
  description: string | null;
  position: number;
  raw_title: string;
  category_id: string;
}

export interface ZendeskTriggerSearchResponse {
  triggers: ZendeskTrigger[];
  count: number;
}

export interface ZendeskTriggerCategory {
  id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ZendeskTriggerCategorySearchResponse {
  trigger_categories: ZendeskTriggerCategory[];
  links?: {
    next?: string;
    prev?: string;
  };
  meta?: {
    after_cursor?: string;
    before_cursor?: string;
    has_more?: boolean;
  };
}

export interface ZendeskAutomation {
  id: number;
  title: string;
  raw_title: string;
  active: boolean;
  position: number;
  actions: Array<{ field: string; value: string | string[] }>;
  conditions: { all: Array<unknown>; any: Array<unknown> };
  created_at: string;
  updated_at: string;
}

export interface ZendeskAutomationSearchResponse {
  automations: ZendeskAutomation[];
  count: number;
  next_page: string | null;
  previous_page: string | null;
}

export interface ZendeskMacro {
  url: string;
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
  usage_count: number;
  description: string | null;
}

export interface ZendeskMacroListResponse {
  macros: ZendeskMacro[];
}
