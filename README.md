# Zendesk Admin

A Raycast extension for comprehensive Zendesk administration. Search, view, and manage all aspects of your Zendesk instances directly from Raycast.

## Features

- **Search 14 entity types**: Tickets, Users, Organizations, Groups, Views, Brands, Triggers, Automations, Macros, Ticket Fields, Forms, Dynamic Content, Support Addresses, Custom Roles
- **Multi-instance support** with color coding
- **Real-time search** with smart filtering
- **Quick access** to all Zendesk products (Support, Guide, Admin, Explore, Sell, Chat, Talk)
- **User management**: Create, edit, view tickets, manage group memberships
- **Ticket management**: View details, open in browser, search related tickets
- **Configuration management**: View and edit automations, triggers, fields, brands

## Commands

- **Search Zendesk**: Main search interface for all entity types
- **Open Zendesk Instance**: Quick access to Zendesk products

## Setup

1. Install the extension
2. Configure Zendesk instances in Raycast preferences with JSON:

```json
[
  {
    "name": "My Company",
    "subdomain": "yourcompany",
    "user": "api_user@yourcompany.com/token",
    "api_key": "your_api_key",
    "color": "#007bff",
    "production": true
  }
]
```

## Requirements

- Zendesk API access with permissions for user management, ticket access, organization management, group administration, and configuration management

## Usage

- Use "Search Zendesk" to find and manage entities across your instances
- Use "Open Zendesk Instance" for quick navigation to Zendesk products
- Switch between instances using the dropdown
- Use keyboard shortcuts for common actions

## Author

gemini

## License

MIT
