/**
 * Public reservation form.
 * - Shows available tables
 * - Creates "held" reservations
 * - Shows "Expires at HH:MM" (not a countdown)
 * - Owner can edit time/party or cancel
 */

import { useState } from "react";
import {
  useReservations,
  toLocalInput,
  fromLocalInput,
} from "./useReservations";
import styles from "./ReserveForm.module.scss";

export default function ReserveForm() {
  const {
    slot, setSlot,
    party, setParty,
    name, setName,
    phone, setPhone,
    holds, tables, hold, HOLD_MIN,
    slotError, editMine, ownerId
  } = useReservations();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Reserve a Table</h1>
      <p className={styles.subtitle}>
        Holds expire <strong>{HOLD_MIN} minutes</strong> after your booked time (not when you click).
        <br />
        Open hours: Mon–Fri 16:00–22:30 • Sat 16:30–22:30 • Sun 14:00–21:00
      </p>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label}>When</label>
          <input
            className={styles.input}
            type="datetime-local"
            step={900}
            value={toLocalInput(slot)}
            onChange={(e) => setSlot(fromLocalInput(e.target.value))}
          />
          {slotError && <div className={styles.help}>{slotError}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Party size</label>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={12}
            value={party}
            onChange={(e) => setParty(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone</label>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+47..."
          />
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Available tables</h3>
      <div className={styles.tiles}>
        {tables.length === 0 && <div className={styles.empty}>No matching tables.</div>}
        {tables.map((t) => (
          <button key={t.code} onClick={() => hold(t.code)} className={styles.tileBtn}>
            <strong className={styles.tileCode}>{t.code}</strong>
            <div className={styles.tileMeta}>{t.seats} seats</div>
            <div className={styles.tileHint}>Hold {HOLD_MIN} min</div>
          </button>
        ))}
      </div>

      {holds.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>Holds for this slot</h3>
          <ul className={styles.holds}>
            {holds.map((h) => {
              const exp = new Date(h.holdExpiresAt);
              const expLabel = exp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const isMine = h.ownerId === ownerId && h.status === "held";
              return (
                <li key={h.id} className={styles.holdCard}>
                  <div className={styles.holdInfo}>
                    <span className={styles.badge}>{h.tableCode}</span>
                    <span>{h.partySize}</span>
                    <span>{h.name}</span>
                    <span>{h.phone}</span>
                    <span className={styles.expiry}>Expires at {expLabel}</span>
                  </div>
                  {isMine ? <RowEditor h={h} onSave={editMine} /> : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * Owner inline editor for changing party size and time,
 * with availability validation handled by the store.
 */
function RowEditor({ h, onSave }) {
  const [editing, setEditing] = useState(false);
  const [party, setParty] = useState(h.partySize);
  const [when, setWhen] = useState(toLocalInput(h.slotIso));
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");
    const res = await onSave({
      id: h.id,
      newSlotIso: fromLocalInput(when),
      newPartySize: Number(party),
    });
    if (!res.ok) {
      setMsg(res.error || "Could not update");
      return;
    }
    setEditing(false);
  }

  function cancelMine() {
    // simple owner cancel using localStorage (owner check is implicit by only rendering for owner)
    const key = `holds:${h.slotIso}`;
    const list = JSON.parse(localStorage.getItem(key) || "[]").filter((x) => x.id !== h.id);
    localStorage.setItem(key, JSON.stringify(list));
    // refresh
    window.location.reload();
  }

  if (!editing) {
    return (
      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => setEditing(true)}>Edit</button>
        <button className={styles.btnGhost} onClick={cancelMine}>Cancel</button>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <input
        type="number"
        min={1}
        max={12}
        value={party}
        onChange={(e) => setParty(e.target.value)}
        className={styles.inputSmall}
      />
      <input
        type="datetime-local"
        step={900}
        value={when}
        onChange={(e) => setWhen(e.target.value)}
        className={styles.inputSmall}
      />
      <button className={styles.btn} onClick={save}>Save</button>
      <button className={styles.btnGhost} onClick={() => setEditing(false)}>Close</button>
      {msg && <div className={styles.help}>{msg}</div>}
    </div>
  );
}
