import type { ReactElement } from 'react'
import { Link } from 'react-router'

export const NotFoundPage = (): ReactElement => (
  <section className="empty">
    <h2>Page not found</h2>
    <p>There is nothing at this address.</p>
    <Link to="/">Back to home</Link>
  </section>
)
