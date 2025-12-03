import { Link, NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";
import styles from "./Header.module.scss";
import { getOpenStatus } from "../../utils/hours.utils";

export default function Header() {
  const { count } = useCart();
  const { brand, nav, contact = {}, hours = [] } = useRestaurantConfig();
  const [open, setOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const status = useMemo(() => getOpenStatus(hours), [hours]);
  const tel = (contact.phone || "").replace(/\s+/g, "");
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setStaffOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={styles.wrap}>
      <a href="#main" className={styles.skip}>Skip to content</a>

      <div className={`container ${styles.top}`}>
        <div className={styles.status}>
          <span className={status?.isOpen ? styles.dotOn : styles.dotOff} aria-hidden="true" />
          <span>{status?.label || "Hours available"}</span>
        </div>
        {contact?.address && (
          <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} className={styles.addr}>
            {contact.address}
          </a>
        )}
        {tel && <a className={styles.tel} href={`tel:${tel}`}>{contact.phone}</a>}
      </div>

      <div className={`container ${styles.inner}`}>
        <button
          className={`${styles.menuBtn} ${open ? styles.menuOpen : ""}`}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Menu"
        >
          <span className={styles.menuIcon} />
        </button>

        <Link to="/" className={styles.logo}>{brand.logoText || brand.name}</Link>

        {/* Backdrop for outside-tap to close */}
        {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

        <nav id="mobile-nav" className={`${styles.nav} ${open ? styles.showNav : ""}`}>
          {nav?.map(i => (
            <NavLink key={i.to} to={i.to}>{i.label}</NavLink>
          ))}

          {/* Show staff links inside the mobile menu as well */}
          <div className={styles.staffMobile}>
            <span className={styles.staffLabel}>Staff</span>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/kitchen">Kitchen</NavLink>
          </div>
        </nav>

        <div className={styles.ctaRow}>
          {brand?.pickupOnly && (
            <Link to="/menu" className={`${styles.btn} ${styles.primary}`}>Order now</Link>
          )}
          <Link to="/reserve" className={`${styles.btn} ${styles.ghost}`}>Reserve</Link>
          <Link to="/checkout" className={styles.cart}>
            Cart{count ? <span className={styles.badge}>{count}</span> : null}
          </Link>

          {/* Staff button (desktop/tablet) */}
          <div className={styles.staffWrap}>
            <button
              className={styles.staffBtn}
              onClick={() => setStaffOpen(v => !v)}
              aria-expanded={staffOpen}
              aria-controls="staff-menu"
              aria-label="Staff menu"
            >
              🔒 Staff
            </button>
            {staffOpen && (
              <div id="staff-menu" className={styles.staffMenu} role="menu">
                <Link to="/admin" role="menuitem">Admin</Link>
                <Link to="/kitchen" role="menuitem">Kitchen</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <Link to="/menu">Order</Link>
        {tel ? <a href={`tel:${tel}`}>Call</a> : <span />}
        <Link to="/reserve">Reserve</Link>
        <Link to="/checkout">Cart{count ? <span className={styles.bDot} /> : null}</Link>
      </div>
    </header>
  );
}
