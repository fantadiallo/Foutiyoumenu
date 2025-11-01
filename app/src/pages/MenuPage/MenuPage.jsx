import { useEffect, useState } from "react";
import DishCard from "../../components/DishCard/DishCard";
import styles from "./MenuPage.module.scss";
import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";

export default function MenuPage(){
  const { menuSource } = useRestaurantConfig();
  const [items, setItems] = useState([]);
  useEffect(()=>{ fetch(menuSource).then(r=>r.json()).then(setItems); }, [menuSource]);
  return (
    <div className="container">
      <h2 className={styles.title}>Menu</h2>
      <div className={styles.grid}>{items.map(d => <DishCard key={d.id} dish={d} />)}</div>
    </div>
  );
}
