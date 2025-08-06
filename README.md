# MemeRater

**MemeRater** is a client-side AI-powered meme judging application built using modern JavaScript tools. It analyzes memes using Optical Character Recognition (OCR) and machine learning to extract text and predict a meme rating all directly in the browser with no backend.

This project demonstrates how TensorFlow.js and Tesseract.js can be used together to build a lightweight, intelligent meme evaluator. The user interface is styled using Tailwind CSS and bundled with Vite for ultra-fast development.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Future Plans](#future-plans)
- [License](#license)

---

## Project Purpose

MemeRater was created to experiment with the application of AI to humour analysis. Traditional meme scoring relies on user voting or manual rules, but this project aims to build a data-driven meme evaluator by extracting both visual and textual features from memes.

By combining OCR and deep learning inference directly in the browser, MemeRater allows users to get an automatic "meme rating" score for any uploaded meme image. It serves as a proof of concept for intelligent meme analytics.

---

## Features

- Upload static image memes (PNG, JPG)
- OCR-powered text extraction using Tesseract.js
- Deep learning model prediction using TensorFlow.js
- Real-time display of meme rating
- Completely client-side  no server or cloud functions required
- Fast development with Vite and hot module reload
- Fully responsive UI with Tailwind CSS

---

## Technologies Used

- **Vite** - Frontend bundler and dev server
- **TypeScript** - Type-safe JavaScript for maintainability
- **Tailwind CSS** - Utility-first CSS framework
- **Tesseract.js** - OCR engine for text extraction
- **TensorFlow.js** - In-browser ML inference engine
- **PostCSS** - CSS transformation pipeline
- **Node.js** - JavaScript runtime for development

---

## Installation

You need to have **Node.js v16 or later** installed on your system.

Clone the repository and install dependencies:

```bash
git clone https://github.com/YuvaanshKapila/MemeRater.git
cd MemeRater
npm install
How to Run
To start the development server:

bash
Copy
Edit
npm run dev
This will launch Vite on a local server, usually at:

arduino
Copy
Edit
http://localhost:5173
You can open this address in your browser to use the app.

To build for production:

bash
Copy
Edit
npm run build
This will generate a dist/ directory with optimized assets.

Usage Guide
Open the app in your browser (either locally or via deployment).

Upload a meme image in PNG or JPEG format.

Tesseract.js will run OCR to extract any visible text from the image.

The extracted text and image features are passed to a TensorFlow.js model.

The model predicts a rating score, which is shown on-screen.

The current model can be swapped or retrained based on your preferred dataset and humour scoring logic.

Project Structure
text
Copy
Edit
MemeRater/
├── index.html                 # Root HTML
├── package.json               # Project metadata and scripts
├── postcss.config.js          # PostCSS plugins
├── tailwind.config.ts         # Tailwind theme config
├── tsconfig.json              # Global TypeScript config
├── tsconfig.app.json          # App-specific TypeScript rules
├── tsconfig.node.json         # Node-specific rules
├── vite.config.ts             # Vite dev/build configuration
└── src/                       # Source code
    ├── components/            # UI components
    ├── use-toast.ts           # Toast hook logic
    └── ...                    # App logic and ML pipeline
Future Plans
Add support for animated GIF memes

Integrate improved text preprocessing for OCR output

Expand the machine learning model for better accuracy

Introduce leaderboard features for top memes

Add meme classification (e.g. political, wholesome, ironic)

Deploy the app to Vercel or Netlify for public access

License
This project is licensed under the MIT License. You are free to use, modify, and distribute it under the terms of that license.

yaml
Copy
Edit

---

You can copy and paste this entire block into your `README.md` on GitHub.

Let me know if you want to:
- Add a badge section (e.g., build passing, license, Node version)
- Embed a screenshot or preview GIF
- Add deployment instructions for Vercel or Netlify
- Add contribution guidelines

I can include those as well.
