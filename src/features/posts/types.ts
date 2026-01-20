export interface PostFrontmatter {
  title: string
  date: string
  excerpt?: string
}

export interface Post {
  slug: string
  content: string
  frontmatter: PostFrontmatter
}
