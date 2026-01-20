import { useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Container } from '@/components/common/Container'
import { Typography } from '@/components/common/Typography'
import { MarkdownRenderer } from '@/components/Markdown'
import { getPostBySlug } from '@/lib/markdown'
import styles from './PostPage.module.css'

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <Layout>
        <Container size="md">
          <div className={styles.notFound}>
            <Typography variant="h1">記事が見つかりません</Typography>
            <p className={styles.notFoundMessage}>
              お探しの記事は存在しないか、削除された可能性があります。
            </p>
            <Link to="/" className={styles.backLink}>
              トップページに戻る
            </Link>
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container size="md">
        <article className={styles.article}>
          <header className={styles.header}>
            <Typography variant="h1">{post.frontmatter.title}</Typography>
            {post.frontmatter.date && <time className={styles.date}>{post.frontmatter.date}</time>}
          </header>
          <MarkdownRenderer content={post.content} />
        </article>
      </Container>
    </Layout>
  )
}
