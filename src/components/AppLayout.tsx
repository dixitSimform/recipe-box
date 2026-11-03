import type { ReactElement } from 'react'
import { Link, NavLink, Outlet } from 'react-router'

// NavLink passes `isActive` to className, so the current page's link gets the "active" style
const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

export const AppLayout = (): ReactElement => (
  <div className="page">
    <header className="site-header">
      <h1>
        <Link to="/">Recipe Box</Link>
      </h1>
      <nav className="site-nav" aria-label="Main">
        {/* `end` stops Home (path "/") from being active on every page */}
        <NavLink to="/" end className={getNavLinkClass}>
          Home
        </NavLink>
        <NavLink to="/recipes" className={getNavLinkClass}>
          My recipes
        </NavLink>
        <NavLink to="/discover" className={getNavLinkClass}>
          Discover
        </NavLink>
      </nav>
    </header>
    <main className="site-main">
      {/* The matching child route renders here */}
      <Outlet />
    </main>
    <footer className="site-footer">Recipe Box · practice project</footer>
  </div>
)
