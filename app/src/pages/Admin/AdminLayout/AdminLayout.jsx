import { Outlet, NavLink } from "react-router-dom";
import { revokeAccess } from "@/gates/AdminGate";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  function logout() { revokeAccess(); window.location.replace("/admin/login"); }
  return (
    <div className={styles.grid}>
      <aside className={styles.aside}>
        <h2 className={styles.logo}>Admin</h2>
        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({isActive})=>isActive?styles.active:undefined}>Dashboard</NavLink>
          <NavLink to="/admin/kitchen" className={({isActive})=>isActive?styles.active:undefined}>Kitchen</NavLink>
          <NavLink to="/admin/reservations" className={({isActive})=>isActive?styles.active:undefined}>Reservations</NavLink>
        </nav>
        <button onClick={logout} className={styles.logout}>Logout</button>
      </aside>
      <main className={styles.main}><Outlet/></main>
    </div>
  );
}
