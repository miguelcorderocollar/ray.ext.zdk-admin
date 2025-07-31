# Zendesk Raycast Extension

This Raycast extension allows you to search for users in Zendesk across different instances and manage your Zendesk instances.

## Features

- Search for users by common queries.
- Configure multiple Zendesk instances to search across.
- Select a Zendesk instance and then search for users within it.
- Configure which user properties to display in the search results and user details.
- Open user profiles in the browser directly from the extension.
- Manage and open Zendesk instances.

## Commands

### Search Zendesk

Search for users, organizations, and triggers in Zendesk.

### Open Zendesk Instance

Manage and open your configured Zendesk instances. You can quickly open a specific product (Support, Guide, Admin, etc.) for any of your instances.

## Configuration

To configure the extension, you will need to set up your Zendesk instance(s) as a secret in Raycast. The configuration should be a JSON array of objects, where each object represents a Zendesk instance and has the following properties:

- `name`: A name for your Zendesk instance (e.g., "My Company").
- `subdomain`: Your Zendesk subdomain (e.g., `yourcompany`).
- `user`: Your Zendesk API user email (e.g., `api_user@yourcompany.com/token`).
- `api_key`: Your Zendesk API token.
- `color`: (Optional) A color to represent this instance in the UI (e.g., `"#FF0000"` for red).
- `production`: (Optional) A boolean to indicate if the instance is a production instance. Defaults to `false`.

Example Configuration:

```json
[
  {
    "name": "My Company",
    "subdomain": "yourcompany",
    "user": "api_user@yourcompany.com/token",
    "api_key": "your_api_key",
    "color": "#007bff",
    "production": true
  },
  {
    "name": "Another Company",
    "subdomain": "anothercompany",
    "user": "another_api_user@anothercompany.com/token",
    "api_key": "another_api_key",
    "color": "#28a745"
  }
]
```
