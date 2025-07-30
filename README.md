# Zendesk User Search Raycast Extension

This Raycast extension allows you to search for users in Zendesk across different instances.

## Features

- Search for users by common queries.
- Configure multiple Zendesk instances to search across.
- Select a Zendesk instance and then search for users within it.
- Configure which user properties to display in the search results and user details.
- Open user profiles in the browser directly from the extension.

## Configuration

To configure the extension, you will need to set up your Zendesk instance(s) as a secret in Raycast. The configuration should be a JSON array of objects, where each object represents a Zendesk instance and has the following properties:

- `subdomain`: Your Zendesk subdomain (e.g., `yourcompany`).
- `user`: Your Zendesk API user email (e.g., `api_user@yourcompany.com/token`).
- `api_key`: Your Zendesk API token.
- `color`: (Optional) A color to represent this instance in the UI (e.g., `"#FF0000"` for red).

Example Configuration:

```json
[
  {
    "subdomain": "yourcompany",
    "user": "api_user@yourcompany.com/token",
    "api_key": "your_api_key",
    "color": "#007bff"
  },
  {
    "subdomain": "anothercompany",
    "user": "another_api_user@anothercompany.com/token",
    "api_key": "another_api_key",
    "color": "#28a745"
  }
]
```
