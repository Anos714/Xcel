import {
  Bot,
  LayoutDashboard,
  LucideIcon,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";

interface NavItemType {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tweets",
    href: "/tweets",
    icon: SquarePen,
  },
  {
    title: "Queries",
    href: "/queries",
    icon: Search,
  },
  {
    title: "Automation",
    href: "/automation",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
