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
  /** Instance Color - Color for the current Zendesk instance (e.g., #FF0000, blue, red). */
  "instanceColor": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-zendesk` command */
  export type SearchZendesk = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-zendesk` command */
  export type SearchZendesk = {}
}

