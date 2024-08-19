// First, import the additional icon if not already available
import {
  IconBrandChrome,
  IconHelp,
  IconUsers,
  IconCalendarEvent,
} from "@tabler/icons-react";

// Update the icons object to include the new icon
const icons = { IconBrandChrome, IconHelp, IconUsers, IconCalendarEvent };

export const Other = {
  id: "utilities",
  title: "Utilities",
  type: "group",
  children: [
    {
      id: "submit-shifts",
      title: "Submit Shifts",
      type: "item",
      url: "/employee/submit-shifts",
      icon: icons.IconCalendarEvent,
      breadcrumbs: false,
    },
    {
      id: "my-shifts",
      title: "My Shifts",
      type: "item",
      url: "/employee/my-shifts",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
  ],
};

export default Other;
