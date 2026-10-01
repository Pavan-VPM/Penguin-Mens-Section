import Product from '../models/Product.js';

// Initial curated menswear catalog data
export const INITIAL_PRODUCTS = [
  {
    name: 'Structured Wool Overshirt',
    category: 'Shirts',
    color: 'Charcoal Melange',
    price: 14500,
    originalPrice: 18500,
    badge: 'Drop 01',
    badgeColor: 'var(--primary)',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR9S4fgMwiQA96pWo4DRRnR4yoqrORLPBRtU1exX8jFx4Mf2lu4FZb0To4JX24dcoEh-GbRf-FaR0s39tPIiS-Wq0OsNB6EjKqSxhQGXr6jGjGplvjbLYbTqyJxLhFFwdTcx8VHcX7jpv4b6tEmXM8HrtLl5wfKDkseOPqLDMKvkLxq7qflNN9MqLaF67Kxj_tJ08uRdK6jSUxDaYDhtHlAB-7Gx5TOqStb4NoD1G01OK9YFRlnEY',
    ],
    sizes: [
      { size: 'S', stock: 5, isSoldOut: false },
      { size: 'M', stock: 12, isSoldOut: false },
      { size: 'L', stock: 8, isSoldOut: false },
      { size: 'XL', stock: 2, isSoldOut: false },
    ],
    colorVariants: [
      { name: 'Charcoal Melange', hex: '#2A2B2D' },
      { name: 'Nocturne Black', hex: '#111111' },
      { name: 'Slate Grey', hex: '#5A6065' },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Double-faced Wool Melange (380 GSM). Brushed interior for soft drape and wind resistance.',
    careInstructions: 'Dry clean only. Cool iron over a damp cloth if necessary.',
    description: 'Minimalist architecture meets bespoke tailoring. Heavyweight structured wool silhouette cut with relaxed shoulders and matte horn buttons.',
  },
  {
    name: 'Heavyweight Boxy Tee',
    category: 'Tees',
    color: 'Chalk White',
    price: 4990,
    originalPrice: 6500,
    badge: 'Organic',
    badgeColor: 'var(--secondary)',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEg9HtS0jCzYVX0DNa-H01P07DEd3yPNgAGhR7l8uhurLYtOmmkzrWBT-fzc9gCXaU9VuLEaE7zzyWMh59UyiGYFM7gPlBxgZcVe6SJXIuDYleaWLtY2go9B0wDdGTc2ubG_j3tC9-6Q6dg6j6aaweB2iDSlt8Dp0Q5bHXK1YWSkFPa4a9ewDrgjcTvIBfBULm9Tzb2N4ps4HytEYk3FEgY9IyiyksGJUIWB1EsPMVZOGHdXrKzZeA',
    ],
    sizes: [
      { size: 'XS', stock: 4, isSoldOut: false },
      { size: 'S', stock: 10, isSoldOut: false },
      { size: 'M', stock: 15, isSoldOut: false },
      { size: 'L', stock: 14, isSoldOut: false },
      { size: 'XL', stock: 6, isSoldOut: false },
    ],
    colorVariants: [
      { name: 'Chalk White', hex: '#F0EFEA' },
      { name: 'Pitch Black', hex: '#0B0B0B' },
      { name: 'Washed Olive', hex: '#4A5043' },
    ],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Ring-Spun GOTS Certified Organic Combed Cotton (260 GSM).',
    careInstructions: 'Machine wash delicate at 30°C. Line dry in shade.',
    description: 'The definitive daily luxury foundation. High-density organic cotton jersey engineered with dropped shoulder seams and a bound ribbed collar.',
  },
  {
    name: 'Relaxed Pleated Trouser',
    category: 'Tailoring',
    color: 'Slate Grey',
    price: 11500,
    originalPrice: null,
    badge: '',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl',
    ],
    sizes: [
      { size: '30', stock: 6, isSoldOut: false },
      { size: '32', stock: 10, isSoldOut: false },
      { size: '34', stock: 8, isSoldOut: false },
      { size: '36', stock: 3, isSoldOut: false },
    ],
    colorVariants: [
      { name: 'Slate Grey', hex: '#484D52' },
      { name: 'Nocturne Black', hex: '#111111' },
    ],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Italian Tropical Virgin Wool Blend with 2% Elastane for subtle flex.',
    careInstructions: 'Dry clean only. Steam press.',
    description: 'Modern relaxed tailoring. Double forward pleats create an elegant drape from the high waist down to a wide, breakless hem.',
  },
  {
    name: 'Technical Bomber Jacket',
    category: 'Jackets',
    color: 'Washed Black',
    price: 18900,
    originalPrice: 22000,
    badge: 'Limited',
    badgeColor: 'var(--primary)',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF',
    ],
    sizes: [
      { size: 'S', stock: 2, isSoldOut: false },
      { size: 'M', stock: 5, isSoldOut: false },
      { size: 'L', stock: 4, isSoldOut: false },
      { size: 'XL', stock: 0, isSoldOut: true },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Hydrophobic Japanese Recycled Nylon Shell with lightweight Thinsulate insulation.',
    careInstructions: 'Specialist gentle wet clean only.',
    description: 'Flight jacket DNA refined into minimalist luxury. Features dual two-way Riri zippers and weather-sealed storm cuffs.',
  },
  {
    name: 'Raw Selvedge Denim',
    category: 'Jeans',
    color: 'Deep Indigo',
    price: 14900,
    originalPrice: null,
    badge: '14.5oz',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_',
    ],
    sizes: [
      { size: '30', stock: 5, isSoldOut: false },
      { size: '32', stock: 8, isSoldOut: false },
      { size: '34', stock: 6, isSoldOut: false },
      { size: '36', stock: 2, isSoldOut: false },
    ],
    isFeatured: true,
    isWinterDrop: false,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '14.5oz Kurabo Mills Japanese Selvedge Denim woven on vintage shuttle looms.',
    careInstructions: 'Wear raw for 6 months before first cold hand wash with denim detergent.',
    description: 'Unwashed shuttle-loom denim designed to mold uniquely to the wearer over years of use.',
  },
  {
    name: 'Monolith Lug Derby',
    category: 'Footwear',
    color: 'Matte Black',
    price: 21500,
    originalPrice: null,
    badge: 'Atelier',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm',
    ],
    sizes: [
      { size: '40', stock: 3, isSoldOut: false },
      { size: '41', stock: 6, isSoldOut: false },
      { size: '42', stock: 8, isSoldOut: false },
      { size: '43', stock: 5, isSoldOut: false },
      { size: '44', stock: 2, isSoldOut: false },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: 'Full-grain Italian Calfskin Leather with Goodyear welted lightweight Vibram lug sole.',
    careInstructions: 'Condition with neutral leather balm. Store in cedar shoe trees.',
    description: 'Chunky architectural silhouette with exaggerated commando tread and hand-burnished edge finishing.',
  },
  {
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 11900,
    originalPrice: 15000,
    badge: 'Drop 01',
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDw6PlIfD7vb_n4u5I_wD4HhFdTcV-UVOCENxio76QfVtj4TtfRRyePIpQIcJigP4x9Wc7TemI-nMXXz6Pt7XngwmTtRuBYdxnhGmoGboojO1aB4qDaF8UBDAqL-EKhubCIg19kp_1Kvw65x8WO4Rzftn8xvR5e0BIIwaGyqj97L00TABLrHE0n7YezXGVCKzCQSEdTRZNm10F1GUVNiBmvJvBz3q8wCtZpserBa9hHWrT6REccVN_4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA8K4W-FWh7vCYR_mvxb8wOL-rNOr0a633cUAMpF8eh5QxC614cWcQEpiQSaRejQNnri7CgeDLbrRuYzbZuDbNAM_sJtIPV15Y8BBOKF-Y3EpQ3gHW36ynSnnFZGlzqccRALL8zRwe9P9L2eHAGDs8fdhRUsDXLjGzeIHvXqO8jaB4ybpyYPRq6Vvqc4d92tse7zqKIIhYfdKoqJ3fJc7Qrp8vmN9_ETZ30v2PzbUq4rVOVpYAGd_nk',
    ],
    sizes: [
      { size: 'S', stock: 4, isSoldOut: false },
      { size: 'M', stock: 10, isSoldOut: false },
      { size: 'L', stock: 6, isSoldOut: false },
      { size: 'XL', stock: 0, isSoldOut: true },
    ],
    colorVariants: [
      { name: 'Nocturne Black', hex: '#111111' },
      { name: 'Deep Charcoal', hex: '#2B2B2B' },
      { name: 'Slate White', hex: '#EBEBEB' },
      { name: 'Graphite', hex: '#3E4247' },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Only 4 left',
    fabricDetails: '100% Japanese High-Density Organic Cotton Poplin (180 GSM). Double-stitched seams with matte black hardware.',
    careInstructions: 'Dry clean only or delicate machine wash at 30°C inside-out. Do not tumble dry. Cool iron on reverse.',
    description: 'Precision tailored overshirt featuring an exaggerated camp collar, concealed placket, and side split vents.',
  },
  {
    name: 'Cocoon Tech Overcoat',
    category: 'Jackets',
    color: 'Obsidian Black',
    price: 29900,
    originalPrice: 38000,
    badge: 'Limited Drop',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMcWjy3fc8ms2v322i4KsHjjqsF8Aq-MkauMwU7eFgN9eltVE2jd-ie_damkN6PrGmoYwQdT9lHTQfL4lmA9vYBjLiY0J3Ub8LLGwmH4qgRkmOvtfEEX2gL5u-zYEgSpC8HjBWjxRekLABxWoGfPOffgV_u4MrrkdczbPqI8OfLAPNdKlfkqJGo65U2u-qO4SG_rHV_UnwvLyTbsVvNlZLbIgF2RyYYidVi36LVb5GfFM0ZTnuDJjN',
    ],
    sizes: [
      { size: '46', stock: 2, isSoldOut: false },
      { size: '48', stock: 4, isSoldOut: false },
      { size: '50', stock: 3, isSoldOut: false },
      { size: '52', stock: 1, isSoldOut: false },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'Low Stock',
    fabricDetails: 'Triple-layer bonded technical wool with breathable membrane.',
    careInstructions: 'Specialist dry clean only.',
    description: 'An architectural outerwear masterpiece. Cocoon silhouette cut generously to accommodate layered tailoring beneath.',
  },
  {
    name: 'Brushed Mohair Knit',
    category: 'Knitwear',
    color: 'Moss Haze',
    price: 15500,
    originalPrice: null,
    badge: 'Atelier Knit',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcGdhD4ZhQZ3oH5KMNUpJBqde0mkUzM9j4twJPVO21A63Ua1y4VTDOAOACkYyw_jInAlG-EqHBlCnvAcZo6fVekY73Jbek2y9iO1xA9d1Vog4RgiGAGlrr3blonbPBzgPxsZgaIue--6RcwEZXAhdeyqlM33Rs08jPqiftAcBYM-82jrlxXWv5bPyPXoopwRUVdXinW98_SB412MGmNP3RGAYsEK9PM2h6uGbXLYmayNsYHY_RgGje',
    ],
    sizes: [
      { size: 'XS', stock: 0, isSoldOut: true },
      { size: 'S', stock: 3, isSoldOut: false },
      { size: 'M', stock: 7, isSoldOut: false },
      { size: 'L', stock: 5, isSoldOut: false },
    ],
    isFeatured: true,
    isWinterDrop: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '65% South African Kid Mohair, 30% Polyamide, 5% Wool.',
    careInstructions: 'Hand wash cold with wool detergent. Dry flat on towel.',
    description: 'Ultra-soft hand-brushed mohair sweater with intentional slouch and deep ribbed hems.',
  },
];

