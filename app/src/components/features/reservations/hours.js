/**
 * Opening hours + slot utility helpers for reservations.
 * - Enforces day-specific opening intervals
 * - Rounds/adjusts times to valid 15-min slots
 * - Computes hold expiry from slot start
 */

/** @type {Record<'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun', [string,string]>} */
export const OPEN_HOURS = {
  mon: ["16:00", "22:30"],
  tue: ["16:00", "22:30"],
  wed: ["16:00", "22:30"],
  thu: ["16:00", "22:30"],
  fri: ["16:00", "22:30"],
  sat: ["16:30", "22:30"],
  sun: ["14:00", "21:00"],
};

/** Size of a reservation slot in minutes */
export const SLOT_MIN = 15;

const DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * Convert "HH:MM" to minutes since midnight.
 * @param {string} hhmm
 * @returns {number}
 */
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * @param {Date} d
 * @returns {'sun'|'mon'|'tue'|'wed'|'thu'|'fri'|'sat'}
 */
function dayKey(d) {
  return /** @type {*} */ (DOW[d.getDay()]);
}

/**
 * Check if a given Date falls within configured opening hours (inclusive).
 * @param {Date} date
 * @returns {boolean}
 */
export function isWithinOpenHours(date) {
  const key = dayKey(date);
  const range = OPEN_HOURS[key];
  if (!range) return false;
  const [start, end] = range.map(toMinutes);
  const mins = date.getHours() * 60 + date.getMinutes();
  return mins >= start && mins <= end;
}

/**
 * Round a Date up to the next SLOT_MIN boundary.
 * @param {Date} [date]
 * @returns {Date}
 */
export function roundToNextSlot(date = new Date()) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  d.setMinutes(m + ((SLOT_MIN - (m % SLOT_MIN)) % SLOT_MIN));
  return d;
}

/**
 * Given any date, return the next valid slot within opening hours.
 * If outside hours, jump forward to the next open time.
 * @param {Date} [date]
 * @returns {Date}
 */
export function coerceToOpenSlot(date = new Date()) {
  let d = roundToNextSlot(date);

  for (let guard = 0; guard < 8 * 24; guard++) {
    if (isWithinOpenHours(d)) return d;

    const key = dayKey(d);
    const range = OPEN_HOURS[key];
    if (range) {
      const [start, end] = range.map(toMinutes);
      const mins = d.getHours() * 60 + d.getMinutes();
      if (mins < start) {
        // Jump to today's opening time
        const nd = new Date(d);
        nd.setHours(Math.floor(start / 60), start % 60, 0, 0);
        d = roundToNextSlot(nd);
        continue;
      }
      // After close → push to next day 00:00; loop advances to its opening
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      d = roundToNextSlot(next);
      continue;
    }

    // No hours configured → step forward by slot until we find something
    d = new Date(d.getTime() + SLOT_MIN * 60 * 1000);
  }

  // Fallback (should not happen)
  return roundToNextSlot(date);
}

/**
 * Compute expiry epoch (ms) as slot start + holdMinutes.
 * @param {string} slotIso ISO string of slot start (e.g., "2025-11-28T16:00:00.000Z")
 * @param {number} holdMinutes
 * @returns {number} epoch ms
 */
export function slotExpiryFromStart(slotIso, holdMinutes = 15) {
  const start = new Date(slotIso).getTime();
  return start + holdMinutes * 60 * 1000;
}
