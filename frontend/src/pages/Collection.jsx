import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import ProductCard from '../components/ProductCard'

const DEFAULT_CATEGORIES = ['All', 'Shirts', 'Tees', 'Jackets', 'Formals', 'Tailoring', 'Jeans', 'Footwear', 'Accessories']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Customer Rating', value: 'rating' },
]

export default function CollectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { category: urlCategory } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const isNewArrivals = location.pathname === '/new-arrivals' || searchParams.get('sort') === 'newest'
  const urlCat = urlCategory || searchParams.get('category')
  const initialCat = urlCat ? (DEFAULT_CATEGORIES.find(c => c.toLowerCase() === urlCat.toLowerCase()) || 'All') : 'All'
  const initialSort = searchParams.get('sort') || (location.pathname === '/new-arrivals' ? 'newest' : 'popular')

  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState(initialCat)
  const [selectedSize, setSelectedSize] = useState('All')
  const [sortBy, setSortBy] = useState(initialSort)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch dynamic categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories()
        if (res?.data && res.data.length > 0) {
          const names = ['All', ...res.data.map(c => c.name)]
          setCategoriesList(names)
        }
      } catch (_) {}
    }
    loadCategories()
  }, [])

  // Sync category from route parameter or query params
  useEffect(() => {
    const rawCat = urlCategory || searchParams.get('category')
    if (rawCat) {
      const lower = rawCat.toLowerCase()
      const found = categoriesList.find(c => c.toLowerCase() === lower)
      if (found) {
        setSelectedCategory(found)
      } else if (lower.includes('tshirt') || lower.includes('t-shirt') || lower.includes('tee')) {
        setSelectedCategory('Tees')
      } else if (lower.includes('trouser') || lower.includes('cargo') || lower.includes('tailor') || lower.includes('pant')) {
        setSelectedCategory('Tailoring')
      } else if (lower.includes('jean') || lower.includes('denim')) {
        setSelectedCategory('Jeans')
      } else if (lower.includes('jacket') || lower.includes('outerwear') || lower.includes('coat') || lower.includes('hoodie')) {
        setSelectedCategory('Jackets')
      } else if (lower.includes('polo') || lower.includes('shirt')) {
        setSelectedCategory('Shirts')
      } else if (lower.includes('formal') || lower.includes('suit') || lower.includes('tuxedo')) {
        setSelectedCategory('Formals')
      } else if (lower.includes('access') || lower.includes('belt') || lower.includes('wallet') || lower.includes('sunglass')) {
        setSelectedCategory('Accessories')
      } else {
        setSelectedCategory('All')
      }
    } else {
      setSelectedCategory('All')
    }

    const sortFromUrl = searchParams.get('sort')
    if (sortFromUrl && SORT_OPTIONS.some(o => o.value === sortFromUrl)) {
      setSortBy(sortFromUrl)
    }
  }, [urlCategory, searchParams, categoriesList])

  // Load products with query params passed to API
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const queryParams = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          sort: sortBy,
        }
        const res = await getProducts(queryParams)
        if (res?.data) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Shirts',
            color: p.color || 'Nocturne Black',
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: p.originalPrice || Math.round((typeof p.price === 'number' ? p.price : 1999) * 1.65),
            badge: p.badge || 'NEW',
            rating: p.rating || '4.9',
            reviewsCount: p.reviewsCount || 128,
            images: p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : []),
          }))
          setProducts(formatted)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.warn('Could not load products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [selectedCategory, sortBy])

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    const nextParams = new URLSearchParams(searchParams)
    if (cat === 'All') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', cat)
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleSortSelect = (newSort) => {
    setSortBy(newSort)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('sort', newSort)
    setSearchParams(nextParams, { replace: true })
  }

  // Filter & Sort Logic (Client & In-Memory safeguard)
  const filteredAndSorted = useMemo(() => {
    let list = [...products]

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating' || sortBy === 'popular') {
      list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    }

    return list
  }, [products, selectedCategory, sortBy])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 60 }}>
      {/* ─── Breadcrumb & Banner Header ────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', padding: '24px 0' }}>
        <div className="content-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {isNewArrivals ? 'New Arrivals' : "Men's Collection"}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {isNewArrivals 
                  ? (selectedCategory === 'All' ? 'NEW ARRIVALS' : `${selectedCategory} New Arrivals`)
                  : (selectedCategory === 'All' ? "All Men's Apparel" : `${selectedCategory} Collection`)}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {isNewArrivals
                  ? `Discover the latest drops, newest silhouettes, and seasonal additions.`
                  : (filteredAndSorted.length > 0
                      ? `Explore ${filteredAndSorted.length} premium ${filteredAndSorted.length === 1 ? 'garment' : 'garments'} designed for contemporary fit and effortless luxury.`
                      : "Curated contemporary silhouettes and minimalist menswear.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sticky Filter & Sort Controls ─────────────────────────────────── */}
      <div className="collection-controls-bar">
        <div className="content-container">
          <div className="collection-controls-inner">
            {/* Category Chips Scroll */}
            <div className="collection-tabs-scroll no-scrollbar">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`collection-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="collection-sort-wrap desktop-only">
              <span className="collection-sort-label">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSortSelect(e.target.value)}
                className="collection-sort-select"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile Metadata & Sort Sub-row */}
            <div className="collection-meta-row-mobile">
              <span className="collection-meta-count">
                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'Product' : 'Products'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSortSelect(e.target.value)}
                className="collection-sort-select-mobile"
                aria-label="Sort products mobile"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Products Grid ────────────────────────────────────────────── */}
      <div className="content-container" style={{ marginTop: 24 }}>
        {filteredAndSorted.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-light)',
            margin: '20px 0'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--text-muted)' }}>inventory_2</span>
            <h3 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', marginTop: 12 }}>No Garments in Catalog</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, maxWidth: 360, margin: '6px auto 16px' }}>
              Your catalog is currently empty. Add fresh garments via the Admin panel.
            </p>
          </div>
        ) : (
          <div className="product-grid-home">
            {filteredAndSorted.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
