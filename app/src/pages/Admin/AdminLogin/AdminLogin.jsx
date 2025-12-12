import { useState } from "react";
import styles from "./AdminLogin.module.scss";
import { grantAccess } from "../../../Gates/AdminGate";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const correct = import.meta.env.VITE_ADMIN_PIN;

  function submit(e) {
    e.preventDefault();
    if (pin === correct) {
      grantAccess();
      window.location.replace("/admin");
    } else {
      alert("Wrong PIN");
    }
  }

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Admin Login</h1>
      <form onSubmit={submit} className={styles.form}>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          placeholder="Enter PIN"
          className={styles.input}
        />
        <button className={styles.button}>Enter</button>
      </form>
    </main>
  );
}
