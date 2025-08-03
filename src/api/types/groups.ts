export interface ZendeskGroup {
  id: number;
  name: string;
  description: string;
  default: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  url: string;
  is_public: boolean;
}

export interface ZendeskGroupSearchResponse {
  groups: ZendeskGroup[];
  next_page: string | null;
}

export interface ZendeskGroupMembership {
  id: number;
  user_id: number;
  group_id: number;
  default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ZendeskGroupMembershipResponse {
  group_memberships: ZendeskGroupMembership[];
}

export interface ZendeskCustomRole {
  id: number;
  name: string;
  description: string;
  role_type: number;
  team_member_count: number;
  created_at: string;
  updated_at: string;
  configuration?: {
    assign_tickets_to_any_group: boolean;
    chat_access: boolean;
    end_user_list_access: string;
    end_user_profile_access: string;
    explore_access: string;
    forum_access: string;
    forum_access_restricted_content: boolean;
    group_access: boolean;
    light_agent: boolean;
    macro_access: string;
    manage_business_rules: boolean;
    manage_contextual_workspaces: boolean;
    manage_dynamic_content: boolean;
    manage_extensions_and_channels: boolean;
    manage_facebook: boolean;
    manage_organization_fields: boolean;
    manage_ticket_fields: boolean;
    manage_ticket_forms: boolean;
    manage_user_fields: boolean;
    moderate_forums: boolean;
    organization_editing: boolean;
    organization_notes_editing: boolean;
    report_access: string;
    side_conversation_create: boolean;
    ticket_access: string;
    ticket_comment_access: string;
    ticket_deletion: boolean;
    ticket_editing: boolean;
    ticket_merge: boolean;
    ticket_tag_editing: boolean;
    twitter_search_access: boolean;
    user_view_access: string;
    view_access: string;
    view_deleted_tickets: boolean;
    voice_access: boolean;
    voice_dashboard_access: boolean;
  };
}

export interface ZendeskCustomRoleSearchResponse {
  custom_roles: ZendeskCustomRole[];
}
