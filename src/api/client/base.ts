import { ZendeskInstance } from "../../utils/preferences";
import { getZendeskAuthHeader, getZendeskUrl, handleZendeskError, handleConnectionError } from "../utils";

export class ZendeskBaseClient {
  protected instance: ZendeskInstance;

  constructor(instance: ZendeskInstance) {
    this.instance = instance;
  }

  protected getBaseUrl(): string {
    return getZendeskUrl(this.instance);
  }

  protected getHeaders(): Record<string, string> {
    return {
      Authorization: getZendeskAuthHeader(this.instance),
      "Content-Type": "application/json",
    };
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    operation: string = "fetch data",
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    console.log(`Zendesk API URL: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        await handleZendeskError(response, operation);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Zendesk API Error")) {
        throw error;
      }
      return handleConnectionError(error);
    }
  }

  protected async makeGetRequest<T>(endpoint: string, operation?: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET" }, operation);
  }

  protected async makePostRequest<T>(endpoint: string, body: Record<string, unknown>, operation?: string): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      operation,
    );
  }

  protected async makePutRequest<T>(endpoint: string, body: Record<string, unknown>, operation?: string): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      operation,
    );
  }

  protected async makeDeleteRequest<T>(endpoint: string, operation?: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" }, operation);
  }
}
