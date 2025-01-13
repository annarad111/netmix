import styles from "./styles.module.scss";

export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <h1 className={styles.right_nav}>NETMIX</h1>
        <ul className={styles.left_nav}>
          <li>Home</li>
          <li>Movies</li>
          <li>News</li>
        </ul>
      </div>
    </div>
  );
}
