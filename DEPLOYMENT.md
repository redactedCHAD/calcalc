# Deployment Guide for ACalc

This guide will walk you through deploying your ACalc food tracking app to either Vercel or Netlify.

## Prerequisites

- A GitHub account
- Your ACalc project committed to Git (which you've already done)

## Option 1: Deploy to Vercel (Recommended for Next.js)

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in.
2. Click the "+" icon in the top right corner and select "New repository".
3. Name your repository (e.g., "acalc").
4. Keep it public or private based on your preference.
5. Click "Create repository".

### Step 2: Push Your Code to GitHub

Run these commands in your project directory:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/acalc.git

# Push your code to GitHub
git push -u origin master
```

### Step 3: Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign up or sign in.
2. Click "Add New..." and select "Project".
3. Connect your GitHub account if you haven't already.
4. Select the repository you just created.
5. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Install Command: npm install
   - Output Directory: .next

6. Environment Variables:
   Add these environment variables from your `.env` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_NUTRITIONIX_APP_ID`
   - `NEXT_PUBLIC_NUTRITIONIX_APP_KEY`
   - `NEXT_PUBLIC_APP_URL` (set this to your Vercel deployment URL, like `https://acalc.vercel.app`)

7. Click "Deploy" and wait for your project to build and deploy.

### Step 4: Verify Your Deployment

1. Once the deployment is complete, Vercel will provide you with a URL.
2. Visit the URL to ensure your app is functioning correctly.
3. Test the authentication, food journal, and barcode scanning features.

## Option 2: Deploy to Netlify

### Step 1: Create a GitHub Repository (same as above)

Follow the GitHub repository creation steps from Option 1.

### Step 2: Push Your Code to GitHub (same as above)

Follow the GitHub push steps from Option 1.

### Step 3: Deploy on Netlify

1. Go to [Netlify](https://netlify.com) and sign up or sign in.
2. Click "New site from Git".
3. Select "GitHub" as your Git provider.
4. Authorize Netlify to access your GitHub repositories.
5. Select the repository you just created.
6. Configure your build settings:
   - Branch to deploy: `master` (or `main`)
   - Build command: `npm run build`
   - Publish directory: `.next`

7. Environment Variables:
   Add the same environment variables as listed in the Vercel deployment.

8. Click "Deploy site" and wait for your project to build and deploy.

### Step 4: Verify Your Deployment

1. Once the deployment is complete, Netlify will provide you with a URL.
2. Visit the URL to ensure your app is functioning correctly.
3. Test the authentication, food journal, and barcode scanning features.

## Troubleshooting

### Build Errors

If you encounter build errors during deployment:

1. Check the build logs provided by Vercel or Netlify.
2. Make sure all dependencies are properly listed in your `package.json`.
3. Ensure your Next.js version is compatible with your code.
4. Try rebuilding with a clean cache.

### Environment Variables

If your app deploys but doesn't work correctly:

1. Verify that all environment variables are correctly set in the Vercel or Netlify dashboard.
2. Check that your Supabase and NutritionIx credentials are valid.
3. Ensure the `NEXT_PUBLIC_APP_URL` is set to your deployment URL.

### CORS Issues

If you experience CORS (Cross-Origin Resource Sharing) issues:

1. Go to your Supabase dashboard.
2. Navigate to Settings > API.
3. Add your deployed app URL to the list of allowed origins.

## Continuous Deployment

Both Vercel and Netlify support continuous deployment. Any changes pushed to your GitHub repository will automatically trigger a new deployment.

## Custom Domain

To use a custom domain:

1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, etc.).
2. In Vercel or Netlify, go to your project settings and find the "Domains" section.
3. Add your custom domain and follow the instructions to configure DNS settings.

## Success!

Your ACalc food tracking app should now be live and accessible on the web. Congratulations! 