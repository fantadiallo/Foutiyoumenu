import { useEffect, useState } from "react";
import DishCard from "../../components/DishCard/DishCard";
import styles from "./MenuPage.module.scss";
import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";

export default function MenuPage() {
  const { menuSource } = useRestaurantConfig();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(menuSource)
      .then((r) => r.json())
      .then((data) => {
        // If data is an object with mainDishes, extract it
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.mainDishes)) {
          setItems(data.mainDishes);
        } else {
          console.warn("Menu data not in expected format:", data);
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load menu:", err);
        setItems([]);
      });
  }, [menuSource]);

  return (
    <div className="container">
      <h2 className={styles.title}>Menu</h2>
      <div className={styles.grid}>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((d) => <DishCard key={d.id || d.name} dish={d} />)
        ) : (
          <p className={styles.empty}>No dishes found.</p>
        )}
      </div>
    </div>
  );
}
