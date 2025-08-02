 # Folder Structure Documentation

## Overview

The `src` folder has been reorganized to improve maintainability and developer experience. Components are now grouped by their purpose and functionality.

## Structure

```
src/
├── api/                    # API integration layer
│   └── zendesk.ts         # Zendesk API functions and types
├── components/            # React components organized by purpose
│   ├── actions/           # Action-related components
│   │   └── ZendeskActions.tsx
│   ├── common/            # Shared/reusable components
│   │   ├── MetadataHelpers.tsx
│   │   └── SearchTypeSelector.tsx
│   ├── forms/             # Form components for creating/editing entities
│   │   ├── AddTicketFieldOptionForm.tsx
│   │   ├── CreateUserForm.tsx
│   │   └── EditUserForm.tsx
│   └── lists/             # List and list item components
│       ├── EntityTicketsList.tsx
│       ├── GroupMembershipsList.tsx
│       ├── TicketFieldOptionsList.tsx
│       ├── TicketListItem.tsx
│       └── UserGroupMembershipsList.tsx
├── hooks/                 # Custom React hooks
│   ├── useDebounce.ts     # Debounced value hook
│   └── useEntitySearch.ts # Entity search hook
├── utils/                 # Utility functions and helpers
│   ├── colors.ts          # Color utility functions
│   ├── fieldTypes.ts      # Field type utilities
│   ├── formatters.ts      # Formatting utilities
│   └── preferences.ts     # Preferences and configuration
├── open-zendesk-instance.tsx  # Main entry point for opening Zendesk
└── search-zendesk.tsx     # Main entry point for searching Zendesk
```

## Component Categories

### Actions (`components/actions/`)
Components that handle user actions and interactions with Zendesk entities.

### Common (`components/common/`)
Shared components used across multiple features. These are typically utility components that don't belong to a specific domain.

### Forms (`components/forms/`)
Form components for creating and editing Zendesk entities. These handle user input and data submission.

### Lists (`components/lists/`)
Components that display lists of entities and individual list items. These handle data presentation and user interaction with lists.

## Benefits of This Structure

1. **Clear Separation of Concerns**: Components are grouped by their primary purpose
2. **Easier Navigation**: Developers can quickly find components by type
3. **Better Scalability**: New components can be added to appropriate folders
4. **Reduced Cognitive Load**: Related components are organized together
5. **Consistent Patterns**: Similar components follow the same organizational structure

## Import Paths

After the reorganization, import paths have been updated to reflect the new structure:

- Components in subdirectories use relative paths like `../../api/zendesk`
- Shared hooks are imported from `../hooks/useDebounce`
- Common components are imported from `../common/MetadataHelpers`

## Migration Notes

- All import statements have been updated to reflect the new structure
- The `useDebounce` hook has been extracted to a shared location to eliminate duplication
- Build process has been verified to work with the new structure