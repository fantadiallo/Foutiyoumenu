import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DishCard from "../../components/DishCard/DishCard";
import Hero from "../../components/Hero/Hero";
import { useRestaurantConfig } from "../../context/config/useRestaurantConfig";
import styles from "./HomePage.module.scss";
import AboutSection from "../../components/About/About";
import SocialGallery from "../../components/Socials/SocialGallery";
import MapSection from "../../components/Maps/Maps";

export default function HomePage() {
  const { brand } = useRestaurantConfig();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/data/menu.json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.mainDishes) setFeatured(data.mainDishes.slice(0, 4));
      })
      .catch((err) => console.error("Failed to load menu:", err));
  }, []);

  return (
    <div className={styles.home}>
      <Hero />
      <AboutSection />

      <section className={styles.featured}>
        <h2 className={styles.heading}>Taste of {brand.name}</h2>
        <p className={styles.subtext}>
          Discover the rich flavors of Senegambia from smoky grills to soulful stews.
        </p>

        <div className={styles.menuNav}>
          <Link to="/menu"><p>Explore All Dishes</p></Link>
        </div>

        <div className={styles.grid}>
          {featured.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        <SocialGallery
          title="From Our Kitchen to Your Feed"
          handle="@foutiyouoslo"
          handleHref="https://instagram.com/foutiyouoslo"
          ctaText="Follow on Instagram"
          ctaHref="https://instagram.com/foutiyouoslo"
          images={[
            { src: "/images/ig1.jpg", alt: "Plating", href: "https://instagram.com/..." },
            { src: "/images/ig2.jpg", alt: "Jollof", href: "https://instagram.com/..." },
            { src: "/images/ig3.jpg", alt: "Grill", href: "https://instagram.com/..." }
          ]}
        />
      </section>

      <MapSection
        name="Foutiyou"
        address="Bentsebrugata 11B, 0476 Oslo"
        phone="+4796702163"
        hoursNote="Closed · Opens 2 pm"
      />
    </div>
  );
}
