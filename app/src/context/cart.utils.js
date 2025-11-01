
export const LS_KEY = "foutiyou_cart_v1";

export function loadLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { items: [], note: "", pickupTime: "" };
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      note: parsed.note || "",
      pickupTime: parsed.pickupTime || ""
    };
  } catch {
    return { items: [], note: "", pickupTime: "" };
  }
}
