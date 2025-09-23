import { PermissionsWithRelation } from "@/context/AuthContext";
import { IconType } from "react-icons";
import { FaHome, FaUserShield, FaChartBar } from "react-icons/fa";
import { MdOutlineShoppingBag, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import { LiaUsersSolid } from "react-icons/lia";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { SiVitest } from "react-icons/si";

export type Item = {
  type: string;
  label: string;
  href?: string;
  icon?: IconType;
  notifications?: number;
  messages?: number;
  tab?: string;
  isWriteAction?: boolean;
  abbreviation: string;
};

export type NavItem = {
  children?: Array<NavItem>;
} & Item;

export const adminItems: NavItem[] = [
  {
    type: "home",
    label: "Dashboard",
    abbreviation: "dashboard",
    icon: MdOutlineSpaceDashboard,
    children: [
      {
        label: "Home",
        abbreviation: "dashboard",
        type: "link",
        icon: FaHome,
        href: "/dashboard",
      },
    ],
  },
  {
    label: "Assessments",
    abbreviation: "assessments",
    type: "home",
    icon: MdOutlineShoppingBag,
    children: [
      {
        label: "Assessment Tools",
        abbreviation: "captools",
        type: "link",
        icon: SiVitest,
        href: "/questionnaires",
      },
      {
        label: "Assessment Rating",
        abbreviation: "assessmentRating",
        type: "link",
        href: "/organization-ratings",
        icon: FaChartBar,
      },
    ],
  },
  {
    label: "Organizations",
    abbreviation: "organizations",
    type: "home",
    icon: TbCategory2,
    children: [
      {
        label: "Organizations",
        abbreviation: "organizations",
        type: "link",
        icon: TbCategory2,
        href: "/organizations",
      },
    ],
  },
  {
    label: "Users",
    type: "home",
    abbreviation: "users",
    icon: LiaUsersSolid,
    children: [
      {
        label: "Users",
        abbreviation: "users",
        type: "link",
        icon: PiUsersThreeDuotone,
        href: "/users",
      },
      {
        label: "Roles",
        abbreviation: "roles",
        type: "link",
        icon: FaUserShield,
        href: "/roles",
      },
    ],
  },
];

export const clientItems: NavItem[] = [
  {
    type: "Home",
    label: "Home",
    abbreviation: "home",
    icon: FaHome,
    href: "/",
  },
  {
    type: "Home",
    label: "Assessments",
    abbreviation: "assessments",
    icon: MdOutlineSpaceDashboard,
    href: "/assessments",
  },
];

export const hasNavPermission = (
  item: NavItem,
  permissionsByTab: Record<string, PermissionsWithRelation[]>
): boolean => {
  // Get the tab name (from item.tab or item.label)
  const tabName = (item.tab || item.label).toLowerCase();

  // Check if we have any permissions for this tab
  const tabPermissions = permissionsByTab[tabName];
  if (!tabPermissions) {
    // Check if the children have permissions
    if (item.children && item.children.length > 0) {
      return item.children.some((child) =>
        hasNavPermission(child, permissionsByTab)
      );
    }
    return false;
  }
  return true;
};
