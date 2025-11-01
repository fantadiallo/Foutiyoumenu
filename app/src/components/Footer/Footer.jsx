import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

export default function Footer() {
  const { brand, contact = {}, hours = [] } = useRestaurantConfig();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <h3>{brand?.name || "Foutiyou"}</h3>
          <p>{brand?.tagline || "Senegambian Kitchen"}</p>
        </div>

        <div className={styles.col}>
          <h4>Visit</h4>
          {contact?.address ? (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              {contact.address}
            </a>
          ) : null}
        </div>

        <div className={styles.col}>
          <h4>Hours</h4>
          <ul className={styles.hours}>
            {hours?.map((h, i) => (
              <li key={i}>
                <span>{h.days}</span>
                {h.windows
                  ? h.windows.map((w, j) => (
                      <em key={j}>
                        {w[0]}–{w[1]}
                      </em>
                    ))
                  : h.open && h.close
                  ? <em>{h.open}–{h.close}</em>
                  : null}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Contact</h4>
          {contact?.phone ? (
            <a href={`tel:${String(contact.phone).replace(/\s+/g, "")}`}>
              {contact.phone}
            </a>
          ) : null}
          {contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
          <div className={styles.links}>
            <Link to="/menu">Order</Link>
            <Link to="/reserve">Reserve</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {year} {brand?.name || "Foutiyou"}. All rights reserved.</p>
      </div>
    </footer>
  );
}
