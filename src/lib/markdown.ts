import matter from 'gray-matter'
import type { Post, PostFrontmatter } from '@/features/posts/types'

const postModules = import.meta.glob<string>('/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parsePost(filePath: string, rawContent: string): Post {
  const { data, content } = matter(rawContent)
  const slug = filePath.replace('/content/posts/', '').replace('.md', '')

  return {
    slug,
    content,
    frontmatter: data as PostFrontmatter,
  }
}

export function getAllPosts(): Post[] {
  const posts = Object.entries(postModules).map(([filePath, rawContent]) =>
    parsePost(filePath, rawContent)
  )

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  )
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug)
}
