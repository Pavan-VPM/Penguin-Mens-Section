import prisma from '../config/prisma.js';

// ═══════════════════════════════════════════════════════════════════════════
// PENGUIN MENSWEAR — 40-Product Curated Catalog
// Images: High-resolution open-source Pexels CDN
// ═══════════════════════════════════════════════════════════════════════════
export const INITIAL_PRODUCTS = [
  // ── SHIRTS (10) ──────────────────────────────────────────────────────────
  {
    slug: 'linen-camp-collar-shirt-1',
    name: 'Linen Camp Collar Shirt',
    category: 'Shirts',
    color: 'Ivory White',
    price: 1799,
    originalPrice: 3299,
    badge: '45% OFF',
    images: [
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:8,isSoldOut:false},{size:'M',stock:14,isSoldOut:false},{size:'L',stock:10,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Ivory White',hex:'#F5F0E8'},{name:'Sky Blue',hex:'#A8C4D4'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Premium European Linen (140 GSM). Pre-washed for softness.',
    careInstructions: 'Machine wash 30°C. Iron damp.',
    description: 'Relaxed camp collar silhouette in ultra-breathable linen.'
  },
  {
    slug: 'oxford-button-down-shirt-2',
    name: 'Oxford Button-Down Shirt',
    category: 'Shirts',
    color: 'Classic Blue',
    price: 1599,
    originalPrice: 2799,
    badge: '43% OFF',
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:10,isSoldOut:false},{size:'M',stock:18,isSoldOut:false},{size:'L',stock:12,isSoldOut:false},{size:'XL',stock:6,isSoldOut:false}],
    colorVariants: [{name:'Classic Blue',hex:'#5B7FA6'},{name:'White',hex:'#F8F8F8'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Ring-Spun Oxford Cotton (160 GSM).',
    careInstructions: 'Machine wash 40°C. Iron medium.',
    description: 'Classic button-down collar with a modern relaxed fit.'
  },
  {
    slug: 'slim-poplin-dress-shirt-3',
    name: 'Slim Poplin Dress Shirt',
    category: 'Shirts',
    color: 'Crisp White',
    price: 1899,
    originalPrice: 3299,
    badge: 'BESTSELLER',
    images: [
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:12,isSoldOut:false},{size:'M',stock:20,isSoldOut:false},{size:'L',stock:15,isSoldOut:false},{size:'XL',stock:8,isSoldOut:false}],
    colorVariants: [{name:'Crisp White',hex:'#FAFAFA'},{name:'Light Blue',hex:'#B8D4E8'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Egyptian Giza Cotton Poplin (100 GSM).',
    careInstructions: 'Machine wash 30°C. Iron hot.',
    description: 'Ultra-slim cut poplin dress shirt for formal occasions.'
  },
  {
    slug: 'oversized-flannel-check-shirt-4',
    name: 'Oversized Flannel Check Shirt',
    category: 'Shirts',
    color: 'Navy Plaid',
    price: 2199,
    originalPrice: 3799,
    badge: '42% OFF',
    images: [
      'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:6,isSoldOut:false},{size:'M',stock:10,isSoldOut:false},{size:'L',stock:8,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'Navy Plaid',hex:'#1A2744'},{name:'Red Plaid',hex:'#8B1A1A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Brushed Cotton Flannel (200 GSM).',
    careInstructions: 'Machine wash 40°C. Tumble dry medium.',
    description: 'Heavyweight flannel in oversized boxy cut for layered styling.'
  },
  {
    slug: 'cuban-collar-resort-shirt-5',
    name: 'Cuban Collar Resort Shirt',
    category: 'Shirts',
    color: 'Ecru Sand',
    price: 1699,
    originalPrice: 2999,
    badge: 'NEW',
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:9,isSoldOut:false},{size:'M',stock:16,isSoldOut:false},{size:'L',stock:11,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Ecru Sand',hex:'#D4C5A9'},{name:'Washed Black',hex:'#2A2A2A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '55% Linen, 45% Viscose (130 GSM).',
    careInstructions: 'Hand wash 30°C.',
    description: 'Open-collar resort shirt with relaxed boxy silhouette.'
  },
  {
    slug: 'chambray-work-shirt-6',
    name: 'Chambray Work Shirt',
    category: 'Shirts',
    color: 'Light Denim',
    price: 1499,
    originalPrice: 2599,
    badge: '42% OFF',
    images: [
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:7,isSoldOut:false},{size:'M',stock:13,isSoldOut:false},{size:'L',stock:9,isSoldOut:false},{size:'XL',stock:3,isSoldOut:false}],
    colorVariants: [{name:'Light Denim',hex:'#8FA8C8'},{name:'Dark Denim',hex:'#2D4062'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Yarn-Dyed Chambray Cotton (130 GSM).',
    careInstructions: 'Machine wash 40°C.',
    description: 'Workwear chambray with chest patch pocket.'
  },
  {
    slug: 'mandarin-collar-linen-shirt-7',
    name: 'Mandarin Collar Linen Shirt',
    category: 'Shirts',
    color: 'Stone Beige',
    price: 1899,
    originalPrice: 3199,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:5,isSoldOut:false},{size:'M',stock:11,isSoldOut:false},{size:'L',stock:7,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Stone Beige',hex:'#C8B89A'},{name:'Olive',hex:'#6B7A3D'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Washed Linen (150 GSM). Hidden placket.',
    careInstructions: 'Machine wash cold. Iron medium.',
    description: 'Minimalist mandarin collar with hidden placket.'
  },
  {
    slug: 'stripe-poplin-regular-shirt-8',
    name: 'Stripe Poplin Regular Shirt',
    category: 'Shirts',
    color: 'Blue Stripe',
    price: 1399,
    originalPrice: 2499,
    badge: '44% OFF',
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:10,isSoldOut:false},{size:'M',stock:20,isSoldOut:false},{size:'L',stock:14,isSoldOut:false},{size:'XL',stock:8,isSoldOut:false}],
    colorVariants: [{name:'Blue Stripe',hex:'#4A7AB5'},{name:'Pink Stripe',hex:'#D4A0A0'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Mercerized Cotton Poplin (120 GSM).',
    careInstructions: 'Machine wash 40°C. Iron hot.',
    description: 'Classic Bengal stripe poplin shirt, versatile for office or weekend.'
  },
  {
    slug: 'corduroy-overshirt-jacket-9',
    name: 'Corduroy Overshirt Jacket',
    category: 'Shirts',
    color: 'Tobacco Brown',
    price: 2799,
    originalPrice: 4499,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:4,isSoldOut:false},{size:'M',stock:8,isSoldOut:false},{size:'L',stock:6,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Tobacco Brown',hex:'#795548'},{name:'Forest Green',hex:'#3E5C3E'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Cotton Wide-Wale Corduroy (280 GSM).',
    careInstructions: 'Machine wash inside-out 30°C.',
    description: 'Heavy corduroy overshirt doubling as a light jacket.'
  },
  {
    slug: 'classic-white-dress-shirt-10',
    name: 'Classic White Dress Shirt',
    category: 'Shirts',
    color: 'Pure White',
    price: 1699,
    originalPrice: 2999,
    badge: '43% OFF',
    images: [
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:15,isSoldOut:false},{size:'M',stock:25,isSoldOut:false},{size:'L',stock:18,isSoldOut:false},{size:'XL',stock:10,isSoldOut:false}],
    colorVariants: [{name:'Pure White',hex:'#FFFFFF'},{name:'Ecru',hex:'#F0EBD8'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Supima Cotton Twill (140 GSM). Easy-iron finish.',
    careInstructions: 'Machine wash 60°C. Iron hot.',
    description: 'The wardrobe staple — premium Supima cotton in classic white.'
  },

  // ── T-SHIRTS (10) ─────────────────────────────────────────────────────────
  {
    slug: 'oversized-heavyweight-tee-11',
    name: 'Oversized Heavyweight Tee',
    category: 'Tees',
    color: 'Chalk White',
    price: 1199,
    originalPrice: 1999,
    badge: 'BESTSELLER',
    images: [
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'XS',stock:5,isSoldOut:false},{size:'S',stock:12,isSoldOut:false},{size:'M',stock:20,isSoldOut:false},{size:'L',stock:16,isSoldOut:false},{size:'XL',stock:8,isSoldOut:false}],
    colorVariants: [{name:'Chalk White',hex:'#F5F5F0'},{name:'Washed Black',hex:'#1A1A1A'},{name:'Stone Grey',hex:'#9E9E9E'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Ring-Spun Organic Cotton (260 GSM). Dropped shoulder.',
    careInstructions: 'Machine wash 30°C. Line dry.',
    description: '260 GSM organic cotton with dropped shoulders and boxy silhouette.'
  },
  {
    slug: 'acid-wash-vintage-tee-12',
    name: 'Acid Wash Vintage Tee',
    category: 'Tees',
    color: 'Washed Black',
    price: 999,
    originalPrice: 1799,
    badge: '44% OFF',
    images: [
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:8,isSoldOut:false},{size:'M',stock:15,isSoldOut:false},{size:'L',stock:10,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Washed Black',hex:'#2D2D2D'},{name:'Washed Grey',hex:'#7A7A7A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Cotton (220 GSM). Garment acid-washed.',
    careInstructions: 'Cold wash. Do not bleach. Line dry.',
    description: 'Pre-distressed acid wash tee — each piece unique.'
  },
  {
    slug: 'essential-crew-neck-tee-13',
    name: 'Essential Crew Neck Tee',
    category: 'Tees',
    color: 'Jet Black',
    price: 799,
    originalPrice: 1399,
    badge: '43% OFF',
    images: [
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'XS',stock:10,isSoldOut:false},{size:'S',stock:18,isSoldOut:false},{size:'M',stock:25,isSoldOut:false},{size:'L',stock:20,isSoldOut:false},{size:'XL',stock:12,isSoldOut:false}],
    colorVariants: [{name:'Jet Black',hex:'#0A0A0A'},{name:'White',hex:'#FAFAFA'},{name:'Navy',hex:'#1B2A4A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Combed Cotton Single Jersey (180 GSM).',
    careInstructions: 'Machine wash 40°C. Tumble dry low.',
    description: 'Precision-cut crew neck — the foundation of every outfit.'
  },
  {
    slug: 'graphic-print-oversized-tee-14',
    name: 'Graphic Print Oversized Tee',
    category: 'Tees',
    color: 'Off White',
    price: 1299,
    originalPrice: 2199,
    badge: 'NEW DROP',
    images: [
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:6,isSoldOut:false},{size:'M',stock:12,isSoldOut:false},{size:'L',stock:9,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'Off White',hex:'#F0EDE5'},{name:'Washed Black',hex:'#2A2A2A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% GOTS Organic Cotton (240 GSM). Water-based screen print.',
    careInstructions: 'Wash inside-out 30°C. Line dry.',
    description: 'Limited edition graphic tee with original Penguin artwork.'
  },
  {
    slug: 'v-neck-slim-fit-tee-15',
    name: 'V-Neck Slim Fit Tee',
    category: 'Tees',
    color: 'Navy Blue',
    price: 899,
    originalPrice: 1499,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:12,isSoldOut:false},{size:'M',stock:22,isSoldOut:false},{size:'L',stock:16,isSoldOut:false},{size:'XL',stock:9,isSoldOut:false}],
    colorVariants: [{name:'Navy Blue',hex:'#1A2A5E'},{name:'Burgundy',hex:'#7A1A2A'},{name:'Forest',hex:'#2A4A2A'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '95% Supima Cotton, 5% Elastane (190 GSM).',
    careInstructions: 'Machine wash 30°C.',
    description: 'Slim v-neck in Supima cotton with natural stretch.'
  },
  {
    slug: 'pigment-dyed-pocket-tee-16',
    name: 'Pigment Dyed Pocket Tee',
    category: 'Tees',
    color: 'Dusty Rose',
    price: 1099,
    originalPrice: 1899,
    badge: '42% OFF',
    images: [
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'XS',stock:4,isSoldOut:false},{size:'S',stock:10,isSoldOut:false},{size:'M',stock:16,isSoldOut:false},{size:'L',stock:12,isSoldOut:false}],
    colorVariants: [{name:'Dusty Rose',hex:'#C4A0A0'},{name:'Sage',hex:'#8FA48F'},{name:'Sand',hex:'#C4B48A'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Pigment-Dyed Cotton (220 GSM).',
    careInstructions: 'Cold wash. Line dry.',
    description: 'Pigment-dyed pocket tee with worn-in vintage aesthetic.'
  },
  {
    slug: 'long-sleeve-thermal-tee-17',
    name: 'Long Sleeve Thermal Tee',
    category: 'Tees',
    color: 'Charcoal Grey',
    price: 1399,
    originalPrice: 2399,
    badge: 'WINTER',
    images: [
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:8,isSoldOut:false},{size:'M',stock:14,isSoldOut:false},{size:'L',stock:10,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Charcoal Grey',hex:'#4A4A4A'},{name:'Cream',hex:'#EDE8D8'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '60% Cotton, 40% Polyester Thermal Waffle Knit (260 GSM).',
    careInstructions: 'Machine wash 30°C. Tumble dry medium.',
    description: 'Long-sleeve thermal waffle tee — layers under jackets perfectly.'
  },
  {
    slug: 'printed-relaxed-crop-tee-18',
    name: 'Printed Relaxed Crop Tee',
    category: 'Tees',
    color: 'Ecru',
    price: 999,
    originalPrice: 1699,
    badge: '41% OFF',
    images: [
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:7,isSoldOut:false},{size:'M',stock:13,isSoldOut:false},{size:'L',stock:8,isSoldOut:false}],
    colorVariants: [{name:'Ecru',hex:'#EDE0C4'},{name:'Black',hex:'#111111'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Combed Cotton (200 GSM). Slightly cropped hem.',
    careInstructions: 'Wash inside-out cold.',
    description: 'Slightly cropped tee pairs with high-rise trousers.'
  },
  {
    slug: 'ribbed-collar-essential-tee-19',
    name: 'Ribbed Collar Essential Tee',
    category: 'Tees',
    color: 'Slate Grey',
    price: 849,
    originalPrice: 1499,
    badge: '43% OFF',
    images: [
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'XS',stock:6,isSoldOut:false},{size:'S',stock:14,isSoldOut:false},{size:'M',stock:22,isSoldOut:false},{size:'L',stock:18,isSoldOut:false}],
    colorVariants: [{name:'Slate Grey',hex:'#708090'},{name:'Marl White',hex:'#F0F0F0'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Supima Cotton (200 GSM). Double ribbed collar.',
    careInstructions: 'Machine wash 40°C. Tumble dry low.',
    description: 'Elevated basic with double-layered ribbed collar.'
  },
  {
    slug: 'striped-baseball-tee-20',
    name: 'Striped Baseball Tee',
    category: 'Tees',
    color: 'White Navy',
    price: 1099,
    originalPrice: 1899,
    badge: 'NEW',
    images: [
      'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:9,isSoldOut:false},{size:'M',stock:17,isSoldOut:false},{size:'L',stock:12,isSoldOut:false}],
    colorVariants: [{name:'White Navy',hex:'#F5F5F5'},{name:'White Red',hex:'#F0EAEA'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Jersey Cotton (180 GSM). Contrast 3/4 sleeves.',
    careInstructions: 'Machine wash cold. Hang dry.',
    description: 'Classic baseball tee with contrast 3/4 raglan sleeves.'
  },

  // ── JACKETS (10) ──────────────────────────────────────────────────────────
  {
    slug: 'technical-matte-bomber-jacket-21',
    name: 'Technical Matte Bomber Jacket',
    category: 'Jackets',
    color: 'Washed Black',
    price: 3499,
    originalPrice: 5999,
    badge: 'DROP 01',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:3,isSoldOut:false},{size:'M',stock:7,isSoldOut:false},{size:'L',stock:5,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Washed Black',hex:'#1A1A1A'},{name:'Matte Olive',hex:'#4A5A3A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Hydrophobic Recycled Nylon Shell (220D). Thinsulate lining.',
    careInstructions: 'Gentle machine wash 30°C. Air dry.',
    description: 'Flight jacket DNA for urban environments. Dual Riri zippers.'
  },
  {
    slug: 'double-breasted-wool-overcoat-22',
    name: 'Double-Breasted Wool Overcoat',
    category: 'Jackets',
    color: 'Camel Tan',
    price: 5999,
    originalPrice: 9999,
    badge: 'LIMITED',
    images: [
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:2,isSoldOut:false},{size:'M',stock:4,isSoldOut:false},{size:'L',stock:3,isSoldOut:false},{size:'XL',stock:1,isSoldOut:false}],
    colorVariants: [{name:'Camel Tan',hex:'#C8A97A'},{name:'Charcoal',hex:'#3A3A3A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: '80% Italian Wool, 20% Cashmere (480 GSM). Satin-lined.',
    careInstructions: 'Dry clean only.',
    description: 'Architectural double-breasted overcoat in Italian wool-cashmere.'
  },
  {
    slug: 'quilted-puffer-jacket-23',
    name: 'Quilted Puffer Jacket',
    category: 'Jackets',
    color: 'Matte Black',
    price: 2999,
    originalPrice: 4999,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:6,isSoldOut:false},{size:'M',stock:12,isSoldOut:false},{size:'L',stock:9,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'Matte Black',hex:'#111111'},{name:'Olive Green',hex:'#4A5A3A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Recycled Nylon Shell. 90/10 Responsible Down (550 Fill).',
    careInstructions: 'Machine wash 30°C. Tumble dry low with tennis balls.',
    description: 'Lightweight quilted puffer. Packable into its own chest pocket.'
  },
  {
    slug: 'denim-trucker-jacket-24',
    name: 'Denim Trucker Jacket',
    category: 'Jackets',
    color: 'Mid Wash',
    price: 2499,
    originalPrice: 3999,
    badge: '37% OFF',
    images: [
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:8,isSoldOut:false},{size:'M',stock:14,isSoldOut:false},{size:'L',stock:10,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Mid Wash',hex:'#6B8CAE'},{name:'Dark Wash',hex:'#2D4062'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Selvedge Denim (12oz). Blanket-stitched interior.',
    careInstructions: 'Cold wash inside-out. Line dry.',
    description: 'Classic trucker in premium selvedge denim. Ages beautifully.'
  },
  {
    slug: 'leather-biker-jacket-25',
    name: 'Leather Biker Jacket',
    category: 'Jackets',
    color: 'Jet Black',
    price: 7999,
    originalPrice: 12999,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:2,isSoldOut:false},{size:'M',stock:5,isSoldOut:false},{size:'L',stock:4,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Jet Black',hex:'#0A0A0A'},{name:'Deep Brown',hex:'#3E2723'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Full-Grain Vegetable-Tanned Leather. Satin lining.',
    careInstructions: 'Wipe clean. Condition with leather balm.',
    description: 'Classic asymmetric moto jacket — gets better with every wear.'
  },
  {
    slug: 'coach-windbreaker-jacket-26',
    name: 'Coach Windbreaker Jacket',
    category: 'Jackets',
    color: 'Cobalt Blue',
    price: 1999,
    originalPrice: 3499,
    badge: '43% OFF',
    images: [
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:10,isSoldOut:false},{size:'M',stock:18,isSoldOut:false},{size:'L',stock:14,isSoldOut:false},{size:'XL',stock:7,isSoldOut:false}],
    colorVariants: [{name:'Cobalt Blue',hex:'#1A4FAA'},{name:'Black',hex:'#111111'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Nylon Ripstop. Mesh lining. Packable.',
    careInstructions: 'Machine wash 30°C. Air dry.',
    description: 'Lightweight ripstop windbreaker with packable design.'
  },
  {
    slug: 'overshirt-field-jacket-27',
    name: 'Overshirt Field Jacket',
    category: 'Jackets',
    color: 'Army Green',
    price: 2699,
    originalPrice: 4499,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:7,isSoldOut:false},{size:'M',stock:13,isSoldOut:false},{size:'L',stock:10,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Army Green',hex:'#4A5A3A'},{name:'Sand',hex:'#C4B48A'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Cotton Canvas (280 GSM). Four flap pockets.',
    careInstructions: 'Machine wash 40°C. Hang dry.',
    description: 'Military-inspired field jacket in heavy cotton canvas.'
  },
  {
    slug: 'shearling-collar-jacket-28',
    name: 'Shearling Collar Jacket',
    category: 'Jackets',
    color: 'Chocolate Brown',
    price: 4999,
    originalPrice: 7999,
    badge: 'WINTER',
    images: [
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:3,isSoldOut:false},{size:'M',stock:6,isSoldOut:false},{size:'L',stock:5,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Chocolate Brown',hex:'#5D3A1A'},{name:'Jet Black',hex:'#0A0A0A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Suede outer with genuine shearling collar and lining.',
    careInstructions: 'Specialist leather and suede cleaning.',
    description: 'Premium suede jacket with genuine shearling collar.'
  },
  {
    slug: 'harrington-varsity-jacket-29',
    name: 'Harrington Varsity Jacket',
    category: 'Jackets',
    color: 'Bottle Green',
    price: 2299,
    originalPrice: 3799,
    badge: '39% OFF',
    images: [
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:5,isSoldOut:false},{size:'M',stock:11,isSoldOut:false},{size:'L',stock:8,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'Bottle Green',hex:'#1A4A2A'},{name:'Burgundy',hex:'#6A1A2A'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Cotton Harrington shell with tartan lining.',
    careInstructions: 'Machine wash 30°C. Tumble dry low.',
    description: 'Iconic Harrington with zip front and tartan lining.'
  },
  {
    slug: 'parka-hooded-winter-jacket-30',
    name: 'Parka Hooded Winter Jacket',
    category: 'Jackets',
    color: 'Khaki Tan',
    price: 3999,
    originalPrice: 6499,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1466133/pexels-photo-1466133.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:4,isSoldOut:false},{size:'M',stock:9,isSoldOut:false},{size:'L',stock:7,isSoldOut:false},{size:'XL',stock:3,isSoldOut:false}],
    colorVariants: [{name:'Khaki Tan',hex:'#C4AA7A'},{name:'Army Green',hex:'#4A5A3A'}],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Water-resistant Nylon outer. Removable fur hood trim.',
    careInstructions: 'Machine wash 30°C. Tumble dry low.',
    description: 'Long parka with detachable hood and inner fleece lining.'
  },

  // ── FORMALS (10) ─────────────────────────────────────────────────────────
  {
    slug: 'slim-fit-formal-suit-set-31',
    name: 'Slim Fit Formal Suit Set',
    category: 'Formals',
    color: 'Charcoal Grey',
    price: 7999,
    originalPrice: 12999,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:4,isSoldOut:false},{size:'M',stock:8,isSoldOut:false},{size:'L',stock:6,isSoldOut:false},{size:'XL',stock:3,isSoldOut:false}],
    colorVariants: [{name:'Charcoal Grey',hex:'#4A4A4A'},{name:'Navy Blue',hex:'#1A2040'},{name:'Black',hex:'#0A0A0A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '70% Wool, 30% Polyester. Half-canvas construction.',
    careInstructions: 'Dry clean only.',
    description: 'Sharp slim-fit suit set. Italian-inspired tailoring.'
  },
  {
    slug: 'white-formal-shirt-black-trouser-32',
    name: 'White Formal Shirt + Black Trouser',
    category: 'Formals',
    color: 'White and Black',
    price: 3499,
    originalPrice: 5999,
    badge: '41% OFF',
    images: [
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:6,isSoldOut:false},{size:'M',stock:12,isSoldOut:false},{size:'L',stock:9,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'White and Black',hex:'#FAFAFA'},{name:'Blue and Grey',hex:'#5B7FA6'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Shirt: 100% Egyptian Cotton. Trousers: 65% Poly, 35% Viscose.',
    careInstructions: 'Dry clean or machine wash shirt 40°C.',
    description: 'Crisp white dress shirt with slim flat-front black trousers.'
  },
  {
    slug: 'navy-blazer-cream-trouser-33',
    name: 'Navy Blazer + Cream Trouser',
    category: 'Formals',
    color: 'Navy and Cream',
    price: 6499,
    originalPrice: 10999,
    badge: '41% OFF',
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:3,isSoldOut:false},{size:'M',stock:7,isSoldOut:false},{size:'L',stock:5,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Navy and Cream',hex:'#1A2040'},{name:'Black and Grey',hex:'#0A0A0A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Blazer: 100% Wool. Trousers: Cotton-Linen Blend.',
    careInstructions: 'Dry clean blazer. Machine wash trousers 30°C.',
    description: 'Navy wool blazer paired with relaxed cream linen-blend trousers.'
  },
  {
    slug: 'black-tie-formal-set-34',
    name: 'Black Tie Formal Set',
    category: 'Formals',
    color: 'Jet Black',
    price: 8999,
    originalPrice: 14999,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:2,isSoldOut:false},{size:'M',stock:5,isSoldOut:false},{size:'L',stock:4,isSoldOut:false},{size:'XL',stock:1,isSoldOut:false}],
    colorVariants: [{name:'Jet Black',hex:'#0A0A0A'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Tuxedo: Satin peak lapel, 100% Wool. Satin-stripe trousers.',
    careInstructions: 'Dry clean only. Store in garment bag.',
    description: 'Complete black-tie tuxedo set with satin peak lapels.'
  },
  {
    slug: 'light-blue-shirt-formal-trousers-35',
    name: 'Light Blue Shirt + Formal Trousers',
    category: 'Formals',
    color: 'Blue and Grey',
    price: 3999,
    originalPrice: 6499,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:7,isSoldOut:false},{size:'M',stock:13,isSoldOut:false},{size:'L',stock:9,isSoldOut:false},{size:'XL',stock:4,isSoldOut:false}],
    colorVariants: [{name:'Blue and Grey',hex:'#5B7FA6'},{name:'White and Black',hex:'#FAFAFA'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Shirt: Cotton Poplin. Trousers: Wool-Poly stretch.',
    careInstructions: 'Shirt: Machine wash 40°C. Trousers: Dry clean.',
    description: 'Pale blue Oxford shirt paired with slim formal grey trousers.'
  },
  {
    slug: 'linen-formal-shirt-chino-set-36',
    name: 'Linen Formal Shirt + Chino Set',
    category: 'Formals',
    color: 'Stone and Navy',
    price: 4299,
    originalPrice: 6999,
    badge: '38% OFF',
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:5,isSoldOut:false},{size:'M',stock:10,isSoldOut:false},{size:'L',stock:8,isSoldOut:false},{size:'XL',stock:3,isSoldOut:false}],
    colorVariants: [{name:'Stone and Navy',hex:'#C8B89A'},{name:'White and Khaki',hex:'#FAFAFA'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Shirt: 100% Linen. Trousers: Cotton-Elastane Chino.',
    careInstructions: 'Machine wash both 30°C. Iron linen damp.',
    description: 'Breathable linen shirt with slim cotton chinos for garden parties.'
  },
  {
    slug: 'pinstripe-formal-trouser-suit-37',
    name: 'Pinstripe Formal Trouser Suit',
    category: 'Formals',
    color: 'Navy Pinstripe',
    price: 8499,
    originalPrice: 13999,
    badge: '39% OFF',
    images: [
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:3,isSoldOut:false},{size:'M',stock:6,isSoldOut:false},{size:'L',stock:5,isSoldOut:false},{size:'XL',stock:2,isSoldOut:false}],
    colorVariants: [{name:'Navy Pinstripe',hex:'#1A2040'},{name:'Charcoal Pinstripe',hex:'#4A4A4A'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: '100% Super 120s Wool. Canvassed chest.',
    careInstructions: 'Dry clean only. Store on wide hanger.',
    description: 'Power-dressing pinstripe two-piece in Super 120s wool.'
  },
  {
    slug: 'smart-formal-shirt-set-38',
    name: 'Smart Formal Shirt Set',
    category: 'Formals',
    color: 'White and Charcoal',
    price: 2999,
    originalPrice: 4999,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:9,isSoldOut:false},{size:'M',stock:16,isSoldOut:false},{size:'L',stock:12,isSoldOut:false},{size:'XL',stock:6,isSoldOut:false}],
    colorVariants: [{name:'White and Charcoal',hex:'#FAFAFA'},{name:'Blue and Black',hex:'#5B7FA6'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Shirt: Cotton-Linen. Trousers: 100% Cotton Drill.',
    careInstructions: 'Machine wash 40°C. Iron hot.',
    description: 'Non-iron cotton shirt with straight-leg cotton drill trousers.'
  },
  {
    slug: 'brown-suit-with-formal-shirt-39',
    name: 'Brown Suit with Formal Shirt',
    category: 'Formals',
    color: 'Tobacco Brown',
    price: 7499,
    originalPrice: 11999,
    badge: '37% OFF',
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:2,isSoldOut:false},{size:'M',stock:5,isSoldOut:false},{size:'L',stock:4,isSoldOut:false},{size:'XL',stock:1,isSoldOut:false}],
    colorVariants: [{name:'Tobacco Brown',hex:'#795548'},{name:'Cognac',hex:'#8B4513'}],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: '100% Wool-Cotton Blend. Unlined Italian feel.',
    careInstructions: 'Dry clean. min-width press with cloth.',
    description: 'Rich tobacco brown suit with unstructured relaxed Italian feel.'
  },
  {
    slug: 'office-smart-formal-combo-40',
    name: 'Office Smart Formal Combo',
    category: 'Formals',
    color: 'Grey and White',
    price: 3299,
    originalPrice: 5499,
    badge: '40% OFF',
    images: [
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: [{size:'S',stock:8,isSoldOut:false},{size:'M',stock:14,isSoldOut:false},{size:'L',stock:11,isSoldOut:false},{size:'XL',stock:5,isSoldOut:false}],
    colorVariants: [{name:'Grey and White',hex:'#9E9E9E'},{name:'Navy and Blue',hex:'#1A2040'}],
    isFeatured: false,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Shirt: Non-iron Supima Cotton. Trousers: Stretch Formal 2% Elastane.',
    careInstructions: 'Machine wash both 40°C. Iron shirt hot.',
    description: 'Wrinkle-resistant shirt with stretch formal trousers for all-day comfort.'
  }
];

// In-Memory store fallback for offline database environments
let inMemoryProducts = INITIAL_PRODUCTS.map((prod, index) => ({
  ...prod,
  _id: `mock_prod_${index + 1}`,
  createdAt: new Date(Date.now() - index * 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

/**
 * @desc Get all products with filtering, searching, sorting & pagination
 * @route GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      color,
      size,
      minPrice,
      maxPrice,
      isWinterDrop,
      isFeatured,
      search,
      sort = 'newest',
      page = 1,
      limit = 50,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category && category !== 'All') {
      where.OR = [
        { category: { equals: category.trim(), mode: 'insensitive' } },
        { category: { contains: category.trim(), mode: 'insensitive' } },
        { categoryRel: { slug: category.toLowerCase().trim() } },
        { categoryRel: { name: { equals: category.trim(), mode: 'insensitive' } } },
      ];
    }

    if (color) {
      where.color = { contains: color.trim(), mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (isWinterDrop === 'true') {
      where.isWinterDrop = true;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      const searchOR = [
        { name: { contains: q, mode: 'insensitive' } },
        { color: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchOR }];
        delete where.OR;
      } else {
        where.OR = searchOR;
      }
    }

    const sortMap = {
      newest: { createdAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      name_asc: { name: 'asc' },
      popular: { createdAt: 'desc' },
      rating: { createdAt: 'desc' },
    };
    const orderBy = sortMap[sort] || sortMap.newest;

    let total = await prisma.product.count({ where });

    if (total === 0 && Object.keys(req.query).length === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await prisma.product.upsert({
          where: { slug: p.slug },
          update: p,
          create: p,
        });
      }
      total = await prisma.product.count();
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    });

    const formattedProducts = products.map(p => ({ ...p, _id: p.id }));

    return res.status(200).json({
      success: true,
      count: formattedProducts.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: formattedProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single product by ID or Slug
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const formattedProduct = { ...product, _id: product.id };

    // Fetch related products in the same category
    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        NOT: { id: product.id },
      },
      take: 4,
    });

    const formattedRelated = related.map(r => ({ ...r, _id: r.id }));

    return res.status(200).json({
      success: true,
      data: formattedProduct,
      product: formattedProduct,
      related: formattedRelated,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create new product (Admin)
 * @route POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (typeof productData.price === 'string') productData.price = Number(productData.price.replace(/[^\d.]/g, ''));
    if (typeof productData.originalPrice === 'string' && productData.originalPrice) productData.originalPrice = Number(productData.originalPrice.replace(/[^\d.]/g, ''));
    if (!productData.images || productData.images.length === 0) productData.images = ['https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600'];

    const cleanSlug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `item-${Date.now()}`);

    const createdProduct = await prisma.product.create({
      data: {
        slug: cleanSlug,
        name: productData.name,
        category: productData.category || 'Shirts',
        color: productData.color || '',
        price: Number(productData.price) || 0,
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
        badge: productData.badge || null,
        images: productData.images || [],
        sizes: productData.sizes || [],
        colorVariants: productData.colorVariants || [],
        isFeatured: Boolean(productData.isFeatured),
        isWinterDrop: Boolean(productData.isWinterDrop),
        inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
        stockStatus: productData.stockStatus || 'In Stock',
        fabricDetails: productData.fabricDetails || '',
        careInstructions: productData.careInstructions || '',
        description: productData.description || '',
      },
    });

    const formatted = { ...createdProduct, _id: createdProduct.id };
    return res.status(201).json({ success: true, message: 'Product created successfully', data: formatted });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update product (Admin)
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (typeof updates.price === 'string') updates.price = Number(updates.price.replace(/[^\d.]/g, ''));
    if (typeof updates.originalPrice === 'string' && updates.originalPrice) updates.originalPrice = Number(updates.originalPrice.replace(/[^\d.]/g, ''));

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: updates.name !== undefined ? updates.name : undefined,
        slug: updates.slug !== undefined ? updates.slug : undefined,
        category: updates.category !== undefined ? updates.category : undefined,
        color: updates.color !== undefined ? updates.color : undefined,
        price: updates.price !== undefined ? Number(updates.price) : undefined,
        originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : undefined,
        badge: updates.badge !== undefined ? updates.badge : undefined,
        images: updates.images !== undefined ? updates.images : undefined,
        sizes: updates.sizes !== undefined ? updates.sizes : undefined,
        colorVariants: updates.colorVariants !== undefined ? updates.colorVariants : undefined,
        isFeatured: updates.isFeatured !== undefined ? Boolean(updates.isFeatured) : undefined,
        isWinterDrop: updates.isWinterDrop !== undefined ? Boolean(updates.isWinterDrop) : undefined,
        inStock: updates.inStock !== undefined ? Boolean(updates.inStock) : undefined,
        stockStatus: updates.stockStatus !== undefined ? updates.stockStatus : undefined,
        fabricDetails: updates.fabricDetails !== undefined ? updates.fabricDetails : undefined,
        careInstructions: updates.careInstructions !== undefined ? updates.careInstructions : undefined,
        description: updates.description !== undefined ? updates.description : undefined,
      },
    });

    const formatted = { ...updatedProduct, _id: updatedProduct.id };
    return res.status(200).json({ success: true, message: 'Product updated successfully', data: formatted });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete product (Admin)
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.product.delete({ where: { id: existing.id } });
    return res.status(200).json({ success: true, message: 'Product deleted from catalog' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Reset and re-seed with full 40-product catalog
 * @route POST /api/products/seed/initial
 */
export const seedProducts = async (req, res) => {
  try {
    await prisma.product.deleteMany({});
    for (const p of INITIAL_PRODUCTS) {
      await prisma.product.create({ data: p });
    }
    const products = await prisma.product.findMany();
    const formatted = products.map(p => ({ ...p, _id: p.id }));

    return res.status(200).json({
      success: true,
      message: `Seeded ${formatted.length} items in PostgreSQL`,
      data: formatted,
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Bulk Delete Products (Admin)
 * @route POST /api/products/bulk-delete
 */
export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of product IDs is required.' });
    }

    const result = await prisma.product.deleteMany({
      where: {
        OR: [
          { id: { in: ids } },
          { slug: { in: ids } }
        ]
      }
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.count} products.`,
      count: result.count
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Bulk Update Products (Admin)
 * @route POST /api/products/bulk-update
 */
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of product IDs is required.' });
    }
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Updates payload is required.' });
    }

    const dataToUpdate = {};
    if (updates.category !== undefined && updates.category !== '') {
      dataToUpdate.category = updates.category;
    }
    if (updates.stockStatus !== undefined && updates.stockStatus !== '') {
      dataToUpdate.stockStatus = updates.stockStatus;
      dataToUpdate.inStock = updates.stockStatus !== 'Sold Out' && updates.stockStatus !== 'Out of Stock';
    }
    if (updates.inStock !== undefined) {
      dataToUpdate.inStock = Boolean(updates.inStock);
      if (!updates.inStock && !dataToUpdate.stockStatus) {
        dataToUpdate.stockStatus = 'Out of Stock';
      }
    }
    if (updates.badge !== undefined) {
      dataToUpdate.badge = updates.badge || null;
    }
    if (updates.isFeatured !== undefined) {
      dataToUpdate.isFeatured = Boolean(updates.isFeatured);
    }
    if (updates.isWinterDrop !== undefined) {
      dataToUpdate.isWinterDrop = Boolean(updates.isWinterDrop);
    }
    if (updates.price !== undefined && updates.price !== '') {
      dataToUpdate.price = Number(updates.price);
    }
    if (updates.originalPrice !== undefined && updates.originalPrice !== '') {
      dataToUpdate.originalPrice = Number(updates.originalPrice);
    }

    const result = await prisma.product.updateMany({
      where: {
        OR: [
          { id: { in: ids } },
          { slug: { in: ids } }
        ]
      },
      data: dataToUpdate
    });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${result.count} products.`,
      count: result.count
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
