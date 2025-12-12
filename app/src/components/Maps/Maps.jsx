import styles from './Maps.module.scss';

export default function MapSection({
  name = 'Foutiyou',
  address = 'Bentsebrugata 11B, 0476 Oslo',
  phone = '+4796702163',
  hoursNote = 'Closed · Opens 2 pm',
  ctaLabel = 'Get Directions'
}) {
  const mapsQuery = encodeURIComponent(address);
  const mapsEmbedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const telDisplay = phone.replace('+47', '').replace(/\s+/g, '');

  return (
    <section id="find-us" className={styles.mapSection} aria-labelledby="findUsHeading">
      <div className={styles.info}>
        <h2 id="findUsHeading">Where to Find Us</h2>
        <p>Visit <strong>{name}</strong> for authentic Senegambian cuisine in Oslo.</p>
        <div className={styles.meta}>
          <p className={styles.address}>📍 {address}</p>
          <p className={styles.phone}>☎️ <a href={`tel:${phone}`}>{telDisplay}</a></p>
          <p className={styles.hours}><strong>Hours:</strong> {hoursNote}</p>
        </div>
        <div className={styles.actions}>
          <a href={mapsLink} target="_blank" rel="noreferrer" className={styles.btn}>{ctaLabel}</a>
          <a href={`tel:${phone}`} className={styles.btnSecondary}>Call Now</a>
        </div>
      </div>
      <div className={styles.mapWrap}>
        <iframe
          title={`${name} Location`}
          src={mapsEmbedSrc}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
