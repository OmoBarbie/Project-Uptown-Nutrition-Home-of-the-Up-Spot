# Database Seed Data

This document describes the initial data seeded into the database when running `bun run db:seed`.

## Overview

The seed script extracts products from the current client application and populates the database with:
- Categories
- Products with nutritional information
- Sample users (admin and customers)
- Product reviews and ratings
- Product variants (sizes and flavors)

## Seeded Data

### Users (3 total)

#### Admin User
- **Email**: admin@uptownnutrition.com
- **Password**: admin123 (hashed)
- **Role**: admin
- **Email Verified**: Yes

#### Customer Users
1. **John Doe**
   - Email: customer@example.com
   - Password: customer123 (hashed)
   - Phone: 555-0123

2. **Sarah Johnson**
   - Email: sarah@example.com
   - Password: customer123 (hashed)

### Categories (4 total)

1. **Sweet Tooth**
   - Description: Delicious high-protein treats that satisfy your cravings while fueling your body with quality nutrition.

2. **Smoothies**
   - Description: Protein-packed smoothies in 30+ delicious flavors. Perfect for post-workout or a healthy meal replacement.

3. **Refreshers**
   - Description: Energizing refreshers for focus, hydration and energy. Available in 24oz and 32oz sizes.

4. **Protein Snacks**
   - Description: Protein-based snacks perfect for on-the-go nutrition. Delicious treats that support your fitness goals.

### Products (8 total)

#### Sweet Tooth Category

1. **Protein Pancakes** ✨ (Featured)
   - Price: $10.00
   - Emoji: 🥞
   - Nutrition: 24g Protein, 6g Fiber, 250 Cal
   - Description: Fluffy protein-packed pancakes made with whole grain flour and whey protein.

2. **Protein Bowls**
   - Price: $10.00
   - Emoji: 🥣
   - Nutrition: 24g Protein, 2g Sugar, 280 Cal
   - Description: Nutritious protein bowls available in Berry, Mango, and Chocolate flavors.
   - Variants: Berry, Mango, Chocolate (flavor)

#### Smoothies Category

3. **Strawberry Short Cake** ✨ (Featured)
   - Price: $9.00
   - Emoji: 🍓
   - Nutrition: 24g Protein, 12g Sugar, 300 Cal
   - Description: A creamy strawberry smoothie with hints of vanilla cake.

4. **Almond Joy**
   - Price: $9.00
   - Emoji: 🥥
   - Nutrition: 24g Protein, 12g Carbs, 290 Cal
   - Description: Coconut and almond blended into a delicious high-protein smoothie.

#### Refreshers Category

5. **Watermelon Rush** ✨ (Featured)
   - Price: $10.00
   - Emoji: 🍉
   - Nutrition: 25 Cal
   - Description: A refreshing 32oz watermelon energy drink.
   - Variants: 32oz (size)

6. **Pink Starburst**
   - Price: $8.00
   - Emoji: 🌸
   - Nutrition: 20 Cal
   - Description: Wild berry flavored 24oz refresher for focus and energy.
   - Variants: 24oz (size)

#### Protein Snacks Category

7. **Protein Donuts**
   - Price: $3.00
   - Emoji: 🍩
   - Nutrition: 15g Protein, 15g Carbs, 120 Cal
   - Description: Guilt-free protein donuts with only 120 calories.

8. **Protein Coffee 24oz** ✨ (Featured)
   - Price: $9.00
   - Emoji: ☕
   - Nutrition: 22g Protein, 2g Sugar, 180 Cal
   - Description: High-protein iced coffee available in Mocha or House Blend.

### Product Variants

- **Protein Bowls**: Berry, Mango, Chocolate (flavors)
- **Watermelon Rush**: 32oz (size)
- **Pink Starburst**: 24oz (size)

### Reviews (4 total)

1. **Protein Pancakes** - 5 stars
   - "Best protein pancakes ever!"
   - By John Doe

2. **Strawberry Short Cake** - 5 stars
   - "Tastes like dessert!"
   - By Sarah Johnson

3. **Watermelon Rush** - 4 stars
   - "Great energy boost"
   - By John Doe

4. **Protein Coffee 24oz** - 5 stars
   - "Coffee and protein in one!"
   - By Sarah Johnson

### Product Ratings

All featured products have aggregate ratings:
- Protein Pancakes: 5.0 avg (15 reviews)
- Strawberry Short Cake: 5.0 avg (22 reviews)
- Watermelon Rush: 4.0 avg (8 reviews)
- Protein Coffee: 5.0 avg (18 reviews)

## Stock Levels

All products are seeded with random stock between 50-150 units.

## Running the Seed

```bash
# From root
bun run db:seed

# Or from database package
cd database
bun run db:seed
```

## Notes

- Passwords are hashed with a simple prefix for demo purposes
- In production, use bcrypt or argon2 for password hashing
- Featured products (`isFeatured: true`) are highlighted on the homepage
- All products are active by default (`isActive: true`)
- Stock quantities are randomized for demonstration

## Resetting the Database

The seed script automatically clears existing data before seeding. To start fresh:

```bash
bun run db:seed
```

This will:
1. Delete all existing data (in proper order to respect foreign keys)
2. Insert fresh seed data
3. Display a summary of what was created
