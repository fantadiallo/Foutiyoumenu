export default function DishCard({ dish }) {
  if (!dish) return null;
  return (
    <div className="dish-card">
      <div style={{display:"flex", justifyContent:"space-between", gap:12}}>
        <h3 style={{margin:0}}>{dish.name}</h3>
        <strong>{dish.price} kr</strong>
      </div>
      {dish.desc ? <p style={{opacity:.8, margin:"6px 0 0"}}>{dish.desc}</p> : null}
      {/* hood and  add-to-cart later */}
    </div>
  );
}
