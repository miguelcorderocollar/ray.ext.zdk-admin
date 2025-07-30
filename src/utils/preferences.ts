import { getPreferenceValues } from "@raycast/api";

export interface ZendeskInstance {
  subdomain: string;
  user: string;
  api_key: string;
  color?: string;
}

interface Preferences {
  zendeskInstances: string; // This will be a JSON string of ZendeskInstance[]
}

export function getZendeskInstances(): ZendeskInstance[] {
  const preferences = getPreferenceValues<Preferences>();
  try {
    return JSON.parse(preferences.zendeskInstances) as ZendeskInstance[];
  } catch (e) {
    console.error("Failed to parse Zendesk instances from preferences", e);
    return [];
  }
}
