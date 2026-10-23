"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { MenuIcon } from "@/components/ui/icons";
import { currentState, navItems } from "@/lib/nav";
import styles from "./MobileMenu.module.css";

export function MobileMenu({ sectionInView }: { sectionInView: string | null }) {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const close = () => setOpenOn(null);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      close();
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={styles.menu} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        <MenuIcon size={22} />
        Menu
      </button>
      <nav id="mobile-menu" aria-label="Main" hidden={!open}>
        <ul role="list" className={styles.list}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={currentState(pathname, item, sectionInView)}
                onClick={close}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
