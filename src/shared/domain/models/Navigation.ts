import React from 'react';

export interface NavItem {
  icon: React.ReactNode | React.ElementType;
  label: string;
  to?: string;
  subItems?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
  hideTitle?: boolean;
}
