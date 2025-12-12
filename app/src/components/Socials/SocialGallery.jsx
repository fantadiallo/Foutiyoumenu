import styles from "./SocialGallery.module.scss";

export default function SocialGallery({
  title = "From Our Kitchen to Your Feed",
  handle = "@foutiyouoslo",
  handleHref = "#",
  images = [],
  columns = { base: 2, md: 3, lg: 6 },
  variant = "grid",
  ctaText = "Follow",
  ctaHref = "#"
}) {
  const data = images?.length
    ? images
    : Array.from({ length: 6 }).map((_, i) => ({
        src: `https://placehold.co/600x600?text=Foutiyou+${i + 1}`,
        alt: `Foutiyou ${i + 1}`,
        href: "#"
      }));

  return (
    <section
      className={styles.wrap}
      data-variant={variant}
      style={{
        // optional: pass columns via CSS vars for responsive SCSS
        "--cols-base": columns.base ?? 2,
        "--cols-md": columns.md ?? 3,
        "--cols-lg": columns.lg ?? 6
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <a className={styles.handle} href={handleHref} target="_blank" rel="noreferrer">
          {handle}
        </a>
      </div>

      <div className={styles.grid}>
        {data.map((img, idx) => (
          <a
            key={idx}
            className={styles.item}
            href={img.href || handleHref}
            target="_blank"
            rel="noreferrer"
          >
            <img src={img.src} alt={img.alt || "social image"} loading="lazy" />
          </a>
        ))}
      </div>

      <div className={styles.footer}>
        <a className={styles.cta} href={ctaHref} target="_blank" rel="noreferrer">
          {ctaText}
        </a>
      </div>
    </section>
  );
}
