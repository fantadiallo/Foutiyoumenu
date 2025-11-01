import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadLS, LS_KEY } from "./cart.utils"; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const init = loadLS();
  const [items, setItems] = useState(init.items);
  const [note, setNote] = useState(init.note);
  const [pickupTime, setPickupTime] = useState(init.pickupTime);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ items, note, pickupTime }));
  }, [items, note, pickupTime]);

  const add = (p) =>
    setItems((prev) => {
      const i = prev.find((x) => x.id === p.id);
      if (i)
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: x.qty + (p.qty || 1) } : x
        );
      return [
        ...prev,
        { id: p.id, name: p.name, price: Number(p.price) || 0, qty: p.qty || 1 }
      ];
    });

  const dec = (id) =>
    setItems((prev) =>
      prev.flatMap((i) =>
        i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]
      )
    );

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, Number(qty) || 1) } : i
      )
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => {
    setItems([]);
    setNote("");
    setPickupTime("");
  };

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const value = {
    items,
    add,
    dec,
    setQty,
    remove,
    clear,
    count,
    subtotal,
    note,
    setNote,
    pickupTime,
    setPickupTime
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
