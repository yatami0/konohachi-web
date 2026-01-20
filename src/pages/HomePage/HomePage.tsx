import { Layout } from '@/components/Layout'
import { Container } from '@/components/common/Container'
import { Typography } from '@/components/common/Typography'
import { PostList } from '@/features/posts/components/PostList'
import { getAllPosts } from '@/lib/markdown'
import styles from './HomePage.module.css'

export function HomePage() {
  const posts = getAllPosts()

  return (
    <Layout>
      <Container size="md">
        <div className={styles.header}>
          <Typography variant="h1">Posts</Typography>
        </div>
        <PostList posts={posts} />
      </Container>
    </Layout>
  )
}
