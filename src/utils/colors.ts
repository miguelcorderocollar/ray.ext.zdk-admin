import { Color, Icon } from "@raycast/api";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return Color.Yellow;
    case "open":
      return Color.Red;
    case "pending":
      return Color.Blue;
    case "hold":
    case "on-hold":
      return Color.Purple;
    case "solved":
      return Color.Green;
    case "closed":
      return Color.PrimaryText;
    default:
      return Color.PrimaryText;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return Color.Red;
    case "high":
      return Color.Orange;
    case "normal":
      return Color.Blue;
    case "low":
      return Color.Green;
    default:
      return Color.PrimaryText;
  }
};

export const getUserRoleColor = (role: string) => {
  switch (role) {
    case "end-user":
      return Color.Blue;
    case "agent":
      return Color.Green;
    case "admin":
      return Color.Red;
    default:
      return Color.PrimaryText;
  }
};

// New utility functions for repeated patterns

export const getActiveStatusColor = (active: boolean) => {
  return active ? Color.Green : Color.Red;
};

export const getVerificationStatusColor = (verified: boolean) => {
  return verified ? Color.Green : Color.Orange;
};

export const getDefaultStatusColor = (isDefault: boolean) => {
  return isDefault ? Color.Green : Color.Orange;
};

export const getBooleanIcon = (condition: boolean) => {
  return condition
    ? { source: Icon.CheckCircle, tintColor: Color.Green }
    : { source: Icon.XMarkCircle, tintColor: Color.Red };
};

export const getHelpCenterStateColor = (state: string) => {
  switch (state) {
    case "enabled":
      return Color.Green;
    case "disabled":
      return Color.Red;
    case "restricted":
      return Color.Orange;
    default:
      return Color.PrimaryText;
  }
};
