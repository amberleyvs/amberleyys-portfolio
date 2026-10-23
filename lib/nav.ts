type NavItem = {
  label: string;
  href: string;
  section: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", section: "home" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Work", href: "/#work", section: "work" },
  { label: "Off the clock", href: "/#off-the-clock", section: "off-the-clock" },
];

export function currentState(pathname: string, item: NavItem, sectionInView: string | null): "location" | undefined {
  return pathname === "/" && item.section === sectionInView ? "location" : undefined;
}
