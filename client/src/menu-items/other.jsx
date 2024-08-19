// First, import the additional icon if not already available
import {
  IconBrandChrome,
  IconHelp,
  IconUsers,
  IconCalendarEvent,
} from "@tabler/icons-react";

// Update the icons object to include the new icon
const icons = { IconBrandChrome, IconHelp, IconUsers, IconCalendarEvent };

export const other = {
  id: "utilities",
  title: "",
  type: "group",
  children: [
    {
      id: "shift-arrangement",
      title: "Shift Arrangement",
      type: "item",
      url: "/admin/shift-arrangement",
      icon: icons.IconCalendarEvent,
      breadcrumbs: false,
    },
    {
      id: "employees",
      title: "Employees",
      type: "item",
      url: "/admin/employees",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    {
      id: "setup",
      title: "Setup",
      type: "item",
      url: "/admin/setup",
      icon: icons.IconBrandChrome,
      breadcrumbs: false,
    },
  ],
};

export default other;
