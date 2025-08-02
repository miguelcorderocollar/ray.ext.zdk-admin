/**
 * Utility functions for common formatting patterns
 */

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const formatInstanceColor = (instanceColor?: string, fallbackColor = "Blue") => {
  return instanceColor || fallbackColor;
};
