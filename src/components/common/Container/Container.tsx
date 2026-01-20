import type { ReactNode } from 'react'
import styles from './Container.module.css'

type ContainerSize = 'sm' | 'md' | 'lg'

interface ContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
}

export function Container({ children, size = 'md', className }: ContainerProps) {
  const classNames = [styles.container, styles[size], className].filter(Boolean).join(' ')

  return <div className={classNames}>{children}</div>
}
