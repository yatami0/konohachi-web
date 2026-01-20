import { Link } from 'react-router-dom'
import styles from './PostCard.module.css'

interface PostCardProps {
  title: string
  slug: string
  excerpt?: string
  date?: string
}

export function PostCard({ title, slug, excerpt, date }: PostCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/posts/${slug}`} className={styles.link}>
        <h2 className={styles.title}>{title}</h2>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        {date && <time className={styles.date}>{date}</time>}
      </Link>
    </article>
  )
}
