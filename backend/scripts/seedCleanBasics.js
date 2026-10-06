import prisma from '../config/prisma.js';

const CLEAN_BASICS = [
  // ─── 1. SHIRTS (5) ────────────────────────────────────────────────────────
  {
    category: 'Shirts',
    name: 'Essential Plain Black Poplin Shirt',
    slug: 'essential-plain-black-poplin-shirt',
    color: 'Plain Black',
    price: 1899,
    originalPrice: 2999,
    badge: 'ESSENTIAL',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Chalk White', hex: '#F5F5F0' }
    ],
    fabricDetails: '100% High-Density Poplin Cotton (140 GSM). Smooth matte finish.',
    careInstructions: 'Machine wash delicate at 30°C. Low heat iron.',
    description: 'A timeless basic poplin shirt with clean proportions, tonal matte buttons, and a crisp point collar.'
  },
  {
    category: 'Shirts',
    name: 'Minimalist Crisp White Oxford Shirt',
    slug: 'minimalist-crisp-white-oxford-shirt',
    color: 'Crisp White',
    price: 1799,
    originalPrice: 2899,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#A8C4D4' }
    ],
    fabricDetails: '100% Ring-Spun Oxford Cotton (160 GSM). Breathable woven basketweave.',
    careInstructions: 'Machine wash 40°C. Medium iron.',
    description: 'Clean button-down collar Oxford shirt with structured casual drape.'
  },
  {
    category: 'Shirts',
    name: 'Classic Charcoal Linen Shirt',
    slug: 'classic-charcoal-linen-shirt',
    color: 'Charcoal Grey',
    price: 2199,
    originalPrice: 3499,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Pure Washed European Linen (150 GSM).',
    careInstructions: 'Cold hand wash or machine gentle. Line dry.',
    description: 'Breathable washed linen shirt designed for effortless year-round styling.'
  },
  {
    category: 'Shirts',
    name: 'Relaxed Navy Camp Collar Shirt',
    slug: 'relaxed-navy-camp-collar-shirt',
    color: 'Deep Navy',
    price: 1699,
    originalPrice: 2699,
    badge: 'POPULAR',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Breathable Rayon Poplin (130 GSM). Silky matte drape.',
    careInstructions: 'Machine wash 30°C. Cool iron.',
    description: 'Relaxed camp collar silhouette in deep navy for refined casual wear.'
  },
  {
    category: 'Shirts',
    name: 'Matte Black Structured Overshirt',
    slug: 'matte-black-structured-overshirt',
    color: 'Plain Black',
    price: 2499,
    originalPrice: 3999,
    badge: 'CORE',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Olive Green', hex: '#3B4B36' }
    ],
    fabricDetails: '100% Heavy Twill Cotton (220 GSM). Dual chest patch pockets.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Heavyweight architectural overshirt designed for easy layering over basic tees.'
  },

  // ─── 2. TEES (5) ──────────────────────────────────────────────────────────
  {
    category: 'Tees',
    name: 'Heavyweight Boxy Plain Black Tee',
    slug: 'heavyweight-boxy-plain-black-tee',
    color: 'Plain Black',
    price: 1199,
    originalPrice: 1999,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Chalk White', hex: '#F5F5F0' }
    ],
    fabricDetails: '240 GSM Heavyweight 100% Combed Organic Cotton. Drop-shoulder cut.',
    careInstructions: 'Machine wash cold inside out. Do not tumble dry.',
    description: 'Luxury heavyweight basic box-fit t-shirt with reinforced ribbed collar.'
  },
  {
    category: 'Tees',
    name: 'Classic Plain Chalk White Crew Tee',
    slug: 'classic-plain-chalk-white-crew-tee',
    color: 'Chalk White',
    price: 999,
    originalPrice: 1699,
    badge: 'ESSENTIAL',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '200 GSM 100% Ring-Spun Supima Cotton.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Everyday clean crewneck tee in soft chalk white with clean tailored drape.'
  },
  {
    category: 'Tees',
    name: 'Washed Charcoal Drop-Shoulder Tee',
    slug: 'washed-charcoal-drop-shoulder-tee',
    color: 'Charcoal Grey',
    price: 1299,
    originalPrice: 2199,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#383838' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '220 GSM Vintage Enzyme Washed Cotton.',
    careInstructions: 'Machine wash cold.',
    description: 'Minimalist vintage washed charcoal tee with relaxed shoulders and seamless hem.'
  },
  {
    category: 'Tees',
    name: 'Deep Navy Heavy Cotton Tee',
    slug: 'deep-navy-heavy-cotton-tee',
    color: 'Deep Navy',
    price: 1199,
    originalPrice: 1899,
    badge: 'CORE',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '220 GSM 100% Combed Cotton.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Structured deep navy basic tee with rich color-fast dye.'
  },
  {
    category: 'Tees',
    name: 'Clean Slate Grey Minimalist Tee',
    slug: 'clean-slate-grey-minimalist-tee',
    color: 'Slate Grey',
    price: 999,
    originalPrice: 1699,
    badge: 'BASIC',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Slate Grey', hex: '#6A7079' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '190 GSM 100% Cotton.',
    careInstructions: 'Machine wash 30°C.',
    description: 'Understated slate grey basic tee tailored for everyday comfort.'
  },

  // ─── 3. JACKETS (5) ───────────────────────────────────────────────────────
  {
    category: 'Jackets',
    name: 'Minimalist Plain Black Bomber Jacket',
    slug: 'minimalist-plain-black-bomber-jacket',
    color: 'Plain Black',
    price: 3499,
    originalPrice: 5999,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Matte Olive', hex: '#4A5340' }
    ],
    fabricDetails: 'Water-repellent matte technical nylon shell with satin interior lining.',
    careInstructions: 'Dry clean recommended or gentle hand wash.',
    description: 'Sleek monochrome bomber jacket with clean ribbed trims and gunmetal two-way zip.'
  },
  {
    category: 'Jackets',
    name: 'Clean Washed Black Denim Jacket',
    slug: 'clean-washed-black-denim-jacket',
    color: 'Washed Black',
    price: 2999,
    originalPrice: 4899,
    badge: 'CORE',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Washed Black', hex: '#242424' },
      { name: 'Raw Indigo', hex: '#1C2951' }
    ],
    fabricDetails: '13.5 oz 100% Rigid Cotton Denim. Custom matte black shank buttons.',
    careInstructions: 'Machine wash cold inside out.',
    description: 'Classic trucker silhouette in washed black denim with boxy modern fit.'
  },
  {
    category: 'Jackets',
    name: 'Matte Charcoal Windbreaker Jacket',
    slug: 'matte-charcoal-windbreaker-jacket',
    color: 'Charcoal Grey',
    price: 2799,
    originalPrice: 4499,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Lightweight technical microfiber (wind and light drizzle resistant).',
    careInstructions: 'Machine wash cold 30°C.',
    description: 'Ultra-lightweight minimalist windbreaker jacket with concealed hood and bungee hem.'
  },
  {
    category: 'Jackets',
    name: 'Deep Navy Coach Jacket',
    slug: 'deep-navy-coach-jacket',
    color: 'Deep Navy',
    price: 2699,
    originalPrice: 4299,
    badge: 'POPULAR',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Polyester-cotton blend with snap-button front.',
    careInstructions: 'Machine wash delicate.',
    description: 'Modern coach jacket with clean point collar and tonal snap closures.'
  },
  {
    category: 'Jackets',
    name: 'Plain Black Tailored Utility Overshirt',
    slug: 'plain-black-tailored-utility-overshirt',
    color: 'Plain Black',
    price: 3199,
    originalPrice: 4999,
    badge: 'ESSENTIAL',
    isFeatured: true,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Heavyweight brushed cotton drill (260 GSM).',
    careInstructions: 'Machine wash cold.',
    description: 'Clean architectural outerwear piece designed with streamlined utility pockets.'
  },

  // ─── 4. TAILORING (5) ─────────────────────────────────────────────────────
  {
    category: 'Tailoring',
    name: 'Pleated Plain Black Trousers',
    slug: 'pleated-plain-black-trousers',
    color: 'Plain Black',
    price: 2499,
    originalPrice: 3999,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Slate Grey', hex: '#708090' }
    ],
    fabricDetails: 'Poly-Viscose Twill with 3% Elastane stretch.',
    careInstructions: 'Dry clean or cold delicate wash.',
    description: 'Relaxed wide-leg trousers with clean double front pleats and draped silhouette.'
  },
  {
    category: 'Tailoring',
    name: 'Clean Slate Grey Relaxed Chino',
    slug: 'clean-slate-grey-relaxed-chino',
    color: 'Slate Grey',
    price: 1999,
    originalPrice: 3299,
    badge: 'ESSENTIAL',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Slate Grey', hex: '#708090' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '98% Cotton, 2% Spandex stretch twill.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Everyday modern chino with tailored leg taper and clean welt back pockets.'
  },
  {
    category: 'Tailoring',
    name: 'Matte Charcoal Straight-Leg Pant',
    slug: 'matte-charcoal-straight-leg-pant',
    color: 'Charcoal Grey',
    price: 2299,
    originalPrice: 3699,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Wool-touch woven polyester.',
    careInstructions: 'Machine wash 30°C.',
    description: 'Clean straight-leg trousers designed for modern minimal office and casual sets.'
  },
  {
    category: 'Tailoring',
    name: 'Deep Navy Tailored Easy Pant',
    slug: 'deep-navy-tailored-easy-pant',
    color: 'Deep Navy',
    price: 2199,
    originalPrice: 3499,
    badge: 'COMFORT',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Stretch cotton poplin with elasticated waistband.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Tailored trousers with discreet drawstring interior and structured front crease.'
  },
  {
    category: 'Tailoring',
    name: 'Minimalist Black Utility Cargo Pant',
    slug: 'minimalist-black-utility-cargo-pant',
    color: 'Plain Black',
    price: 2699,
    originalPrice: 4299,
    badge: 'STREETWEAR',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Military Khaki', hex: '#5B533E' }
    ],
    fabricDetails: 'Heavyweight ripstop cotton.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Clean silhouette cargo pants with flush flap pockets and toggle-adjustable hems.'
  },

  // ─── 5. JEANS (5) ─────────────────────────────────────────────────────────
  {
    category: 'Jeans',
    name: 'Pure Jet Black Relaxed Fit Denim',
    slug: 'pure-jet-black-relaxed-fit-denim',
    color: 'Plain Black',
    price: 2499,
    originalPrice: 3999,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#0A0A0A' }
    ],
    fabricDetails: '14 oz 100% Solid Black Cotton Denim. Non-fade reactive dye.',
    careInstructions: 'Machine wash cold inside out.',
    description: 'Solid jet-black relaxed fit jeans crafted with durable heavyweight denim.'
  },
  {
    category: 'Jeans',
    name: 'Clean Washed Charcoal Straight Jeans',
    slug: 'clean-washed-charcoal-straight-jeans',
    color: 'Charcoal Grey',
    price: 2399,
    originalPrice: 3799,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#303030' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '13.5 oz 99% Cotton, 1% Elastane.',
    careInstructions: 'Machine wash cold.',
    description: 'Straight-leg jeans in a clean vintage charcoal wash with subtle whiskering.'
  },
  {
    category: 'Jeans',
    name: 'Deep Raw Indigo Selvedge Denim',
    slug: 'deep-raw-indigo-selvedge-denim',
    color: 'Deep Indigo',
    price: 2999,
    originalPrice: 4999,
    badge: 'SELVEDGE',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Indigo', hex: '#1C2951' }
    ],
    fabricDetails: '14.5 oz shuttle-loom woven Japanese selvedge denim with red ID ticker.',
    careInstructions: 'Wash sparingly inside out in cold water.',
    description: 'Unwashed raw selvedge denim designed to break in and patina uniquely over time.'
  },
  {
    category: 'Jeans',
    name: 'Classic Dark Blue Straight Denim',
    slug: 'classic-dark-blue-straight-denim',
    color: 'Dark Blue',
    price: 2199,
    originalPrice: 3499,
    badge: 'CORE',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Dark Blue', hex: '#2A3B5C' }
    ],
    fabricDetails: '13 oz 100% Cotton.',
    careInstructions: 'Machine wash cold.',
    description: 'Clean dark blue straight jeans with classic five-pocket construction.'
  },
  {
    category: 'Jeans',
    name: 'Minimalist Fade Black Loose Jeans',
    slug: 'minimalist-fade-black-loose-jeans',
    color: 'Washed Black',
    price: 2599,
    originalPrice: 4199,
    badge: 'POPULAR',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Washed Black', hex: '#222222' }
    ],
    fabricDetails: '13 oz Soft Cotton Denim.',
    careInstructions: 'Machine wash 30°C.',
    description: 'Loose streetwear silhouette jeans in washed vintage black.'
  },

  // ─── 6. FOOTWEAR (5) ──────────────────────────────────────────────────────
  {
    category: 'Footwear',
    name: 'Plain Matte Black Chunky Derby Shoes',
    slug: 'plain-matte-black-chunky-derby-shoes',
    color: 'Plain Black',
    price: 3999,
    originalPrice: 6499,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Full-Grain Cowhide Leather with Goodyear Welted Commando Lug Sole.',
    careInstructions: 'Wipe clean with leather conditioner.',
    description: 'Architectural plain derby shoes featuring chunky lug soles and clean matte leather finish.'
  },
  {
    category: 'Footwear',
    name: 'Minimalist All-Black Leather Sneakers',
    slug: 'minimalist-all-black-leather-sneakers',
    color: 'Plain Black',
    price: 3299,
    originalPrice: 5299,
    badge: 'ESSENTIAL',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Smooth nappa leather with cushioned memory-foam insole and vulcanized rubber sole.',
    careInstructions: 'Clean with damp cloth and leather cream.',
    description: 'Monochrome low-top leather trainers with clean unbranded profile.'
  },
  {
    category: 'Footwear',
    name: 'Clean Chalk White Leather Low-Tops',
    slug: 'clean-chalk-white-leather-low-tops',
    color: 'Chalk White',
    price: 3299,
    originalPrice: 5299,
    badge: 'CORE',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Chalk White', hex: '#F5F5F0' }
    ],
    fabricDetails: 'Premium Italian calfskin leather with durable stitched rubber cupsole.',
    careInstructions: 'Wipe clean with sneaker foam.',
    description: 'Clean luxury white court sneakers with minimal blind eyelets.'
  },
  {
    category: 'Footwear',
    name: 'Structured Black Lug-Sole Loafers',
    slug: 'structured-black-lug-sole-loafers',
    color: 'Plain Black',
    price: 3799,
    originalPrice: 5999,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Polished calf leather with chunky slip-resistant rubber tread.',
    careInstructions: 'Polish with neutral shoe cream.',
    description: 'Contemporary penny loafer silhouette with chunky architectural platform.'
  },
  {
    category: 'Footwear',
    name: 'Minimalist Suede Chelsea Boots in Black',
    slug: 'minimalist-suede-chelsea-boots-in-black',
    color: 'Plain Black',
    price: 4499,
    originalPrice: 6999,
    badge: 'WINTER',
    isFeatured: true,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Water-resistant treated black suede with elasticated side gussets.',
    careInstructions: 'Brush with suede cleaning brush.',
    description: 'Sleek black suede Chelsea boots with streamlined profile.'
  },

  // ─── 7. KNITWEAR (5) ──────────────────────────────────────────────────────
  {
    category: 'Knitwear',
    name: 'Fine Gauge Plain Black Crewneck Sweater',
    slug: 'fine-gauge-plain-black-crewneck-sweater',
    color: 'Plain Black',
    price: 2499,
    originalPrice: 3999,
    badge: 'BESTSELLER',
    isFeatured: true,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' },
      { name: 'Charcoal Grey', hex: '#333333' }
    ],
    fabricDetails: '100% Extrafine Merino Wool (12-gauge knit). Super-soft and non-itchy.',
    careInstructions: 'Hand wash cold or dry clean. Dry flat.',
    description: 'Fine-knit merino wool basic sweater with slim ribbed cuffs and seamless collar.'
  },
  {
    category: 'Knitwear',
    name: 'Clean Charcoal Ribbed Knit Pullover',
    slug: 'clean-charcoal-ribbed-knit-pullover',
    color: 'Charcoal Grey',
    price: 2799,
    originalPrice: 4499,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#383838' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '70% Organic Cotton, 30% Merino Wool.',
    careInstructions: 'Cold hand wash.',
    description: 'Textured rib-knit sweater with relaxed drop-shoulder cut.'
  },
  {
    category: 'Knitwear',
    name: 'Minimalist Chalk White Knit Sweater',
    slug: 'minimalist-chalk-white-knit-sweater',
    color: 'Chalk White',
    price: 2699,
    originalPrice: 4199,
    badge: 'ESSENTIAL',
    isFeatured: true,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Chalk White', hex: '#F5F5F0' }
    ],
    fabricDetails: '100% Organic Heavy Cotton Knit.',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    description: 'Clean chalk white knitted crewneck for layered minimal styling.'
  },
  {
    category: 'Knitwear',
    name: 'Deep Navy Merino Wool Pullover',
    slug: 'deep-navy-merino-wool-pullover',
    color: 'Deep Navy',
    price: 2499,
    originalPrice: 3999,
    badge: 'CORE',
    isFeatured: false,
    isWinterDrop: true,
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' }
    ],
    fabricDetails: '100% Merino Wool.',
    careInstructions: 'Dry clean or cold hand wash.',
    description: 'Lightweight thermal merino pullover in deep navy.'
  },
  {
    category: 'Knitwear',
    name: 'Relaxed Black Knit Polo Sweater',
    slug: 'relaxed-black-knit-polo-sweater',
    color: 'Plain Black',
    price: 2899,
    originalPrice: 4599,
    badge: 'POPULAR',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Silk-Cotton Knit Blend (14-gauge).',
    careInstructions: 'Cold hand wash.',
    description: 'Johnny collar buttonless knit polo sweater in pure black.'
  },

  // ─── 8. ACCESSORIES (5) ───────────────────────────────────────────────────
  {
    category: 'Accessories',
    name: 'Minimalist Matte Black Leather Belt',
    slug: 'minimalist-matte-black-leather-belt',
    color: 'Plain Black',
    price: 1299,
    originalPrice: 1999,
    badge: 'CORE',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Full-Grain Vegetable Tanned Leather with gunmetal brushed pin buckle.',
    careInstructions: 'Wipe with dry cloth.',
    description: '30mm clean minimalist leather belt with bevelled edges and unbranded buckle.'
  },
  {
    category: 'Accessories',
    name: 'Clean Plain Black Structured Cap',
    slug: 'clean-plain-black-structured-cap',
    color: 'Plain Black',
    price: 899,
    originalPrice: 1499,
    badge: 'ESSENTIAL',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '100% Heavy Twill Cotton with brass strapback buckle.',
    careInstructions: 'Spot clean only.',
    description: 'Unbranded 6-panel low-profile dad cap in solid black cotton.'
  },
  {
    category: 'Accessories',
    name: 'Full-Grain Black Leather Cardholder',
    slug: 'full-grain-black-leather-cardholder',
    color: 'Plain Black',
    price: 999,
    originalPrice: 1599,
    badge: 'POPULAR',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Full-Grain Calf Leather with 4 card slots and central cash pocket.',
    careInstructions: 'Wipe clean.',
    description: 'Slim minimal leather cardholder designed for front-pocket carry.'
  },
  {
    category: 'Accessories',
    name: 'Premium Black Ribbed Cotton Socks (3-Pack)',
    slug: 'premium-black-ribbed-cotton-socks-3-pack',
    color: 'Plain Black',
    price: 599,
    originalPrice: 999,
    badge: 'PACK OF 3',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '80% Combed Cotton, 17% Polyamide, 3% Elastane.',
    careInstructions: 'Machine wash 40°C.',
    description: 'Three pairs of cushioned ribbed everyday socks in solid jet black.'
  },
  {
    category: 'Accessories',
    name: 'Minimalist Black Canvas Weekend Tote',
    slug: 'minimalist-black-canvas-weekend-tote',
    color: 'Plain Black',
    price: 1499,
    originalPrice: 2499,
    badge: 'NEW',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: '16 oz Heavyweight Cotton Duck Canvas with reinforced handles.',
    careInstructions: 'Spot clean.',
    description: 'Heavy-duty black canvas tote bag with magnetic closure and laptop sleeve.'
  },

  // ─── 9. FORMALS (5) ───────────────────────────────────────────────────────
  {
    category: 'Formals',
    name: 'Tailored Plain Black Single-Breasted Blazer',
    slug: 'tailored-plain-black-single-breasted-blazer',
    color: 'Plain Black',
    price: 4999,
    originalPrice: 7999,
    badge: 'BESPOKE',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Wool-blend twill with structured shoulder pads and horn buttons.',
    careInstructions: 'Professional dry clean only.',
    description: 'Modern slim tailored black blazer with notched lapels and dual back vents.'
  },
  {
    category: 'Formals',
    name: 'Structured Charcoal Formal Suit Jacket',
    slug: 'structured-charcoal-formal-suit-jacket',
    color: 'Charcoal Grey',
    price: 4799,
    originalPrice: 7499,
    badge: 'NEW',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Charcoal Grey', hex: '#2A2A2A' },
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Wool-touch woven suiting fabric with silk-touch lining.',
    careInstructions: 'Dry clean only.',
    description: 'Refined charcoal two-button suit jacket engineered for business and formal evenings.'
  },
  {
    category: 'Formals',
    name: 'Classic Deep Navy Slim Fit Blazer',
    slug: 'classic-deep-navy-slim-fit-blazer',
    color: 'Deep Navy',
    price: 4599,
    originalPrice: 7299,
    badge: 'CORE',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Deep Navy', hex: '#1A2040' }
    ],
    fabricDetails: 'Italian spun stretch wool-poly blend.',
    careInstructions: 'Dry clean.',
    description: 'Versatile navy blazer with contemporary half-canvas chest construction.'
  },
  {
    category: 'Formals',
    name: 'Formal Crisp White French Cuff Dress Shirt',
    slug: 'formal-crisp-white-french-cuff-dress-shirt',
    color: 'Crisp White',
    price: 2199,
    originalPrice: 3499,
    badge: 'PREMIUM',
    isFeatured: true,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Crisp White', hex: '#FFFFFF' }
    ],
    fabricDetails: '100% 2-Ply Egyptian Giza Cotton (120/2 yarn count).',
    careInstructions: 'Machine wash 40°C. Hot iron with steam.',
    description: 'Luxury white formal dress shirt with stiffened spread collar and double French cuffs.'
  },
  {
    category: 'Formals',
    name: 'Tailored Black Formal Suit Trousers',
    slug: 'tailored-black-formal-suit-trousers',
    color: 'Plain Black',
    price: 2499,
    originalPrice: 3899,
    badge: 'ESSENTIAL',
    isFeatured: false,
    isWinterDrop: false,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80'
    ],
    colorVariants: [
      { name: 'Plain Black', hex: '#111111' }
    ],
    fabricDetails: 'Wool-blend crease-resistant fabric with satin curtain waistband.',
    careInstructions: 'Dry clean only.',
    description: 'Flat-front formal suit trousers with tapered leg and unhemmed cuffs for custom tailor length.'
  }
];

