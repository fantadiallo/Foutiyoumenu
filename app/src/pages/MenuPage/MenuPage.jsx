import { useEffect, useState } from "react";
import { useRestaurantConfig } from "../../config/useRestaurantConfig";
import DishCard from "../../components/DishCard/DishCard";
import s from "./MenuPage.module.scss";

export default function MenuPage(){
  const { menuSource } = useRestaurantConfig();
  const [items, setItems] = useState([]);
  useEffect(()=>{ fetch(menuSource).then(r=>r.json()).then(setItems); }, [menuSource]);
  return (
    <div className="container">
      <h2 className={s.title}>Menu</h2>
      <div className={s.grid}>{items.map(d => <DishCard key={d.id} dish={d} />)}</div>
    </div>
  );
}
