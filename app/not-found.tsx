import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/lib/content";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  const { image, alt } = site.notFound;

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.picture}>
        {image ? (
          <Image className={styles.image} src={image} alt={alt} fill sizes="280px" />
        ) : (
          <Placeholder className={styles.placeholder} label="404 picture" />
        )}
      </div>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>The page you&apos;re looking for is not found.</p>
      <Link className="text-link" href="/">
        Go to the home page
        <ArrowIcon size={18} />
      </Link>
    </section>
  );
}
