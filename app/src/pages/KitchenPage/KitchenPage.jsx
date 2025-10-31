import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;

export default function KitchenPage(){
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("kitchenToken") || "";

  const load = async () => {
    const r = await fetch(`${API}/api/kitchen/orders`, { headers:{ "x-kitchen-token": token }});
    const d = await r.json();
    setOrders(Array.isArray(d) ? d : []);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{maxWidth:1200, margin:"20px auto", padding:"0 20px"}}>
      <h2>Kitchen Orders</h2>
      {/* render cards as you like */}
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}
