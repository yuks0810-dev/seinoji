import Image from "next/image";
import styles from "./page.module.css";
import { TallyApp } from "@/components/tally-app";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TallyApp />
      </main>
      <footer className={styles.footer}>
        <p>
          <a href="https://github.com/yuks0810-dev/seinoji">GitHub yuks0810-dev</a>
        </p>
      </footer>
    </div>
  );
}
