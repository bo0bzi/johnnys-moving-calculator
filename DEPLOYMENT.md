# Deployment Guide for Johnny's Moving Calculator

This guide provides instructions for deploying the calculator to various hosting platforms.

## Option 1: GitHub Pages (Free)

1. Create a GitHub account if you don't have one
2. Create a new repository named `johnnys-moving-calculator`
3. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-username]/johnnys-moving-calculator.git
   git push -u origin main
   ```
4. Install the gh-pages package:
   ```bash
   npm install gh-pages --save-dev
   ```
5. Update the `homepage` field in `package.json` with your GitHub username
6. Deploy the app:
   ```bash
   npm run deploy
   ```
7. Your app will be available at: `https://[your-username].github.io/johnnys-moving-calculator`

## Option 2: Netlify (Free tier available)

1. Create a Netlify account
2. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```
3. Build your project:
   ```bash
   npm run build
   ```
4. Deploy:
   ```bash
   netlify deploy
   ```
5. Follow the prompts to complete deployment

## Option 3: Vercel (Free tier available)

1. Create a Vercel account
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Follow the prompts to complete deployment

## Option 4: Firebase Hosting (Free tier available)

1. Create a Firebase account
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Login to Firebase:
   ```bash
   firebase login
   ```
4. Initialize Firebase:
   ```bash
   firebase init
   ```
5. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Recommended Option

For a small business calculator like this, we recommend using **GitHub Pages** because:
- It's completely free
- Easy to set up
- Reliable and fast
- Good for static websites
- No server maintenance required

## After Deployment

1. Update the README.md with the correct URL
2. Test the app thoroughly on different devices
3. Set up a custom domain (optional but recommended for business use)

## Custom Domain Setup (Optional)

1. Purchase a domain from a provider like GoDaddy, Namecheap, or Google Domains
2. Follow your hosting provider's instructions to connect your domain
3. Update the `homepage` field in `package.json` with your custom domain
4. Redeploy the application

## Maintenance

- Regularly update dependencies
- Monitor the application's performance
- Keep backups of your code
- Test after any updates

## Support

If you need help with deployment, please contact:
[Your contact information here] 