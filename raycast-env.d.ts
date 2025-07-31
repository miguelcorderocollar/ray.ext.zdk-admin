/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Zendesk Instances Configuration (JSON) - A JSON array of Zendesk instance configurations. See README.md for example. */
  "zendeskInstances": string
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

