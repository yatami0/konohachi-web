import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Container size="lg">
          <nav className={styles.nav}>
            <Link to="/" className={styles.logo}>
              konohachi.com
            </Link>
          </nav>
        </Container>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Container size="lg">
          <p className={styles.copyright}>&copy; 2024 konohachi.com</p>
        </Container>
      </footer>
    </div>
  )
}
