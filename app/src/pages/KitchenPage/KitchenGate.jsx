import { useEffect, useState } from "react";

const TOKEN_KEY = "kitchenToken";

export default function KitchenGate({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [input, setInput] = useState("");
  const [ok, setOk] = useState(!!token);

  useEffect(() => { if (token) setOk(true); }, [token]);

  const submit = e => {
    e.preventDefault();
    if (!input.trim()) return;
    localStorage.setItem(TOKEN_KEY, input.trim());
    setToken(input.trim());
  };

  if (!ok) {
    return (
      <div style={{maxWidth:420, margin:"80px auto", padding:"20px", background:"#fff", borderRadius:16, boxShadow:"0 10px 24px rgba(0,0,0,.08)"}}>
        <h2 style={{marginTop:0}}>Kitchen Login</h2>
        <form onSubmit={submit} style={{display:"grid", gap:12}}>
          <input
            placeholder="Enter kitchen token"
            value={input}
            onChange={e=>setInput(e.target.value)}
            style={{padding:"12px 14px", borderRadius:12, border:"1px solid #e6e6e6"}}
          />
          <button style={{padding:"12px 14px", borderRadius:12, border:0, background:"#1E2A44", color:"#fff"}}>Enter</button>
        </form>
      </div>
    );
  }

  return children;
}
