import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";
import styles from "./Header.module.scss";

export default function Header() {
  const { count } = useCart();
  const { brand, nav } = useRestaurantConfig();   // ← read from config

  return (
    <header className={styles.wrap} style={{ backgroundColor: brand.primaryColor }}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          {brand.logoText || brand.name}
        </Link>

        <nav className={styles.nav}>
          {nav?.map(item => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}

          {brand.cart !== false && (
            <Link to="/checkout" className={styles.cart}>
              Cart
              {count ? <span className={styles.badge}>{count}</span> : null}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
