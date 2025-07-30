import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  zendeskSubdomain: string;
  zendeskEmail: string;
  zendeskApiToken: string;
  instanceColor?: string;
}

export function getZendeskPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}
