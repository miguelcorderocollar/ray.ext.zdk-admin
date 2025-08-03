import { showToast, Toast } from "@raycast/api";

export function handleZendeskError(response: Response, operation: string): never {
  const errorText = response.text();
  showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to ${operation}: ${response.status} - ${errorText}`);
  throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
}

export function handleConnectionError(error: unknown): never {
  showToast(
    Toast.Style.Failure,
    "Connection Error",
    "Could not connect to Zendesk API. Please check your internet connection or API settings.",
  );
  throw error;
}

export async function handleUserCreationError(response: Response): Promise<never> {
  const errorText = await response.text();
  let errorMessage = `Failed to create user: ${response.status}`;

  try {
    const errorJson = JSON.parse(errorText);
    if (
      errorJson.details &&
      errorJson.details.email &&
      errorJson.details.email[0] &&
      errorJson.details.email[0].error === "DuplicateValue"
    ) {
      errorMessage = errorJson.details.email[0].description || `Failed to create user: Email already exists.`;
    } else if (errorJson.description) {
      errorMessage = `Failed to create user: ${errorJson.description}`;
    } else if (errorJson.error) {
      errorMessage = `Failed to create user: ${errorJson.error}`;
    } else {
      errorMessage = `Failed to create user: An unexpected error occurred.`;
    }
  } catch (parseError) {
    console.error("Failed to parse error response as JSON:", parseError);
    errorMessage = `Failed to create user: An unexpected error occurred. Please check logs for details.`;
  }

  showToast(Toast.Style.Failure, "Zendesk API Error", errorMessage);
  throw new Error(`Zendesk API Error: ${errorMessage}`);
}
