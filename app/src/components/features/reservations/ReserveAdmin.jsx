/**
 * Admin reservations console
 * - Slot picker (15-min steps)
 * - Lists: Held / Confirmed / Seated
 * - Actions:
 *    Held: Confirm, Check in, Cancel
 *    Confirmed: Check in, Cancel
 *    Seated: Start order, Close
 * - For Held items, shows the exact expiry time ("Expires at HH:MM"),
 *   which is computed as (slot start + HOLD_MIN).
 *
 * Integration points:
 * - "Start order" creates a draft dine-in order linked to the reservation
 *   and navigates to /admin/orders/:id for item entry and send-to-kitchen.
 */

import { useNavigate } from "react-router-dom";
import { useReservations, toLocalInput, fromLocalInput } from "./useReservations";
import { createDineInOrder } from "../orders/store";
import styles from "./ReserveAdmin.module.scss";

/**
 * Format an epoch ms into "HH:MM" in the user's locale.
 * @param {number} epochMs
 * @returns {string}
 */
function fmtClock(epochMs) {
  const d = new Date(epochMs);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Section block for a reservation status group.
 * @param {{
 *   title: string;
 *   list: Array<{
 *     id: string;
 *     tableCode: string;
 *     partySize: number;
 *     name: string;
 *     phone: string;
 *     status: "held"|"confirmed"|"seated"|"cancelled";
 *     holdExpiresAt: number;
 *   }>;
 *   actions: (h: any) => import("react").ReactNode;
 * }} props
 */
function Section({ title, list, actions }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h3>{title}</h3>
        <span className={styles.count}>{list.length}</span>
      </div>

      {list.length === 0 && <div className={styles.empty}>None</div>}

      <ul className={styles.list}>
        {list.map((h) => (
          <li key={h.id} className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.badge}>{h.tableCode}</span>
              <span>{h.partySize}</span>
              <span>{h.name}</span>
              <span>{h.phone}</span>

              {/* For "held" we show the exact expiry clock time */}
              {h.status === "held" && (
                <span className={styles.timer}>Expires at {fmtClock(h.holdExpiresAt)}</span>
              )}
            </div>

            <div className={styles.actions}>{actions(h)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Admin view for managing reservations within a selected slot.
 * - Uses the reservations hook for slot state and CRUD actions.
 * - Adds "Start order" action for seated reservations
 *   (creates a draft dine-in order and navigates to the editor page).
 */
export default function ReserveAdmin() {
  const nav = useNavigate();

  const {
    slot,
    setSlot,
    holds,
    updateStatus, // admin: setStatus
    remove,       // admin: cancel/remove
  } = useReservations();

  // Partition by status for display
  const held = holds.filter((h) => h.status === "held");
  const confirmed = holds.filter((h) => h.status === "confirmed");
  const seated = holds.filter((h) => h.status === "seated");

  /**
   * Create a dine-in order for a seated reservation and navigate to editor.
   * @param {{ id:string; tableCode:string }} h
   */
  function startOrder(h) {
    const order = createDineInOrder({ reservationId: h.id, tableCode: h.tableCode });
    nav(`/admin/orders/${order.id}`);
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h2>Reservations</h2>

        {/* Slot picker; value is an ISO coerced to datetime-local */}
        <input
          className={styles.input}
          type="datetime-local"
          step={900}
          value={toLocalInput(slot)}
          onChange={(e) => setSlot(fromLocalInput(e.target.value))}
        />
      </header>

      {/* HELD */}
      <Section
        title="Held"
        list={held}
        actions={(h) => (
          <>
            <button className={styles.btn} onClick={() => updateStatus(h.id, "confirmed")}>
              Confirm
            </button>
            <button className={styles.btn} onClick={() => updateStatus(h.id, "seated")}>
              Check in
            </button>
            <button className={styles.btnGhost} onClick={() => remove(h.id)}>
              Cancel
            </button>
          </>
        )}
      />

      {/* CONFIRMED */}
      <Section
        title="Confirmed"
        list={confirmed}
        actions={(h) => (
          <>
            <button className={styles.btn} onClick={() => updateStatus(h.id, "seated")}>
              Check in
            </button>
            <button className={styles.btnGhost} onClick={() => remove(h.id)}>
              Cancel
            </button>
          </>
        )}
      />

      {/* SEATED */}
      <Section
        title="Seated"
        list={seated}
        actions={(h) => (
          <>
            <button className={styles.btn} onClick={() => startOrder(h)}>
              Start order
            </button>
            <button className={styles.btnGhost} onClick={() => remove(h.id)}>
              Close
            </button>
          </>
        )}
      />
    </div>
  );
}
