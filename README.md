# Aryan Gupta | Portfolio

A personal portfolio site built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.   

## Features

- **Hero** – Name, title, tagline, and quick stats
- **About** – Short bio and education
- **Experience** – Internships at Ixigo, Paytm, DRDO
- **Projects** – Split App, Money Craft, Resume Analyzer with GitHub links
- **Skills** – Languages, web tech, tools, fundamentals
- **Contact** – GitHub, LinkedIn, LeetCode, Email

## Run locally

```bash
cd aryan-portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Edit your data

Update `src/data.ts` to change profile info, experience, projects, skills, and links. No need to touch components unless you want to change layout or styling.

## Resume download

For **Download Resume** to work, do one of the following:

1. **Use a local PDF:** Copy your resume file as `Aryan_Resume.pdf` into the **`public`** folder (same level as `index.html`). The app will then offer to download it when you click Download Resume.
2. **Use a URL:** In `src/data.ts`, set `resumePdfUrl` to a full URL (e.g. a Google Drive or Dropbox direct link to your PDF). The link will open in a new tab.

## Deploy

You can deploy the `dist` folder to Vercel, Netlify, or any static host. Example for Vercel:

```bash
npm run build
vercel --prod
```
