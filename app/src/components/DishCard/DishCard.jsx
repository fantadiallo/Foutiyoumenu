import styles from "./DishCard.module.scss";

export default function DishCard({ dish }) {
  if (!dish) return null;

  const fallback = "https://placehold.co/400x300?text=Foutiyou";

  return (
    
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={dish.img || fallback} alt={dish.name} />
      </div>
      <div className={styles.info}>
        <h3>{dish.name}</h3>
        {dish.desc && <p className={styles.desc}>{dish.desc}</p>}
        <div className={styles.bottom}>
          <span className={styles.price}>{dish.price} kr</span>
          <button className={styles.btn}>Order</button>
        </div>
      </div>
    </div>
  );
}
