import { motion } from 'framer-motion'
import type { Category } from '../data/catalog'
import type { CSSProperties } from 'react'

export default function CategoryCard({
  category,
  active,
  onSelect,
}: {
  category: Category
  active: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      className={active ? 'categoryCard categoryCard--active' : 'categoryCard'}
      onClick={onSelect}
      whileHover={{ y: -10, rotate: -0.6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 20 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
      style={
        {
          ['--catAccent' as unknown as string]: category.accent,
          backgroundImage: category.gradient,
        } as CSSProperties
      }
    >
      <div className="categoryCardTop">
        <div className="categoryGlyph" aria-hidden="true">
          {category.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="categoryMeta">
          <div className="categoryName">{category.name}</div>
          <div className="categoryTagline">{category.tagline}</div>
        </div>
      </div>
    </motion.button>
  )
}

