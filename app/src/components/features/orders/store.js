/**
 * Very small Orders store (localStorage MVP).
 * Dine-in orders are created from seated reservations.
 * Nothing is sent to kitchen until status is set to "in_progress".
 */

const ORDERS_KEY = "orders";

const now = () => Date.now();

/**
 * @typedef {"draft"|"in_progress"|"ready"|"served"|"cancelled"} OrderStatus
 *
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} title
 * @property {number} qty
 * @property {number} price
 *
 * @typedef {Object} Order
 * @property {string} id
 * @property {"dine_in"} type
 * @property {string} reservationId
 * @property {string} tableCode
 * @property {OrderStatus} status
 * @property {number} createdAt
 * @property {OrderItem[]} items
 * @property {{subtotal:number, currency:string}} totals
 */

function loadAll() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
}
function saveAll(list) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
}

/** Generate uuid-ish id */
function uid() {
  return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

/**
 * Create an empty dine-in order linked to a reservation.
 * @param {{reservationId:string, tableCode:string}} p
 * @returns {Order}
 */
export function createDineInOrder(p) {
  const order = /** @type {Order} */ ({
    id: uid(),
    type: "dine_in",
    reservationId: p.reservationId,
    tableCode: p.tableCode,
    status: "draft",
    createdAt: now(),
    items: [],
    totals: { subtotal: 0, currency: "NOK" },
  });
  const all = loadAll();
  saveAll([order, ...all]);
  return order;
}

/** @param {string} id */
export function getOrder(id) {
  return loadAll().find(o => o.id === id) || null;
}

/** @returns {Order[]} */
export function listOrders() {
  return loadAll();
}

/**
 * Update an order in storage.
 * @param {Order} next
 */
function put(next) {
  const all = loadAll();
  const i = all.findIndex(o => o.id === next.id);
  if (i === -1) { saveAll([next, ...all]); return; }
  all[i] = next;
  saveAll(all);
}

/**
 * Add or increase an item.
 * @param {string} orderId
 * @param {{title:string, price:number, qty?:number}} item
 */
export function addItem(orderId, item) {
  const o = getOrder(orderId);
  if (!o) return;
  const qty = item.qty ?? 1;
  const existing = o.items.find(i => i.title === item.title && i.price === item.price);
  if (existing) existing.qty += qty;
  else o.items.push({ id: uid(), title: item.title, price: item.price, qty });
  recalc(o);
  put(o);
}

/** @param {string} orderId @param {string} itemId */
export function removeItem(orderId, itemId) {
  const o = getOrder(orderId);
  if (!o) return;
  o.items = o.items.filter(i => i.id !== itemId);
  recalc(o);
  put(o);
}

/** @param {string} orderId @param {OrderStatus} status */
export function setStatus(orderId, status) {
  const o = getOrder(orderId);
  if (!o) return;
  o.status = status;
  put(o);
}

/** @param {Order} o */
function recalc(o) {
  o.totals.subtotal = o.items.reduce((s,i)=> s + i.price * i.qty, 0);
}
