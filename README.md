# ACalc - Food Tracking App

A modern food tracking application with calorie calculator and barcode scanning built with Next.js, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Food Journal**: Track your meals and nutrition throughout the day
- **Barcode Scanner**: Quickly add foods by scanning barcodes
- **Dashboard**: View your calorie intake, macros, and food logging streak
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **API**: NutritionIx API for food data
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/acalc.git
cd acalc
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_NUTRITIONIX_APP_ID=your_nutritionix_app_id
NEXT_PUBLIC_NUTRITIONIX_APP_KEY=your_nutritionix_app_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository

2. Sign up or log in to [Vercel](https://vercel.com)

3. Import your GitHub repository in Vercel

4. Configure your environment variables in the Vercel dashboard:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_NUTRITIONIX_APP_ID
   - NEXT_PUBLIC_NUTRITIONIX_APP_KEY
   - NEXT_PUBLIC_APP_URL (your production URL)

5. Deploy! Vercel will automatically build and deploy your app

### Deploy to Netlify

1. Push your code to a GitHub repository

2. Sign up or log in to [Netlify](https://netlify.com)

3. Click "New site from Git" and select your repository

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. Configure your environment variables in the Netlify dashboard

6. Deploy! Netlify will build and deploy your app

## License

This project is licensed under the ISC License.

## Credits

- Design inspiration from modern UI frameworks
- Icons from [Lucide React](https://lucide.dev)
- Database and authentication by [Supabase](https://supabase.io)
- Food data API by [NutritionIx](https://www.nutritionix.com)

## UI Components

ACalc uses a custom UI library inspired by Shadcn UI and enhanced with Framer Motion animations:

- **AnimatedCard**: Card components with hover and click animations
- **Button**: Customizable button with variants (primary, secondary, outline, etc.)
- **Toast**: Toast notification system for user feedback
- **Motion Layouts**: Page transitions and staggered animations

## Database Schema

### Profiles Table

Stores user profile information including nutrition goals:

| Column            | Type      | Description                  |
|-------------------|-----------|------------------------------|
| id                | UUID      | Primary key, references auth.users |
| username          | TEXT      | User's display name          |
| email             | TEXT      | User's email address         |
| daily_calorie_goal| INTEGER   | Target daily calories        |
| daily_protein_goal| INTEGER   | Target daily protein (g)     |
| daily_carbs_goal  | INTEGER   | Target daily carbs (g)       |
| daily_fat_goal    | INTEGER   | Target daily fat (g)         |
| created_at        | TIMESTAMP | Record creation timestamp    |
| updated_at        | TIMESTAMP | Record update timestamp      |

### Food Entries Table

Stores individual food entries in the journal:

| Column      | Type      | Description                   |
|-------------|-----------|-------------------------------|
| id          | UUID      | Primary key                   |
| user_id     | UUID      | References profiles.id        |
| food_name   | TEXT      | Name of the food              |
| calories    | INTEGER   | Calories (kcal)               |
| protein     | DECIMAL   | Protein content (g)           |
| carbs       | DECIMAL   | Carbohydrate content (g)      |
| fat         | DECIMAL   | Fat content (g)               |
| serving_size| TEXT      | Portion size (e.g., "1 cup")  |
| meal_type   | TEXT      | Meal category (breakfast, lunch, dinner, snack) |
| date        | DATE      | Date of consumption           |
| created_at  | TIMESTAMP | Record creation timestamp     |
| updated_at  | TIMESTAMP | Record update timestamp       |

## NutritionIx API Integration

The app uses the NutritionIx API for barcode scanning functionality. To enable this feature:

1. Sign up for a free NutritionIx developer account at [https://developer.nutritionix.com/signup](https://developer.nutritionix.com/signup)
2. Obtain your App ID and App Key
3. Add these credentials to your `.env.local` file

While testing, the app uses mock data for barcode scanning if no NutritionIx credentials are provided. 