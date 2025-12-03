/**
 * Reservation data store (localStorage implementation).
 * - Holds are stored per-slot key: "holds:<ISO-slot>"
 * - Auto-expiry handled by tick()
 * - Ownership enforced via per-device client id
 * - Supports editing time/party size by owner
 */

import { TABLES } from "./tables";
import { SLOT_MIN, slotExpiryFromStart } from "./hours";

/** Minutes a table is held after SLOT START (not click time) */
export const HOLD_MIN = 15;

const now = () => Date.now();

/**
 * Build the localStorage key for a slot.
 * @param {string} slotIso
 */
const key = (slotIso) => `holds:${slotIso}`;

/**
 * Get (or create) a per-device id used to identify the booking owner.
 * In a DB-backed setup, tie this to a user/session token instead.
 * @returns {string}
 */
export function getClientId() {
  const k = "reservationClientId";
  let id = localStorage.getItem(k);
  if (!id) {
    id = (crypto?.randomUUID?.() ?? String(Math.random()).slice(2));
    localStorage.setItem(k, id);
  }
  return id;
}

/**
 * @param {string} slotIso
 * @returns {import('./types').Hold[]} (loosely typed)
 */
function load(slotIso) {
  try {
    return JSON.parse(localStorage.getItem(key(slotIso)) || "[]");
  } catch {
    return [];
  }
}

/**
 * @param {string} slotIso
 * @param {any[]} list
 */
function save(slotIso, list) {
  localStorage.setItem(key(slotIso), JSON.stringify(list));
}

/**
 * A hold is expired if it's still "held" and we passed its holdExpiresAt.
 * @param {any} h
 */
function isExpired(h) {
  return h.status === "held" && h.holdExpiresAt <= now();
}

/**
 * List non-expired holds for a slot; also cleans expired ones.
 * @param {string} slotIso
 * @returns {any[]}
 */
export function listBySlot(slotIso) {
  const raw = load(slotIso);
  const list = raw.filter((h) => !isExpired(h));
  if (list.length !== raw.length) save(slotIso, list);
  return list;
}

/**
 * Tables available for this slot and party size.
 * Optionally ignore a hold id (useful when editing).
 * @param {string} slotIso
 * @param {number} partySize
 * @param {string} [ignoreId]
 * @returns {{code:string, seats:number}[]}
 */
export function availableTables(slotIso, partySize = 1, ignoreId) {
  const taken = new Set(
    listBySlot(slotIso)
      .filter((h) => h.status !== "cancelled" && h.id !== ignoreId)
      .map((h) => h.tableCode)
  );
  return TABLES.filter((t) => !taken.has(t.code) && t.seats >= partySize);
}

/**
 * Create a new hold for a slot (owned by current device).
 * Expires at: slot start + HOLD_MIN minutes.
 * @param {{slotIso:string, tableCode:string, partySize:number, name:string, phone:string, holdMin?:number}} params
 * @returns {any} created hold
 */
export function createHold({ slotIso, tableCode, partySize, name, phone, holdMin = HOLD_MIN }) {
  const id = crypto?.randomUUID?.() ?? String(Math.random()).slice(2);
  const ownerId = getClientId();
  const createdAt = now();
  const holdExpiresAt = slotExpiryFromStart(slotIso, holdMin);

  const hold = {
    id,
    ownerId,
    tableCode,
    partySize: Number(partySize),
    name,
    phone,
    slotIso,
    createdAt,
    holdExpiresAt,
    status: "held",
  };

  const list = [hold, ...listBySlot(slotIso)];
  save(slotIso, list);
  return hold;
}

/**
 * Set hold status (admin use).
 * @param {string} slotIso
 * @param {string} id
 * @param {"held"|"confirmed"|"seated"|"cancelled"} status
 */
export function setStatus(slotIso, id, status) {
  const next = listBySlot(slotIso).map((h) => (h.id === id ? { ...h, status } : h));
  save(slotIso, next);
}

/**
 * Cancel (remove) a hold entirely.
 * @param {string} slotIso
 * @param {string} id
 */
export function cancel(slotIso, id) {
  const next = listBySlot(slotIso).filter((h) => h.id !== id);
  save(slotIso, next);
}

/**
 * Update a hold's time and/or party size (owner-only logic enforced by caller).
 * - If time changes → moves record between slot keys
 * - Validates that the same table remains available
 * @param {{ id:string, fromSlotIso:string, nextSlotIso?:string, nextPartySize?:number }} params
 * @returns {{ok:true} | {ok:false, error:string}}
 */
export function updateHold({ id, fromSlotIso, nextSlotIso, nextPartySize }) {
  const list = listBySlot(fromSlotIso);
  const idx = list.findIndex((h) => h.id === id);
  if (idx === -1) return { ok: false, error: "Hold not found" };
  const hold = list[idx];

  const newSlotIso = nextSlotIso ?? fromSlotIso;
  const newParty = nextPartySize ?? hold.partySize;

  // Ensure the same table is still available at the new time/size
  const can = availableTables(newSlotIso, newParty, id).some((t) => t.code === hold.tableCode);
  if (!can) return { ok: false, error: "Table not available for that time/party size" };

  // Update holdExpiresAt relative to the (possibly new) slot start
  const updated = {
    ...hold,
    slotIso: newSlotIso,
    partySize: newParty,
    holdExpiresAt: slotExpiryFromStart(newSlotIso, HOLD_MIN),
  };

  if (newSlotIso === fromSlotIso) {
    // Edit in place
    const next = [...list];
    next[idx] = updated;
    save(fromSlotIso, next);
    return { ok: true };
  }

  // Move across slot keys
  const fromNext = list.filter((h) => h.id !== id);
  save(fromSlotIso, fromNext);
  const toNext = [updated, ...listBySlot(newSlotIso)];
  save(newSlotIso, toNext);
  return { ok: true };
}

/**
 * Clean up expired holds in a slot. Call this periodically (1s).
 * @param {string} slotIso
 */
export function tick(slotIso) {
  const list = load(slotIso);
  const next = list.filter((h) => !isExpired(h));
  if (next.length !== list.length) save(slotIso, next);
}

/**
 * Round a Date to the next slot and return ISO string (legacy helper).
 * @param {Date} [date]
 * @returns {string}
 */
export function roundToSlot(date = new Date()) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  d.setMinutes(m + (SLOT_MIN - (m % SLOT_MIN)) % SLOT_MIN);
  return d.toISOString();
}
