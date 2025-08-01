# Raycast Zendesk Extension Ideas

This document outlines potential features and improvements for the Raycast Zendesk extension, organized by priority and estimated difficulty.

## High Priority (Easy/Medium Difficulty)

These are features that are highly useful and relatively straightforward to implement.

### Core Search & Display Improvements
*   **Search Behavior:** Improve search behavior when changing the search type to be more intuitive.
*   **Detailed Views:** Enhance detailed views for all Zendesk objects (user, organization, group, etc.) to include more relevant information.
    *   Display options/values/conditions on details for triggers, groups, fields, etc.
    *   Display correct labels instead of IDs in search details (e.g., brands, groups, forms, fields, trigger categories).
    *   Add group memberships on group view and user details.
*   **Search Scope:** Improve search for already loaded items to search across all relevant properties.
*   **Archived Items:** Implement special rules to move `[ARCHIVE]` items to the bottom of search results or hide them.

### Essential Actions
*   **Basic Actions:** Ensure all essential actions are available: edit, view tickets, and open in Zendesk for relevant items.
*   **Specific Entry Point Actions:** Add direct entry points for common creation tasks:
    *   Create User
    *   Create Organization
    *   Create Ticket Field
    *   Create Ticket Form
    *   Create Group
    *   Create Macro
    *   Create Trigger
    *   Create Dynamic Content
    *   Create Support Address
    *   Create View

### Instance & Configuration Management
*   **Instance Switching:**
    *   Allow instance selection via a form upon opening the extension.
    *   Implement hotkeys for quick instance switching between configured instances.

## Medium Priority (Medium/Hard Difficulty)

These features offer significant value but may require more complex implementation or API exploration.

### Advanced Search & Filtering
*   **Expanded Search Capabilities:** Add search for roles, brands, schedules, automations, and other available APIs.
*   **Saved Searches:** Allow users to save frequently used search queries.
*   **Actionable Fields:** Add organization and user fields as actions directly within search entities.

### User & Customization Actions
*   **Bulk Actions:** Implement bulk actions for items like users (e.g., bulk update, bulk delete).
*   **Quick User Actions:** Create quick actions for users, such as "assign group".
*   **Custom Field Management:** Add the ability to manage custom fields and their options directly within the extension.

### Instance Tools
*   **Instance Overview:** Provide an overview of a Zendesk instance (API permitting).
*   **Configuration Comparison:** Develop a tool to compare configurations between different environments (e.g., production and quality).
*   **API Explorer/Finder:** Create a tool to explore and find Zendesk API endpoints.
*   **License Usage per use-case:** Easily see usage of licenses (agents) per usecase.

## Future/Low Priority

These are more advanced concepts or features that could be considered for long-term development.

*   **Agent-Focused Application:** Develop a separate, dedicated application for Zendesk agents, potentially with its own extension support.
*   **AI Integration:** Leverage Raycast AI with tools to combine multiple actions into a single command.
*   **Other API Implementations:** Implement functionalities for other Zendesk APIs, such as Help Center Guide, Voice/Talk, etc.

## Reminders for Development

*   **Preferences for Logic:** Move special logic (e.g., separating groups by '.', skipping email verification for user creation) to preferences for user configuration.

## TO DO

*   **FIX SEARCH:** Some entities are not returning all, and we need to implement proper search + just initial results