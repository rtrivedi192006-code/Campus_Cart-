import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page">
      <section className="emptyState">
        <div className="emptyTitle">Page not found</div>
        <div className="emptySub">The campus portal can’t find that route.</div>
        <Link to="/" className="primaryBtn" replace>
          Back to home
        </Link>
      </section>
    </div>
  )
}

