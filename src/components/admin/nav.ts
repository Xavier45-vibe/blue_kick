/** Sidebar structure from the spec (section 7.3). */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
  superOnly?: boolean;
}

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  {
    label: "Products",
    href: "/admin/products",
    icon: "M4 7l8-4 8 4v10l-8 4-8-4V7ZM4 7l8 4 8-4M12 11v10",
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add Product", href: "/admin/products/new" },
      { label: "Categories", href: "/admin/products/categories" },
    ],
  },
  { label: "Orders", href: "/admin/orders", icon: "M6 3h12l2 4v13H4V7l2-4ZM4 7h16M9 11h6" },
  { label: "Customers", href: "/admin/customers", icon: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 21c0-4 4-6 8-6s8 2 8 6" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "M3 6h18v12H3V6Zm0 0 9 7 9-7" },
  {
    label: "Content",
    href: "/admin/content",
    icon: "M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5",
    children: [
      { label: "Landing Page", href: "/admin/content/landing" },
      { label: "Team Members", href: "/admin/content/team" },
      { label: "About Page", href: "/admin/content/about" },
    ],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-2-4-2 1-2-1-1-2h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1v-2Z",
    superOnly: true,
    children: [
      { label: "General", href: "/admin/settings/general" },
      { label: "Shipping", href: "/admin/settings/shipping" },
      { label: "Payments", href: "/admin/settings/payments" },
      { label: "Users", href: "/admin/settings/users" },
    ],
  },
];
