import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { categories, products, getCategoryById, type Product } from '../data/catalog'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import MagneticButton from '../components/MagneticButton'
import { useAuth } from '../state/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useRecentlyViewed } from '../state/RecentlyViewedContext'
import ProductModal from '../components/ProductModal'

function includesQuery(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.toLowerCase())
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { viewedIds, addViewed, clear: clearRecent } = useRecentlyViewed()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<'all' | string>('all')
  const [conditionFilter, setConditionFilter] = useState<'all' | Product['condition']>('all')
  const [maxPrice, setMaxPrice] = useState(1000)

  // Used to ensure "fall from top on load" runs only once.
  const [animateIn, setAnimateIn] = useState(true)
  useEffect(() => {
    const t = window.setTimeout(() => setAnimateIn(false), 1700)
    return () => window.clearTimeout(t)
  }, [])

  const gridRef = useRef<HTMLDivElement | null>(null)

  const filteredProducts = useMemo(() => {
    const q = query.trim()
    let list = products

    if (categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === categoryId)
    }

    if (q) {
      list = list.filter((p) => {
        return (
          includesQuery(p.title, q) ||
          includesQuery(p.description, q) ||
          includesQuery(p.condition, q) ||
          includesQuery(p.seller, q)
        )
      })
    }

    if (conditionFilter !== 'all') {
      list = list.filter((p) => p.condition === conditionFilter)
    }

    list = list.filter((p) => p.price <= maxPrice)

    return list
  }, [categoryId, query, conditionFilter, maxPrice])

  const [toast, setToast] = useState<string | null>(null)

  function primaryAction(productId: string) {
    const p = products.find((x) => x.id === productId)
    setToast(p ? `Request sent for “${p.title}”.` : 'Request sent.')
    window.setTimeout(() => setToast(null), 2400)
  }

  const [openProductId, setOpenProductId] = useState<string | null>(null)
  const openProduct = openProductId ? products.find((p) => p.id === openProductId) ?? null : null

  function openDetails(productId: string) {
    addViewed(productId)
    setOpenProductId(productId)
  }

  const selectedCategory = categoryId === 'all' ? null : getCategoryById(categoryId)

  const recentProducts = useMemo(() => {
    if (viewedIds.length === 0) return []
    const byId = new Map(products.map((p) => [p.id, p]))
    return viewedIds.map((id) => byId.get(id)).filter(Boolean) as Product[]
  }, [viewedIds])

  const recommendedProducts = useMemo(() => {
    // Smart-ish heuristic: prioritize urgent/new items, then bias to the most recent category.
    const recentCategory = recentProducts[0]?.categoryId ?? null
    const score = (p: Product) => {
      let s = 0
      if (p.tags?.urgentSale) s += 6
      if (p.tags?.newItem) s += 4
      if (recentCategory && p.categoryId === recentCategory) s += 3
      if (recentProducts.some((rp) => rp.id === p.id)) s -= 8
      return s
    }
    const sorted = [...products].sort((a, b) => score(b) - score(a))
    return sorted.slice(0, 6)
  }, [recentProducts])

  return (
    <div className="page">
      <section className="heroSection">
        <div className="heroGlow" aria-hidden="true" />
        <div className="heroInner">
          <motion.div 
            className="heroText"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.p 
              className="heroKicker"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
            >
              Campus-only marketplace
            </motion.p>
            <motion.h1 
              className="heroTitle"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
            >
              CampusCart — Buy, Sell & Exchange Within Your Campus
            </motion.h1>
            <motion.p 
              className="heroSub"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
            >
              Hover the listings to lift them. Filter categories to watch the cards
              rearrange with smooth physics motion.
            </motion.p>

            <motion.div 
              className="heroCtas"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
            >
              <MagneticButton
                className="primaryBtn primaryBtn--hero"
                intensity={12}
                type="button"
                onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore marketplace
              </MagneticButton>
              <MagneticButton
                className="ghostBtn ghostBtn--hero"
                intensity={10}
                type="button"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
              >
                Sell on CampusCart
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div 
            className="heroStats" 
            aria-label="Marketplace highlights"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.35 },
              },
            }}
          >
            <motion.div 
              className="statCard"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
              }}
            >
              <div className="statValue">{products.length}</div>
              <div className="statLabel">Active listings</div>
            </motion.div>
            <motion.div 
              className="statCard"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
              }}
            >
              <div className="statValue">{categories.length}</div>
              <div className="statLabel">Campus categories</div>
            </motion.div>
            <motion.div 
              className="statCard statCard--accent"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
              }}
            >
              <div className="statValue">Hover</div>
              <div className="statLabel">Anti-gravity lift</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Categories</h2>
            <p className="sectionSub">Pick a category to filter listings.</p>
          </div>
          {selectedCategory ? (
            <div className="activeChip" role="status">
              Active: <span className="activeChipName">{selectedCategory.name}</span>
            </div>
          ) : (
            <div className="activeChip" role="status">
              Active: <span className="activeChipName">All listings</span>
            </div>
          )}
        </div>

        <motion.div 
          className="categoriesGrid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
            <CategoryCard
              category={{
                id: 'all',
                name: 'All',
                tagline: 'Everything on campus',
                accent: '#aa3bff',
                gradient:
                  'linear-gradient(135deg, rgba(170,59,255,0.22), rgba(34,211,238,0.12))',
              }}
              active={categoryId === 'all'}
              onSelect={() => setCategoryId('all')}
            />
          </motion.div>
          {categories.map((c) => (
            <motion.div key={c.id} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
              <CategoryCard
                key={c.id}
                category={c}
                active={categoryId === c.id}
                onSelect={() => setCategoryId(c.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Recommended Products</h2>
            <p className="sectionSub">Floating picks based on what you interact with.</p>
          </div>
        </div>

        <LayoutGroup>
          <motion.div className="productGrid productGrid--compact" layout>
            {recommendedProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                animateOnMount={false}
                onPrimaryAction={(id) => {
                  addViewed(id)
                  primaryAction(id)
                }}
                onOpen={openDetails}
                recommendedIdle
              />
            ))}
          </motion.div>
        </LayoutGroup>
      </section>

      {recentProducts.length > 0 ? (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <h2 className="sectionTitle">Recently Viewed</h2>
              <p className="sectionSub">Continue where you left off.</p>
            </div>
            <MagneticButton className="ghostBtn" intensity={10} type="button" onClick={clearRecent}>
              Clear history
            </MagneticButton>
          </div>

          <LayoutGroup>
            <motion.div className="productGrid productGrid--compact" layout>
              {recentProducts.slice(0, 6).map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  animateOnMount={false}
                  onPrimaryAction={(id) => {
                    addViewed(id)
                    primaryAction(id)
                  }}
                  onOpen={openDetails}
                />
              ))}
            </motion.div>
          </LayoutGroup>
        </section>
      ) : null}

      <section className="section" ref={gridRef}>
        <div className="filtersRow">
          <div className="filtersLeft">
            <h2 className="sectionTitle">Listings</h2>
            <p className="sectionSub">
              Showing <span className="strong">{filteredProducts.length}</span> items
            </p>
          </div>

          <div className="filtersRight">
            <div className="searchBox">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="searchInput"
                placeholder="Search books, electronics, sellers…"
                aria-label="Search listings"
              />
              {query ? (
                <MagneticButton
                  className="clearBtn"
                  type="button"
                  intensity={10}
                  onClick={() => setQuery('')}
                >
                  Clear
                </MagneticButton>
              ) : null}
            </div>

            <MagneticButton
              className="ghostBtn"
              intensity={10}
              type="button"
              onClick={() => {
                setQuery('')
                setCategoryId('all')
                setConditionFilter('all')
                setMaxPrice(1000)
              }}
            >
              Reset filters
            </MagneticButton>
          </div>
        </div>

        <div className="marketShell">
          <aside className="filterSidebar">
            <h3 className="sidebarTitle">Filters</h3>
            <label className="field">
              <span className="fieldLabel">Category</span>
              <select
                className="fieldInput"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="fieldLabel">Condition</span>
              <select
                className="fieldInput"
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value as 'all' | Product['condition'])}
              >
                <option value="all">All</option>
                <option value="New">New</option>
                <option value="Like new">Like new</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </label>
            <label className="field">
              <span className="fieldLabel">Max Price: Rs {maxPrice}</span>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </label>
          </aside>
          <LayoutGroup>
            <motion.div
              className="productGrid"
              layout
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredProducts.map((p: Product, i: number) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    animateOnMount={animateIn}
                    onPrimaryAction={(id) => {
                      addViewed(id)
                      primaryAction(id)
                    }}
                    onOpen={openDetails}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      <ProductModal
        product={openProduct}
        open={!!openProduct}
        onClose={() => setOpenProductId(null)}
        onPrimaryAction={(id) => {
          addViewed(id)
          primaryAction(id)
        }}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            key="toast"
            className="toast"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

