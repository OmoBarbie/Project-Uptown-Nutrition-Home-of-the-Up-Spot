/**
 * Database Seed Script
 *
 * Populates the database with initial data:
 * - Categories
 * - Products (from current client app)
 * - Sample users (admin and customer)
 * - Sample reviews and ratings
 *
 * Run with: bun run db:seed
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from database directory
config({ path: resolve(__dirname, '../.env') });

// Also try loading from root if not found
if (!process.env.DATABASE_URL) {
  config({ path: resolve(__dirname, '../../.env') });
}

import { getDb } from './db';
import * as schema from './schema';
import { createId } from '@paralleldrive/cuid2';

// Helper to create slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper to hash passwords (simple - use bcrypt in production)
function hashPassword(password: string): string {
  // In production, use bcrypt or argon2
  // For seeding purposes, we'll just prefix with 'hashed_'
  return `hashed_${password}`;
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const db = getDb();

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await db.delete(schema.reviewHelpful);
    await db.delete(schema.reviews);
    await db.delete(schema.productRatings);
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.cartItems);
    await db.delete(schema.carts);
    await db.delete(schema.productVariants);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.addresses);
    await db.delete(schema.users);
    console.log('✅ Cleared existing data\n');

    // ========================================
    // 1. SEED USERS
    // ========================================
    console.log('👤 Seeding users...');

    const [adminUser] = await db.insert(schema.users).values({
      id: createId(),
      email: 'admin@uptownnutrition.com',
      name: 'Admin User',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      emailVerified: true,
    }).returning();

    const [customerUser] = await db.insert(schema.users).values({
      id: createId(),
      email: 'customer@example.com',
      name: 'John Doe',
      passwordHash: hashPassword('customer123'),
      role: 'customer',
      emailVerified: true,
      phone: '555-0123',
    }).returning();

    const [customerUser2] = await db.insert(schema.users).values({
      id: createId(),
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      passwordHash: hashPassword('customer123'),
      role: 'customer',
      emailVerified: true,
    }).returning();

    console.log(`✅ Created ${3} users\n`);

    // ========================================
    // 2. SEED ADDRESSES
    // ========================================
    console.log('📍 Seeding addresses...');

    await db.insert(schema.addresses).values({
      id: createId(),
      userId: customerUser.id,
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      isDefault: true,
    });

    console.log('✅ Created sample addresses\n');

    // ========================================
    // 3. SEED CATEGORIES
    // ========================================
    console.log('📦 Seeding categories...');

    const categoriesData = [
      {
        name: 'Sweet Tooth',
        description: 'Delicious high-protein treats that satisfy your cravings while fueling your body with quality nutrition.',
        sortOrder: 1,
      },
      {
        name: 'Protein Based Snacks',
        description: 'Protein-based snacks perfect for on-the-go nutrition. Delicious treats that support your fitness goals.',
        sortOrder: 2,
      },
      {
        name: 'Smoothies',
        description: 'Protein-packed smoothies in 30+ delicious flavors. Perfect for post-workout or a healthy meal replacement. 250-350 cals / 9-14g sugar / 10-15g carbs',
        sortOrder: 3,
      },
      {
        name: 'Refreshers',
        description: 'Energizing refreshers for focus, hydration and energy. Available in 24oz and 32oz sizes.',
        sortOrder: 4,
      },
      {
        name: 'Combos',
        description: 'Our best value combos combining smoothies and refreshers for the ultimate nutrition experience.',
        sortOrder: 5,
      },
      {
        name: 'Shots',
        description: '$5 Shots! Concentrated wellness shots for energy, beauty, and immunity support.',
        sortOrder: 6,
      },
    ];

    const categories = await db.insert(schema.categories).values(
      categoriesData.map(cat => ({
        id: createId(),
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      }))
    ).returning();

    console.log(`✅ Created ${categories.length} categories\n`);

    // Create a map for easy lookup
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat;
      return acc;
    }, {} as Record<string, typeof categories[0]>);

    // ========================================
    // 4. SEED PRODUCTS
    // ========================================
    console.log('🍽️  Seeding products...');

    const productsData = [
      // Sweet Tooth (7 base products, variants added separately)
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Pancakes',
        price: '10.00',
        emoji: '🥞',
        description: '24g Protein | 6g Fiber | 250 Cal',
        protein: 24,
        fiber: 6,
        calories: 250,
        isFeatured: true,
      },
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Bowls',
        price: '10.00',
        emoji: '🥣',
        description: '24g Protein | 2g Sugar | 200 Cal - Available in Berry, Mango, and Chocolate',
        protein: 24,
        sugar: 2,
        calories: 200,
        isFeatured: false,
      },
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Waffles',
        price: '10.00',
        emoji: '🧇',
        description: '24g Protein | 6g Fiber | 250 Cal',
        protein: 24,
        fiber: 6,
        calories: 250,
        isFeatured: false,
      },
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Donuts',
        price: '3.00',
        emoji: '🍩',
        description: '15g Protein | 15g Carbs | 120 Cal',
        protein: 15,
        carbs: 15,
        calories: 120,
        isFeatured: false,
      },
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Coffee 24oz',
        price: '9.00',
        emoji: '☕',
        description: '22g Protein | 2g Sugar | 155 Cal - Available in Mocha and House Blend',
        protein: 22,
        sugar: 2,
        calories: 155,
        isFeatured: false,
      },
      {
        categoryName: 'Sweet Tooth',
        name: 'Protein Oats',
        price: '9.00',
        emoji: '🥣',
        description: '24g Protein | 2g Sugar | 100 Cal - Available in Oatmeal Raisin and Banana Caramel',
        protein: 24,
        sugar: 2,
        calories: 100,
        isFeatured: false,
      },
      // Protein Based Snacks (2 products)
      {
        categoryName: 'Protein Based Snacks',
        name: 'Lemon Bar',
        price: '3.00',
        emoji: '🍋',
        description: 'Protein-based snack',
        protein: 12,
        calories: 120,
        isFeatured: false,
      },
      {
        categoryName: 'Protein Based Snacks',
        name: 'Almond Bar',
        price: '3.00',
        emoji: '🌰',
        description: 'Protein-based snack',
        protein: 12,
        calories: 130,
        isFeatured: false,
      },
      // Smoothies (8 products)
      {
        categoryName: 'Smoothies',
        name: 'Pineapple Cake Smoothie',
        price: '9.00',
        emoji: '🍍',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 300,
        isFeatured: true,
      },
      {
        categoryName: 'Smoothies',
        name: 'Coconut Cream Pie Smoothie',
        price: '9.00',
        emoji: '🥥',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 320,
        isFeatured: false,
      },
      {
        categoryName: 'Smoothies',
        name: 'Strawberry Short Cake Smoothie',
        price: '9.00',
        emoji: '🍓',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 290,
        isFeatured: true,
      },
      {
        categoryName: 'Smoothies',
        name: 'Almond Joy Smoothie',
        price: '9.00',
        emoji: '🍫',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 310,
        isFeatured: false,
      },
      {
        categoryName: 'Smoothies',
        name: 'Banana Split Smoothie',
        price: '9.00',
        emoji: '🍌',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 300,
        isFeatured: false,
      },
      {
        categoryName: 'Smoothies',
        name: 'OREO Smoothie',
        price: '9.00',
        emoji: '🍪',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 330,
        isFeatured: true,
      },
      {
        categoryName: 'Smoothies',
        name: 'Fruity Pebbles Smoothie',
        price: '9.00',
        emoji: '🌈',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 310,
        isFeatured: false,
      },
      {
        categoryName: 'Smoothies',
        name: 'Green n\' Vibin Smoothie',
        price: '9.00',
        emoji: '🥬',
        description: '250-350 Cal | 24g Protein',
        protein: 24,
        calories: 270,
        isFeatured: false,
      },
      // Refreshers 32oz (3 products)
      {
        categoryName: 'Refreshers',
        name: 'Watermelon Rush Refresher',
        price: '10.00',
        emoji: '🍉',
        description: 'Energy, Focus, Hydration | 32oz',
        calories: 30,
        isFeatured: true,
      },
      {
        categoryName: 'Refreshers',
        name: 'Be My Swee-tea Refresher',
        price: '10.00',
        emoji: '🍵',
        description: 'Pomegranate, Raspberry | 32oz',
        calories: 35,
        isFeatured: false,
      },
      {
        categoryName: 'Refreshers',
        name: 'Immuni-tea Refresher',
        price: '10.00',
        emoji: '🍊',
        description: 'Orange, Immunity Essential | 32oz',
        calories: 30,
        isFeatured: false,
      },
      // Refreshers 24oz (3 products)
      {
        categoryName: 'Refreshers',
        name: 'Pink Starburst Refresher',
        price: '8.00',
        emoji: '🌸',
        description: 'Wild Berry, Strawberry | 24oz',
        calories: 25,
        isFeatured: true,
      },
      {
        categoryName: 'Refreshers',
        name: 'Hawaiian Punch Refresher',
        price: '8.00',
        emoji: '🌺',
        description: 'Strawberry, Orange | 24oz',
        calories: 25,
        isFeatured: false,
      },
      {
        categoryName: 'Refreshers',
        name: 'Captain America Refresher',
        price: '8.00',
        emoji: '🦸',
        description: 'Blue Raspberry, Pomegranate | 24oz',
        calories: 25,
        isFeatured: false,
      },
      // Combos (2 products)
      {
        categoryName: 'Combos',
        name: 'Uptown Combo',
        price: '14.00',
        emoji: '🎯',
        description: '24oz Refresher & 24oz Smoothie',
        calories: 325,
        isFeatured: true,
      },
      {
        categoryName: 'Combos',
        name: 'Lit Combo',
        price: '17.00',
        emoji: '🔥',
        description: '32oz Refresher & 24oz Smoothie',
        calories: 335,
        isFeatured: false,
      },
      // Shots (3 products)
      {
        categoryName: 'Shots',
        name: 'Watermelon Preworkout Shot',
        price: '5.00',
        emoji: '💪',
        description: 'Energy boost shot',
        calories: 10,
        isFeatured: false,
      },
      {
        categoryName: 'Shots',
        name: 'Collagen Beauty Booster Shot',
        price: '5.00',
        emoji: '✨',
        description: 'Beauty & skin health',
        calories: 15,
        isFeatured: false,
      },
      {
        categoryName: 'Shots',
        name: 'Immunity Booster Shot',
        price: '5.00',
        emoji: '🛡️',
        description: 'Immune system support',
        calories: 10,
        isFeatured: false,
      },
    ];

    const products = await db.insert(schema.products).values(
      productsData.map(product => {
        const category = categoryMap[product.categoryName];
        return {
          id: createId(),
          categoryId: category.id,
          name: product.name,
          slug: slugify(product.name),
          description: product.description,
          price: product.price,
          imageUrl: product.emoji, // Using emoji as placeholder
          emoji: product.emoji,
          stockQuantity: Math.floor(Math.random() * 100) + 50, // Random stock 50-150
          isActive: true,
          isFeatured: product.isFeatured,
          calories: product.calories,
          protein: product.protein || null,
          carbs: product.carbs || null,
          fiber: product.fiber || null,
          sugar: product.sugar || null,
        };
      })
    ).returning();

    console.log(`✅ Created ${products.length} products\n`);

    // ========================================
    // 5. SEED PRODUCT VARIANTS
    // ========================================
    console.log('🎨 Seeding product variants...');

    const variants = [];

    // Add flavor variants for Protein Bowls
    const proteinBowls = products.find(p => p.name === 'Protein Bowls');
    if (proteinBowls) {
      [
        { name: 'Berry', emoji: '🥣' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Chocolate', emoji: '🍫' }
      ].forEach((flavor, index) => {
        variants.push({
          id: createId(),
          productId: proteinBowls.id,
          name: flavor.name,
          type: 'flavor',
          priceModifier: '0.00',
          stockQuantity: 50,
          isActive: true,
          sortOrder: index + 1,
        });
      });
    }

    // Add flavor variants for Protein Coffee
    const proteinCoffee = products.find(p => p.name === 'Protein Coffee 24oz');
    if (proteinCoffee) {
      [
        { name: 'Mocha' },
        { name: 'House Blend' }
      ].forEach((flavor, index) => {
        variants.push({
          id: createId(),
          productId: proteinCoffee.id,
          name: flavor.name,
          type: 'flavor',
          priceModifier: '0.00',
          stockQuantity: 50,
          isActive: true,
          sortOrder: index + 1,
        });
      });
    }

    // Add flavor variants for Protein Oats
    const proteinOats = products.find(p => p.name === 'Protein Oats');
    if (proteinOats) {
      [
        { name: 'Oatmeal Raisin' },
        { name: 'Banana Caramel' }
      ].forEach((flavor, index) => {
        variants.push({
          id: createId(),
          productId: proteinOats.id,
          name: flavor.name,
          type: 'flavor',
          priceModifier: '0.00',
          stockQuantity: 50,
          isActive: true,
          sortOrder: index + 1,
        });
      });
    }

    // Add size variants for Refreshers (32oz vs 24oz)
    const watermelonRush = products.find(p => p.name === 'Watermelon Rush Refresher');
    if (watermelonRush) {
      variants.push({
        id: createId(),
        productId: watermelonRush.id,
        name: '32oz',
        type: 'size',
        priceModifier: '0.00',
        stockQuantity: 100,
        isActive: true,
        sortOrder: 1,
      });
    }

    const pinkStarburst = products.find(p => p.name === 'Pink Starburst Refresher');
    if (pinkStarburst) {
      variants.push({
        id: createId(),
        productId: pinkStarburst.id,
        name: '24oz',
        type: 'size',
        priceModifier: '0.00',
        stockQuantity: 100,
        isActive: true,
        sortOrder: 1,
      });
    }

    if (variants.length > 0) {
      await db.insert(schema.productVariants).values(variants);
    }

    console.log(`✅ Created ${variants.length} product variants (flavors and sizes)\n`);

    // ========================================
    // 6. SEED REVIEWS
    // ========================================
    console.log('⭐ Seeding reviews...');

    const reviewTemplates = [
      { rating: 5, title: 'Absolutely amazing!', comment: 'This is hands down the best product I\'ve tried. Highly recommend to everyone!' },
      { rating: 5, title: 'Perfect!', comment: 'Exactly what I was looking for. Great taste and perfect nutrition balance.' },
      { rating: 5, title: 'Love it!', comment: 'I order this every week. Never disappointed!' },
      { rating: 5, title: 'Best in town', comment: 'I\'ve tried similar products elsewhere but nothing compares to this.' },
      { rating: 5, title: 'My go-to', comment: 'This has become part of my daily routine. Can\'t imagine my day without it.' },
      { rating: 5, title: 'Delicious!', comment: 'Tastes incredible and makes me feel great. Worth every penny.' },
      { rating: 5, title: 'Highly recommend', comment: 'If you\'re on the fence, just try it. You won\'t regret it!' },
      { rating: 4, title: 'Really good', comment: 'Great product overall. Would give 5 stars but a bit pricey.' },
      { rating: 4, title: 'Very satisfied', comment: 'Enjoyed this a lot. Will definitely order again.' },
      { rating: 4, title: 'Great quality', comment: 'High quality ingredients and great taste. Wish it was a bit larger.' },
    ];

    const reviewsData = [
      {
        product: products.find(p => p.name === 'Protein Pancakes'),
        user: customerUser,
        rating: 5,
        title: 'Best protein pancakes ever!',
        comment: 'These pancakes are absolutely delicious and keep me full for hours. The texture is perfect and they don\'t taste chalky like other protein pancakes.',
      },
      {
        product: products.find(p => p.name === 'Strawberry Short Cake Smoothie'),
        user: customerUser2,
        rating: 5,
        title: 'Tastes like dessert!',
        comment: 'I can\'t believe this smoothie has 24g of protein. It tastes just like strawberry shortcake. My new favorite post-workout treat!',
      },
      {
        product: products.find(p => p.name === 'Watermelon Rush Refresher'),
        user: customerUser,
        rating: 5,
        title: 'Great energy boost',
        comment: 'Love this refresher! Gives me the energy I need without the jitters. Perfect for afternoon pick-me-up.',
      },
      {
        product: products.find(p => p.name === 'Protein Coffee 24oz'),
        user: customerUser2,
        rating: 5,
        title: 'Coffee and protein in one!',
        comment: 'This is my morning staple now. The mocha flavor is incredible and I love that I\'m getting my protein and caffeine together.',
      },
      {
        product: products.find(p => p.name === 'OREO Smoothie'),
        user: customerUser,
        rating: 5,
        title: 'Tastes exactly like OREO cookies!',
        comment: 'This is absolutely incredible. You can actually taste the OREO flavor and it has 24g of protein. My kids love it too!',
      },
      {
        product: products.find(p => p.name === 'Protein Donuts'),
        user: customerUser2,
        rating: 5,
        title: 'Guilt-free treat',
        comment: '15g of protein in a donut? Yes please! Perfect for satisfying my sweet tooth while staying on track.',
      },
      {
        product: products.find(p => p.name === 'Protein Waffles'),
        user: customerUser,
        rating: 5,
        title: 'Sunday brunch essential',
        comment: 'These waffles are fluffy, delicious, and packed with protein. My whole family loves them!',
      },
      {
        product: products.find(p => p.name === 'Fruity Pebbles Smoothie'),
        user: customerUser2,
        rating: 5,
        title: 'Childhood memories in a cup',
        comment: 'This smoothie takes me back to my childhood! The fruity pebbles flavor is spot on and it\'s healthy!',
      },
    ];

    const reviews = [];
    for (const reviewData of reviewsData) {
      if (reviewData.product && reviewData.user) {
        const [review] = await db.insert(schema.reviews).values({
          id: createId(),
          productId: reviewData.product.id,
          userId: reviewData.user.id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          isVerifiedPurchase: true,
          isApproved: true,
          isFeatured: reviewData.rating === 5,
          helpfulCount: Math.floor(Math.random() * 30) + 10,
        }).returning();
        reviews.push(review);
      }
    }

    console.log(`✅ Created ${reviews.length} featured reviews\n`);

    // ========================================
    // 7. SEED PRODUCT RATINGS
    // ========================================
    console.log('📊 Seeding product ratings...');

    // Generate realistic ratings for all products (combined ratings for products with variants)
    const ratingsData = [
      // Sweet Tooth
      { product: products.find(p => p.name === 'Protein Pancakes'), avg: 5, total: 45, five: 39, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Protein Bowls'), avg: 5, total: 115, five: 102, four: 10, three: 3 }, // Combined Berry(38) + Mango(35) + Chocolate(42)
      { product: products.find(p => p.name === 'Protein Waffles'), avg: 5, total: 51, five: 46, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Protein Donuts'), avg: 5, total: 67, five: 61, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Protein Coffee 24oz'), avg: 5, total: 60, five: 54, four: 4, three: 2 }, // Combined Mocha(29) + House Blend(31)
      { product: products.find(p => p.name === 'Protein Oats'), avg: 5, total: 52, five: 46, four: 4, three: 2 }, // Combined Oatmeal Raisin(24) + Banana Caramel(28)

      // Protein Based Snacks
      { product: products.find(p => p.name === 'Lemon Bar'), avg: 5, total: 33, five: 29, four: 3, three: 1 },
      { product: products.find(p => p.name === 'Almond Bar'), avg: 5, total: 41, five: 37, four: 3, three: 1 },

      // Smoothies
      { product: products.find(p => p.name === 'Pineapple Cake Smoothie'), avg: 5, total: 56, five: 51, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Coconut Cream Pie Smoothie'), avg: 5, total: 48, five: 43, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Strawberry Short Cake Smoothie'), avg: 5, total: 72, five: 66, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Almond Joy Smoothie'), avg: 5, total: 61, five: 55, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Banana Split Smoothie'), avg: 5, total: 53, five: 48, four: 4, three: 1 },
      { product: products.find(p => p.name === 'OREO Smoothie'), avg: 5, total: 84, five: 77, four: 6, three: 1 },
      { product: products.find(p => p.name === 'Fruity Pebbles Smoothie'), avg: 5, total: 67, five: 61, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Green n\' Vibin Smoothie'), avg: 5, total: 39, five: 35, four: 3, three: 1 },

      // Refreshers
      { product: products.find(p => p.name === 'Watermelon Rush Refresher'), avg: 5, total: 44, five: 40, four: 3, three: 1 },
      { product: products.find(p => p.name === 'Be My Swee-tea Refresher'), avg: 5, total: 37, five: 33, four: 3, three: 1 },
      { product: products.find(p => p.name === 'Immuni-tea Refresher'), avg: 5, total: 41, five: 37, four: 3, three: 1 },
      { product: products.find(p => p.name === 'Pink Starburst Refresher'), avg: 5, total: 58, five: 53, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Hawaiian Punch Refresher'), avg: 5, total: 49, five: 44, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Captain America Refresher'), avg: 5, total: 52, five: 47, four: 4, three: 1 },

      // Combos
      { product: products.find(p => p.name === 'Uptown Combo'), avg: 5, total: 73, five: 67, four: 5, three: 1 },
      { product: products.find(p => p.name === 'Lit Combo'), avg: 5, total: 68, five: 62, four: 5, three: 1 },

      // Shots
      { product: products.find(p => p.name === 'Watermelon Preworkout Shot'), avg: 5, total: 34, five: 30, four: 3, three: 1 },
      { product: products.find(p => p.name === 'Collagen Beauty Booster Shot'), avg: 5, total: 47, five: 42, four: 4, three: 1 },
      { product: products.find(p => p.name === 'Immunity Booster Shot'), avg: 5, total: 51, five: 46, four: 4, three: 1 },
    ];

    for (const rating of ratingsData) {
      if (rating.product) {
        await db.insert(schema.productRatings).values({
          id: createId(),
          productId: rating.product.id,
          averageRating: rating.avg,
          totalReviews: rating.total,
          fiveStar: rating.five,
          fourStar: rating.four,
          threeStar: rating.three || 0,
          twoStar: 0,
          oneStar: 0,
        });
      }
    }

    console.log(`✅ Created product ratings for ${ratingsData.length} products\n`);

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n✨ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Users: 3 (1 admin, 2 customers)`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length} (base products)`);
    console.log(`   Product Variants: ${variants.length} (flavor and size options)`);
    console.log(`   Reviews: ${reviews.length} (featured reviews)`);
    console.log(`   Product Ratings: ${ratingsData.length} (aggregate ratings)`);
    console.log('\n💡 Product Variants Explained:');
    console.log('   • Protein Bowls: 3 flavors (Berry, Mango, Chocolate)');
    console.log('   • Protein Coffee: 2 flavors (Mocha, House Blend)');
    console.log('   • Protein Oats: 2 flavors (Oatmeal Raisin, Banana Caramel)');
    console.log('   • Refreshers: Size options (24oz vs 32oz)');
    console.log('\n🎯 Next steps:');
    console.log('   1. View data: bun run db:studio');
    console.log('   2. Test API: Start dev server and check /api/products');
    console.log('   3. Update client to fetch from database instead of hardcoded data\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }

  process.exit(0);
}

// Run the seed function
seed();