/**
 * @desc Get all products with filtering, searching, and sorting
 * @route GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { category, isWinterDrop, isFeatured, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (isWinterDrop === 'true') {
      query.isWinterDrop = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };

    let products = await Product.find(query).sort(sortOptions);

    // If database is empty, auto-seed initial products
    if (products.length === 0 && Object.keys(query).length === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      products = await Product.find().sort(sortOptions);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
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
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product,
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

    // Format price if sent as formatted string
    if (typeof productData.price === 'string') {
      productData.price = Number(productData.price.replace(/[^\d.]/g, ''));
    }
    if (typeof productData.originalPrice === 'string' && productData.originalPrice) {
      productData.originalPrice = Number(productData.originalPrice.replace(/[^\d.]/g, ''));
    }

    // Default image fallback if none provided
    if (!productData.images || productData.images.length === 0) {
      productData.images = ['https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'];
    }

    const product = new Product(productData);
    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
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

    if (typeof updates.price === 'string') {
      updates.price = Number(updates.price.replace(/[^\d.]/g, ''));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
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
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted from catalog',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Reset / Re-seed products with initial curated catalog
 * @route POST /api/products/seed
 */
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const seeded = await Product.insertMany(INITIAL_PRODUCTS);
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${seeded.length} menswear catalog items`,
      data: seeded,
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
