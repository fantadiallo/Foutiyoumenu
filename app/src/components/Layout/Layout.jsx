import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import styles from "./Header.module.scss";

export default function Header(){
  const { count } = useCart();
  return (
    <header className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>Foutiyou</Link>
        <nav className={styles.nav}>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/reserve">Reserve</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <Link to="/checkout" className={styles.cart}>
            Cart{count ? <span className={styles.badge}>{count}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
