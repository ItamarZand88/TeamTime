// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Main Dashboard",
      type: "item",
      url: "/admin",
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
};
export default dashboard;
