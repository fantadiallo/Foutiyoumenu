/**
 * Reservation logic hook:
 * - Manages selected slot (time)
 * - Validates against opening hours
 * - Auto-expires holds every second
 * - Provides table availability
 * - Handles creating/canceling/updating holds
 * - Enforces owner-only editing via client id
 */

import { useEffect, useMemo, useState } from "react";
import {
  availableTables,
  cancel,
  createHold,
  listBySlot,
  roundToSlot,
  setStatus,
  tick,
  HOLD_MIN,
  getClientId,
  updateHold
} from "./store";
import { coerceToOpenSlot, isWithinOpenHours } from "./hours";

/**
 * Hook for managing reservations (public & admin).
 * @param {string} [initialSlot] Optional ISO string for pre-selected slot
 */
export function useReservations(initialSlot) {
  // Slot defaults to the next valid opening slot
  const [slot, setSlot] = useState(() =>
    initialSlot ? initialSlot : coerceToOpenSlot().toISOString()
  );

  /** @type {[number,Function]} party size */
  const [party, setParty] = useState(2);

  /** @type {[string,Function]} customer name */
  const [name, setName] = useState("");

  /** @type {[string,Function]} customer phone */
  const [phone, setPhone] = useState("");

  /** Holds for selected slot */
  const [holds, setHolds] = useState(listBySlot(slot));

  /** Internal ticker to force re-renders every second */
  const [beat, setBeat] = useState(0);

  /** Opening-hours validation message */
  const [slotError, setSlotError] = useState("");

  /** Owner id for this browser/device */
  const ownerId = getClientId();

  // Auto-expire tick
  useEffect(() => {
    const i = setInterval(() => {
      tick(slot);
      setBeat((b) => b + 1);
    }, 1000);
    return () => clearInterval(i);
  }, [slot]);

  // Refresh holds when slot changes or expiration cycle runs
  useEffect(() => {
    setHolds(listBySlot(slot));
  }, [slot, beat]);

  /**
   * Validate a manually selected slot from user input.
   * - If outside open hours → adjust to next valid slot and show UX hint
   * @param {string} nextIso
   */
  function setSlotValidated(nextIso) {
    const d = new Date(nextIso);
    if (!isWithinOpenHours(d)) {
      const fixed = coerceToOpenSlot(d).toISOString();
      setSlotError("Adjusted to the next available time within opening hours.");
      setSlot(fixed);
    } else {
      setSlotError("");
      setSlot(nextIso);
    }
  }

  /**
   * All available tables that match party size.
   */
  const tables = useMemo(
    () => availableTables(slot, party),
    [slot, party, holds]
  );

  /**
   * Create a hold on a specific table for this slot.
   * Owner is set in the store via getClientId().
   * @param {string} tableCode
   */
  function hold(tableCode) {
    if (!name.trim() || !phone.trim()) return;
    createHold({
      slotIso: slot,
      tableCode,
      partySize: party,
      name: name.trim(),
      phone: phone.trim(),
    });
    setHolds(listBySlot(slot));
  }

  /**
   * Update hold status (admin actions).
   * @param {string} id holdId
   * @param {"held"|"confirmed"|"seated"|"cancelled"} status
   */
  function updateStatusAdmin(id, status) {
    setStatus(slot, id, status);
    setHolds(listBySlot(slot));
  }

  /**
   * Remove a hold (admin cancel).
   * @param {string} id holdId
   */
  function remove(id) {
    cancel(slot, id);
    setHolds(listBySlot(slot));
  }

  /**
   * Owner-only update (time and/or party).
   * - Validates availability of the same table in the new slot/party
   * @param {{ id:string, newSlotIso?:string, newPartySize?:number }} params
   * @returns {Promise<{ok:boolean, error?:string}>}
   */
  async function editMine({ id, newSlotIso, newPartySize }) {
    const h = holds.find((x) => x.id === id);
    if (!h) return { ok: false, error: "Not found" };
    if (h.ownerId !== ownerId) return { ok: false, error: "Not your booking" };

    const res = updateHold({
      id,
      fromSlotIso: h.slotIso,
      nextSlotIso: newSlotIso,
      nextPartySize: newPartySize,
    });

    setHolds(listBySlot(slot)); // refresh current view
    return res;
  }

  return {
    // state
    slot,
    setSlot: setSlotValidated,
    party,
    setParty,
    name,
    setName,
    phone,
    setPhone,

    // data
    holds,
    tables,

    // actions
    hold,
    updateStatus: updateStatusAdmin,
    remove,
    editMine,

    // constants + ui helpers
    HOLD_MIN,
    slotError,
    ownerId,
  };
}

/* ---------------------------------------
 * Helpers for <input type="datetime-local">
 * ------------------------------------- */

/**
 * Convert ISO timestamp → value usable in <input type="datetime-local">
 * @param {string} iso
 * @returns {string} "YYYY-MM-DDTHH:MM"
 */
export function toLocalInput(iso) {
  const d = new Date(iso);
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 16);
}

/**
 * Convert datetime-local → ISO string
 * @param {string} local
 * @returns {string}
 */
export function fromLocalInput(local) {
  return new Date(local).toISOString();
}
