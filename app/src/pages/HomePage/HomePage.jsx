import { useRestaurantConfig } from "../../config/useRestaurantConfig";
import s from "./HomePage.module.scss";

export default function HomePage(){
  const { brand } = useRestaurantConfig();
  return (
    <>
      <section className={s.hero} style={{ backgroundImage:`linear-gradient(180deg, rgba(30,42,68,.85), rgba(30,42,68,.65)), url('${brand.heroImage}')` }}>
        <div className="container">
          <h1>{brand.name}</h1>
          <p>{brand.tagline}{brand.isHalalFriendly ? " • Halal-friendly" : ""}{brand.pickupOnly ? " • Pickup only" : ""}</p>
        </div>
      </section>
      {/* ...featured dishes ... */}
    </>
  );
}
