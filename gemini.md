# Gemini's Guide to Raycast Extension Development

This document outlines the approach for developing Raycast extensions, emphasizing a structured, step-by-step process, and leveraging the official Raycast developer documentation.

## Core Principles

1.  **Consult Raycast Documentation First:** Always refer to `https://developers.raycast.com/` for the most accurate and up-to-date information on APIs, components, and best practices.
2.  **Iterative Development:** Build features incrementally, verifying each milestone before proceeding.
3.  **Test-Driven Approach (where applicable):** Write tests for critical logic to ensure correctness and prevent regressions.
4.  **Clear Planning:** Utilize `docs/technical_plan.md` and `docs/development_plan.md` for detailed planning and progress tracking.

## Development Workflow

Follow these steps for each development phase:

### 1. Understand the Goal

-   Refer to `docs/development_plan.md` for the current phase's objective and steps.
-   Consult `docs/zendesk_user_search_details.md` for the overall extension features and requirements.

### 2. Research Raycast API

-   **Key Resource:** `https://developers.raycast.com/api-reference`
-   For UI components (List, Detail, Form, ActionPanel), refer to:
    -   `https://developers.raycast.com/api-reference/components/list`
    -   `https://developers.raycast.com/api-reference/components/detail`
    -   `https://developers.raycast.com/api-reference/components/form`
    -   `https://developers.raycast.com/api-reference/components/actionpanel`
-   For utility hooks (`useFetch`, `useLocalStorage`), refer to:
    -   `https://developers.raycast.com/api-reference/utils/usefetch`
    -   `https://developers.raycast.com/api-reference/utils/uselocalstorage`
-   For preferences and local storage, refer to:
    -   `https://developers.raycast.com/api-reference/api/preferences`
    -   `https://developers.raycast.com/api-reference/api/setlocalstorage`

### 3. Implement Code

-   Write code in the `src/` directory, adhering to the project's established conventions.
-   Ensure proper import statements for Raycast API components and utilities.

### 4. Verify and Test

-   Run `npm run lint` and `npm run fix-lint` to ensure code style and quality.
-   Run `ray develop` to test the extension in Raycast.
-   If applicable, write and run unit tests.
-   Check off completed steps in `docs/development_plan.md`.

## Current Status

We have completed the initial setup and the "Hello World" phase. The project structure is now ready for further development as outlined in the `docs/development_plan.md`.
