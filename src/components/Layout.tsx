import type { ReactElement, ReactNode } from 'react'

export type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps): ReactElement => (
  <div className="page">
    <header className="site-header">
      <h1>Recipe Box</h1>
    </header>
    <main className="site-main">{children}</main>
    <footer className="site-footer">Recipe Box · practice project</footer>
  </div>
)
