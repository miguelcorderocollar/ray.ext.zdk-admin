/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Zendesk Subdomain - Your Zendesk subdomain (e.g., yourcompany). */
  "zendeskSubdomain": string,
  /** Zendesk Email - Your Zendesk email address. */
  "zendeskEmail": string,
  /** Zendesk API Token - Your Zendesk API token. Generate one in Zendesk Admin Center > Apps and Integrations > Zendesk API. */
  "zendeskApiToken": string,
  /** Show User Name - Display the user's name in the detail view. */
  "showUserName": boolean,
  /** Show User Email - Display the user's email in the detail view. */
  "showUserEmail": boolean,
  /** Show User ID - Display the user's ID in the detail view. */
  "showUserId": boolean,
  /** Show Created At - Display the user's creation timestamp in the detail view. */
  "showUserCreatedAt": boolean,
  /** Show Updated At - Display the user's last update timestamp in the detail view. */
  "showUserUpdatedAt": boolean,
  /** Show Time Zone - Display the user's time zone in the detail view. */
  "showUserTimeZone": boolean,
  /** Show Locale - Display the user's locale in the detail view. */
  "showUserLocale": boolean,
  /** Show Role - Display the user's role in the detail view. */
  "showUserRole": boolean,
  /** Show Verified Status - Display whether the user is verified in the detail view. */
  "showUserVerified": boolean,
  /** Show Active Status - Display whether the user is active in the detail view. */
  "showUserActive": boolean,
  /** Show Details - Display the user's details field in the detail view. */
  "showUserDetails": boolean,
  /** Show Notes - Display the user's notes field in the detail view. */
  "showUserNotes": boolean,
  /** Show Phone - Display the user's phone number in the detail view. */
  "showUserPhone": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-people` command */
  export type SearchPeople = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-people` command */
  export type SearchPeople = {}
}

