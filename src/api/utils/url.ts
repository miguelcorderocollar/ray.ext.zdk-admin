import { ZendeskInstance } from "../../utils/preferences";

export function getZendeskUrl(instance: ZendeskInstance): string {
  return `https://${instance.subdomain}.zendesk.com/api/v2`;
}
