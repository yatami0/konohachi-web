import type { ElementType, ReactNode } from 'react'
import styles from './Typography.module.css'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption'

interface TypographyProps {
  variant: TypographyVariant
  children: ReactNode
  className?: string
}

const variantElementMap: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
}

export function Typography({ variant, children, className }: TypographyProps) {
  const Component = variantElementMap[variant]
  const classNames = [styles[variant], className].filter(Boolean).join(' ')

  return <Component className={classNames}>{children}</Component>
}
