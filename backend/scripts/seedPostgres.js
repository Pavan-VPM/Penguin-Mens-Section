import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';
import { INITIAL_PRODUCTS } from '../controllers/productController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DEFAULT_CATEGORIES = [
  { name: 'Shirts', slug: 'shirts', description: 'Curated casual, camp collar, and oxford button downs', sortOrder: 1 },
  { name: 'Jackets', slug: 'jackets', description: 'Structured outerwear, bombers, and winter drop staples', sortOrder: 2 },
  { name: 'Tees', slug: 'tees', description: 'Heavyweight organic cotton staples & boxy cuts', sortOrder: 3 },
  { name: 'Tailoring', slug: 'tailoring', description: 'Bespoke fit suits, blazers, and formal trousers', sortOrder: 4 },
  { name: 'Jeans', slug: 'jeans', description: 'Selvedge and contemporary denim cuts', sortOrder: 5 },
  { name: 'Footwear', slug: 'footwear', description: 'Handcrafted leather loafers, chelsea boots, and sneakers', sortOrder: 6 },
  { name: 'Knitwear', slug: 'knitwear', description: 'Merino wool cardigans and crewneck sweaters', sortOrder: 7 },
  { name: 'Accessories', slug: 'accessories', description: 'Full-grain leather belts, silk ties, and pocket squares', sortOrder: 8 },
  { name: 'Formals', slug: 'formals', description: 'Evening shirts, tuxedos, and black-tie essentials', sortOrder: 9 },
];

async function main() {
  console.log('🐘 Seeding PostgreSQL database (penguin_mens_store)...');

  // 1. Seed SuperAdmin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@penguin.com';
  const existingSuperAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Penguin Lead Superadmin',
        email: adminEmail,
        password: hashedPassword,
        role: 'superadmin',
        mfaEnabled: false,
      },
    });
    console.log(` SuperAdmin user created: ${adminEmail} (password: ${process.env.ADMIN_PASSWORD || 'admin123'})`);
  } else {
    console.log(`ℹ️ SuperAdmin already exists: ${adminEmail}`);
  }

  // 2. Seed Categories
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder, isActive: true },
      create: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder, isActive: true },
    });
  }
  console.log(` Seeded ${DEFAULT_CATEGORIES.length} Categories.`);

  // 3. Seed Products
  let count = 0;
  for (const p of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        color: p.color || '',
        price: p.price,
        originalPrice: p.originalPrice || null,
        badge: p.badge || null,
        images: p.images || [],
        sizes: p.sizes || [],
        colorVariants: p.colorVariants || [],
        isFeatured: Boolean(p.isFeatured),
        isWinterDrop: Boolean(p.isWinterDrop),
        inStock: Boolean(p.inStock),
        stockStatus: p.stockStatus || 'In Stock',
        fabricDetails: p.fabricDetails || '',
        careInstructions: p.careInstructions || '',
        description: p.description || '',
      },
      create: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        color: p.color || '',
        price: p.price,
        originalPrice: p.originalPrice || null,
        badge: p.badge || null,
        images: p.images || [],
        sizes: p.sizes || [],
        colorVariants: p.colorVariants || [],
        isFeatured: Boolean(p.isFeatured),
        isWinterDrop: Boolean(p.isWinterDrop),
        inStock: Boolean(p.inStock),
        stockStatus: p.stockStatus || 'In Stock',
        fabricDetails: p.fabricDetails || '',
        careInstructions: p.careInstructions || '',
        description: p.description || '',
      },
    });
    count++;
  }
  console.log(` Seeded ${count} Products in PostgreSQL.`);

  // 4. Seed Site Config
  const existingConfig = await prisma.siteConfig.findFirst();
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        marqueeText: 'COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING ON ALL ORDERS OVER ₹5,000 — 100% HANDCRAFTED ATELIER TAILORING',
        heroHeadline: 'ATELIER PRECISION. TIMELESS SILHOUETTES.',
        heroSubheadline: 'Handcrafted menswear engineered for contemporary elegance and effortless structure.',
        heroDropTag: 'WINTER CAPSULE 2026',
        showWinterDrop: true,
        winterDropTitle: 'WINTER DROP 01',
        winterDropSubtitle: 'Limited capsule — Structured outerwear, heavyweight knitwear & tech bombers. Only 100 units per style.',
        winterDropCta: 'Explore Winter Capsule',
      },
    });
    console.log(' Seeded Site Configuration.');
  }

  console.log('\n PostgreSQL Seeding Complete! You can now run `npx prisma studio` to see all data visually in your browser.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
