import { useEffect, useState, useRef } from "react";
import styles from "./About.module.scss";

export default function AboutSection() {
  const images = [
    "https://placehold.co/800x600?text=Foutiyou+1",
    "https://placehold.co/800x600?text=Foutiyou+2",
    "https://placehold.co/800x600?text=Foutiyou+3",
  ];

  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    stop();
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3000);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <section
      className={styles.AboutSection}
      onMouseEnter={stop}
      onMouseLeave={start}
      aria-labelledby="about-heading"
    >
      <div className={styles.SplitContainer}>
        <div className={styles.SplitLeft}>
          <h2 id="about-heading">About Us</h2>
          <p>
            We are a restaurant dedicated to bringing you the best of
            Senegambian cuisine — blending Gambian soul, Senegalese spice, and
            Oslo’s modern rhythm.
          </p>

          <div className={styles.dots} role="tablist" aria-label="About images">
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.active : ""}`}
                onClick={() => setCurrent(i)}
                aria-selected={i === current}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.SplitRight}>
          <div className={styles.card}>
            <div className={styles.imgWrap}>
              <img
                src={images[current]}
                alt={`About image ${current + 1}`}
                className={styles.slideImage}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
