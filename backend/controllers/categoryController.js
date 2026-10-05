import prisma from '../config/prisma.js';

export const INITIAL_CATEGORIES = [
  { name: 'Shirts', slug: 'shirts', description: 'Curated tailored and casual shirts in luxury poplin and linen', sortOrder: 1, isActive: true },
  { name: 'Jackets', slug: 'jackets', description: 'Architectural outerwear, bombers, and structured overcoats', sortOrder: 2, isActive: true },
  { name: 'Tees', slug: 'tees', description: 'Heavyweight organic cotton tees with relaxed proportions', sortOrder: 3, isActive: true },
  { name: 'Tailoring', slug: 'tailoring', description: 'Precision trousers and minimal structured tailoring', sortOrder: 4, isActive: true },
  { name: 'Jeans', slug: 'jeans', description: 'Japanese selvedge denim and straight-leg cuts', sortOrder: 5, isActive: true },
  { name: 'Footwear', slug: 'footwear', description: 'Monolith lug derbies, minimal leather boots, and loafers', sortOrder: 6, isActive: true },
  { name: 'Knitwear', slug: 'knitwear', description: 'Heavyweight ribbed merino wool and brushed mohair', sortOrder: 7, isActive: true },
  { name: 'Accessories', slug: 'accessories', description: 'Full-grain leather belts, silk scarves, and minimalist goods', sortOrder: 8, isActive: true },
  { name: 'Formals', slug: 'formals', description: 'Evening formalwear and black-tie essentials', sortOrder: 9, isActive: true },
];

/**
 * @desc Public: Fetch active categories for navigation and PLP filters
 * @route GET /api/categories
 */
export const getPublicCategories = async (req, res) => {
  try {
    let categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    if (categories.length === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: cat,
          create: cat,
        });
      }
      categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
    }

    const formatted = categories.map(c => ({ ...c, _id: c.id }));
    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin: Fetch all categories with real product counts
 * @route GET /api/categories/admin/list
 */
export const getAdminCategories = async (req, res) => {
  try {
    let categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    if (categories.length === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: cat,
          create: cat,
        });
      }
      categories = await prisma.category.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
    }

    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.product.count({
          where: {
            OR: [
              { category: cat.name },
              { category: cat.slug },
              { categoryId: cat.id },
            ],
          },
        });
        return {
          ...cat,
          _id: cat.id,
          productCount: count,
        };
      })
    );

    return res.status(200).json({ success: true, data: categoriesWithCounts });
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin: Create new category
 * @route POST /api/categories/admin
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const cleanName = name.trim();
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: cleanName, mode: 'insensitive' } }, { slug }],
      },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Category '${cleanName}' already exists.` });
    }

    const category = await prisma.category.create({
      data: {
        name: cleanName,
        slug,
        description: description || '',
        image: image || '',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { ...category, _id: category.id },
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin: Update category
 * @route PUT /api/categories/admin/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, sortOrder, isActive } = req.body;

    const existing = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let slug = existing.slug;
    if (name && name.trim() !== existing.name) {
      slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updated = await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: name ? name.trim() : existing.name,
        slug,
        description: description !== undefined ? description : existing.description,
        image: image !== undefined ? image : existing.image,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : existing.sortOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { ...updated, _id: updated.id },
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin: Delete category
 * @route DELETE /api/categories/admin/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if products belong to this category
    const count = await prisma.product.count({
      where: {
        OR: [
          { category: existing.name },
          { category: existing.slug },
          { categoryId: existing.id },
        ],
      },
    });

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category '${existing.name}'. There are ${count} products assigned to it. Reassign products first.`,
      });
    }

    await prisma.category.delete({ where: { id: existing.id } });

    return res.status(200).json({
      success: true,
      message: `Category '${existing.name}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
