import styles from "./footer.module.css";


export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>Feito com <span style={{ color: 'red' }}>❤️</span> por Alexsander</p>
      </div>
    </footer>
  );
}