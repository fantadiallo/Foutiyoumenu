/**
 * Admin Order Editor
 * - Loads an order by :id
 * - Add/remove items
 * - "Send to kitchen" → status "in_progress"
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./OrderEditorPage.module.scss";
import { addItem, getOrder, removeItem, setStatus  } from "../../../components/features/orders/store";

export default function OrderEditorPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");


  useEffect(() => {
    setOrder(getOrder(id));
  }, [id]);

  const canSend = useMemo(() => order && order.items.length > 0 && order.status === "draft", [order]);

  if (!order) {
    return (
      <div className={styles.wrap}>
        <h2>Order</h2>
        <div className={styles.empty}>Order not found.</div>
      </div>
    );
  }

  function add() {
    const p = Number(price);
    if (!title.trim() || !Number.isFinite(p) || p <= 0) return;
    addItem(order.id, { title: title.trim(), price: p, qty: 1 });
    setOrder(getOrder(order.id));
    setTitle("");
    setPrice("");
  }

  function remove(itemId) {
    removeItem(order.id, itemId);
    setOrder(getOrder(order.id));
  }

  function sendToKitchen() {
    setStatus(order.id, "in_progress"); // kitchen ticket starts now
    setOrder(getOrder(order.id));
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h2>Order • {order.tableCode}</h2>
          <div className={styles.meta}>
            Type: {order.type} • Status: {order.status} • Subtotal: {order.totals.subtotal} {order.totals.currency}
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={() => nav(-1)}>Back</button>
          <button className={styles.btn} disabled={!canSend} onClick={sendToKitchen}>
            Send to kitchen
          </button>
        </div>
      </header>

      <section className={styles.card}>
        <h3>Add item</h3>
        <div className={styles.addRow}>
          <input className={styles.input} placeholder="Item name" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className={styles.input} placeholder="Price" inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)} />
          <button className={styles.btn} onClick={add}>Add</button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Items</h3>
        {order.items.length === 0 ? (
          <div className={styles.empty}>No items yet.</div>
        ) : (
          <ul className={styles.list}>
            {order.items.map(i => (
              <li key={i.id} className={styles.row}>
                <div>{i.title} × {i.qty}</div>
                <div>{(i.price * i.qty).toFixed(2)} {order.totals.currency}</div>
                <button className={styles.btnGhost} onClick={()=>remove(i.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
