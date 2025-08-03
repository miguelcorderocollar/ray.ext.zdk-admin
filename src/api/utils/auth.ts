import { ZendeskInstance } from "../../utils/preferences";

export function getZendeskAuthHeader(instance: ZendeskInstance): string {
  const credentials = `${instance.user}/token:${instance.api_key}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}
