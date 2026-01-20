import type { Post } from '@/features/posts/types'
import { PostCard } from '@/features/posts/components/PostCard'
import styles from './PostList.module.css'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>記事がありません。</p>
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          title={post.frontmatter.title}
          slug={post.slug}
          excerpt={post.frontmatter.excerpt}
          date={post.frontmatter.date}
        />
      ))}
    </div>
  )
}
