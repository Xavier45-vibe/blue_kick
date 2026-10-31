/** Single source of truth for site navigation (add a link in one place). */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = [
  ...navLinks,
  { href: "/cart", label: "Cart" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;
