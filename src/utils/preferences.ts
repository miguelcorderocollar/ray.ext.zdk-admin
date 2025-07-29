import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  zendeskSubdomain: string;
  zendeskEmail: string;
  zendeskApiToken: string;
  showUserName: boolean;
  showUserEmail: boolean;
  showUserId: boolean;
  showUserCreatedAt: boolean;
  showUserUpdatedAt: boolean;
  showUserTimeZone: boolean;
  showUserLocale: boolean;
  showUserRole: boolean;
  showUserVerified: boolean;
  showUserActive: boolean;
  showUserDetails: boolean;
  showUserNotes: boolean;
  showUserPhone: boolean;
}

export function getZendeskPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}
