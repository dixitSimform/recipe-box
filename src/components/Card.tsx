import type { ReactElement, ReactNode } from 'react'

export type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps): ReactElement => (
  <article className={className ? `card ${className}` : 'card'}>
    {children}
  </article>
)
