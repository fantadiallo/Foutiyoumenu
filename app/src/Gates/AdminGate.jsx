import { useState } from "react";

const TOKEN_KEY = "adminAccess";

export default function AdminGate({ children }) {
  const [ok] = useState(localStorage.getItem(TOKEN_KEY) === "true");
  if (!ok) return window.location.replace("/admin/login");
  return children;
}

export function grantAccess() {
  localStorage.setItem("adminAccess", "true");
}

export function revokeAccess() {
  localStorage.removeItem("adminAccess");
}
