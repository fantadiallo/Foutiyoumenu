import { motion } from 'framer-motion';
import styles from './Hero.module.scss';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.12, delayChildren: 0.15 } }
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function Hero({
  isHalalFriendly = true,
  pickupOnly = false,
  tagline = 'Authentic Senegalese • Oslo'
}) {
  return (
    <section className={styles.heroContainer}>
      <img
        src="/chatbildefotiyou.png"
        alt="Authentic Senegalese dishes at Foutiyou: jollof rice, grilled fish, shrimp, and meat platters."
        className={styles.heroImage}
      />

      <div className={styles.overlay} />

      <motion.div className={styles.content} variants={container} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={item}>Welcome to Foutiyou</motion.h1>
        <motion.h2 className={styles.subtitle} variants={item}>
          Where Senegambia meets the North — and every meal feels like home
        </motion.h2>
        <motion.p className={styles.description} variants={item}>
          Step into a world of color, spice, and community. Our kitchen celebrates the soul of Gambia and the rhythm of Senegal — served with a Nordic touch of comfort.
          <br />
          From smoky grilled fish and rich jollof rice to sweet hibiscus and laughter at every table —
          <strong> Foutiyou isn’t just food, it’s family, warmth, and a reason to stay a little longer.</strong>
        </motion.p>
        <motion.div className={styles.actions} variants={item}>
          <motion.a href="/menu" className={styles.btnPrimary} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>View Menu</motion.a>
          <motion.a href="/reserve" className={styles.btnOutline} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Book a Table</motion.a>
        </motion.div>
      </motion.div>

      {/* Status / badges row */}
      <div className={styles.info} aria-label="Restaurant info">
        <span className={styles.tagline}>{tagline}</span>
        {isHalalFriendly && <span className={`${styles.badge} ${styles.badgeHalal}`} aria-label="Halal friendly">Halal-friendly</span>}
        {pickupOnly && <span className={`${styles.badge} ${styles.badgePickup}`} aria-label="Pickup only">Pickup only</span>}
      </div>
    </section>
  );
}
