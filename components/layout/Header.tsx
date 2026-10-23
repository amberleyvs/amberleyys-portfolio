"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { currentState, navItems } from "@/lib/nav";
import { useSectionInView } from "@/lib/use-section-in-view";
import styles from "./Header.module.css";

const sectionIds = navItems.map((item) => item.section);

export function Header() {
  const pathname = usePathname();
  const sectionInView = useSectionInView(sectionIds, pathname === "/");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav aria-label="Main" className={styles.nav}>
          <ul role="list" className={styles.list}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.item}>
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={currentState(pathname, item, sectionInView)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <MobileMenu sectionInView={sectionInView} />
    </header>
  );
}
