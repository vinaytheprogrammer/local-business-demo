# Deployment Guide: Cloudflare Pages & GitHub Pages

This project is a 100% static, ultra-fast, mobile-optimized website built with semantic HTML5, modern CSS, and lightweight JavaScript. It has zero heavy dependencies and deploys for free in seconds.

---

## Option 1: Deploy to Cloudflare Pages (Recommended - Fastest Global CDN)

Cloudflare Pages provides free global CDN hosting, automatic SSL certificates, HTTP/3, and unlimited bandwidth.

### Method A: 1-Click CLI Deployment (Instant)

Run this single command inside the `local-business-demo` directory:

```bash
cd local-business-demo
npx wrangler pages deploy . --project-name=local-business-demo
```

1. If you aren't logged in, it will prompt you in your browser to authorize your free Cloudflare account.
2. It uploads the directory in ~5 seconds and gives you a live production URL:
   `https://local-business-demo.pages.dev`

### Method B: Git Integration via Cloudflare Dashboard

1. Push your repository to GitHub.
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Compute (Workers) & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
3. Select your repository.
4. Set:
   - **Framework preset:** `None`
   - **Build command:** *(Leave empty)*
   - **Build output directory:** `local-business-demo` (or `.` if repo root)
5. Click **Save and Deploy**. Every subsequent `git push` automatically rebuilds and deploys!

---

## Option 2: Deploy to GitHub Pages

### Method A: Direct Branch Deployment

1. If you want this demo accessible on GitHub Pages under your repository:
   - Go to your GitHub repository $\rightarrow$ **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment** $\rightarrow$ **Source**, choose **Deploy from a branch**.
   - Select branch `main` and folder `/` (or `/docs`).
2. Alternatively, deploy the `local-business-demo` folder to a standalone `gh-pages` branch:

```bash
# From repository root:
git subtree push --prefix local-business-demo origin gh-pages
```

Your demo will be live at:
`https://<your-github-username>.github.io/<repo-name>/`

---

## Local Testing

To test and browse all pages locally before deploying:

```bash
cd local-business-demo
npx -y serve . -p 3000
```

Open `http://localhost:3000` in your web browser.
