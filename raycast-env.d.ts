/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Instance Names - Comma-separated list of Zendesk instance names (e.g., 'My Company, Test Instance, Production') */
  "instanceNames": string,
  /** Subdomains - Comma-separated list of Zendesk subdomains (e.g., 'yourcompany, testcompany, prodcompany') */
  "subdomains": string,
  /** API Users - Comma-separated list of API users (e.g., 'api_user@yourcompany.com/token, test@testcompany.com/token') */
  "users": string,
  /** API Keys - Comma-separated list of API keys corresponding to each instance */
  "apiKeys": string,
  /** Colors (Optional) - Comma-separated list of hex colors for each instance (e.g., '#007bff, #28a745, #dc3545') */
  "colors"?: string,
  /** Production Flags (Optional) - Comma-separated list of 'true' or 'false' values indicating if each instance is production */
  "productionFlags"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-zendesk` command */
  export type SearchZendesk = ExtensionPreferences & {}
  /** Preferences accessible in the `open-zendesk-instance` command */
  export type OpenZendeskInstance = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-zendesk` command */
  export type SearchZendesk = {}
  /** Arguments passed to the `open-zendesk-instance` command */
  export type OpenZendeskInstance = {}
}

