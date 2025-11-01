import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import styles from "./CartPage.module.scss";

function formatNOK(n) {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n || 0);
}

export default function CartPage() {
  const { items, setQty, add, dec, remove, note, setNote, pickupTime, setPickupTime, subtotal, clear } = useCart();
  const [customTime, setCustomTime] = useState("");

  const hasItems = items?.length > 0;

  const total = useMemo(() => subtotal, [subtotal]);

  const presetTimes = useMemo(() => {
    const now = new Date();
    const inMin = m => {
      const d = new Date(now.getTime() + m * 60000);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    };
    return [
      { label: "As soon as possible", value: "ASAP" },
      { label: "In 20 min", value: inMin(20) },
      { label: "In 40 min", value: inMin(40) },
      { label: "In 60 min", value: inMin(60) }
    ];
  }, []);

  const handlePickupChange = v => {
    if (v === "custom") {
      setPickupTime(customTime || "");
      return;
    }
    setPickupTime(v);
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <h1 className={styles.title}>Your Order</h1>

        {!hasItems ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link to="/menu" className={styles.btnPrimary}>Browse menu</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.list}>
              {items.map(item => (
                <div key={item.id} className={styles.row}>
                  <div className={styles.info}>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.price}>{formatNOK(item.price)}</div>
                  </div>

                  <div className={styles.controls}>
                    <button className={styles.qtyBtn} onClick={() => dec(item.id)} aria-label="Decrease">−</button>
                    <input
                      className={styles.qtyInput}
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={e => setQty(item.id, e.target.value)}
                      inputMode="numeric"
                      aria-label="Quantity"
                    />
                    <button className={styles.qtyBtn} onClick={() => add({ ...item, qty: 1 })} aria-label="Increase">＋</button>
                  </div>

                  <div className={styles.lineTotal}>{formatNOK(item.price * item.qty)}</div>

                  <button className={styles.remove} onClick={() => remove(item.id)} aria-label="Remove">Remove</button>
                </div>
              ))}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.block}>
                <h3>Pickup time</h3>
                <div className={styles.pickup}>
                  <select
                    className={styles.select}
                    value={presetTimes.some(p => p.value === pickupTime) || pickupTime === "ASAP" ? pickupTime : (pickupTime ? "custom" : "")}
                    onChange={e => handlePickupChange(e.target.value)}
                  >
                    <option value="" disabled>Select time</option>
                    {presetTimes.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                    <option value="custom">Custom time</option>
                  </select>

                  <input
                    type="time"
                    className={styles.time}
                    value={customTime || (pickupTime && pickupTime !== "ASAP" && !presetTimes.some(p => p.value === pickupTime) ? pickupTime : "")}
                    onChange={e => {
                      setCustomTime(e.target.value);
                      setPickupTime(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className={styles.block}>
                <h3>Note to kitchen</h3>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Add allergies or preferences"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              <div className={styles.block}>
                <div className={styles.sumRow}>
                  <span>Subtotal</span>
                  <span>{formatNOK(subtotal)}</span>
                </div>
                <div className={styles.sumRowTotal}>
                  <span>Total</span>
                  <span>{formatNOK(total)}</span>
                </div>

                <div className={styles.actions}>
                  <Link to="/menu" className={styles.btnGhost}>Add more</Link>
                  <button className={styles.btnLight} onClick={clear}>Clear</button>
                  <Link to="/checkout" className={styles.btnPrimary} aria-disabled={!hasItems}>
                    Go to checkout
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