async function seedCleanBasics() {
  console.log('Seeding 5 clean basic products for every category (45 products total)...');
  
  // Wipe existing products first
  await prisma.product.deleteMany({});

  const standardSizes = [
    { size: 'S', stock: 12, isSoldOut: false },
    { size: 'M', stock: 24, isSoldOut: false },
    { size: 'L', stock: 18, isSoldOut: false },
    { size: 'XL', stock: 10, isSoldOut: false },
    { size: 'XXL', stock: 6, isSoldOut: false },
  ];

  const accessorySizes = [
    { size: 'Standard', stock: 50, isSoldOut: false },
  ];

  const footwearSizes = [
    { size: '40 EU / 7 US', stock: 8, isSoldOut: false },
    { size: '41 EU / 8 US', stock: 14, isSoldOut: false },
    { size: '42 EU / 9 US', stock: 18, isSoldOut: false },
    { size: '43 EU / 10 US', stock: 12, isSoldOut: false },
    { size: '44 EU / 11 US', stock: 6, isSoldOut: false },
  ];

  // Fetch category IDs from DB
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

  for (const item of CLEAN_BASICS) {
    const isFootwear = item.category === 'Footwear';
    const isAccessory = item.category === 'Accessories';
    const chosenSizes = isFootwear ? footwearSizes : (isAccessory ? accessorySizes : standardSizes);
    const categoryId = categoryMap.get(item.category.toLowerCase()) || null;

    await prisma.product.create({
      data: {
        slug: item.slug,
        name: item.name,
        category: item.category,
        categoryId,
        color: item.color,
        price: item.price,
        originalPrice: item.originalPrice,
        badge: item.badge,
        images: item.images,
        sizes: chosenSizes,
        colorVariants: item.colorVariants || [],
        isFeatured: Boolean(item.isFeatured),
        isWinterDrop: Boolean(item.isWinterDrop),
        inStock: true,
        stock: 50,
        stockStatus: 'In Stock',
        fabricDetails: item.fabricDetails,
        careInstructions: item.careInstructions,
        description: item.description,
      }
    });
  }

  const finalCount = await prisma.product.count();
  console.log(`✅ Successfully seeded ${finalCount} clean basic products into the database!`);
  
  // Display category breakdown
  for (const cat of categories) {
    const count = await prisma.product.count({ where: { category: cat.name } });
    console.log(`   - ${cat.name}: ${count} products`);
  }
}

seedCleanBasics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding clean basics:', err);
    process.exit(1);
  });
