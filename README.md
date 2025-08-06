# MemeRater
MemeRater is a meme rating application built with JavaScript, TypeScript, and HTML. It uses Tesseract.js for OCR and TensorFlow.js for machine learning to predict meme ratings directly in the browser. No server or backend is required.

## Table of Contents
Project Purpose

Features

Technologies Used

Installation

How to Run

Future Plans

License

## Project Purpose
This project analyzes memes using AI by extracting both visual and textual content. Instead of relying on user votes or hardcoded rules, MemeRater uses OCR and machine learning to automatically rate memes directly in the browser.

## Features
Upload PNG or JPG meme images

Text extraction using Tesseract.js (OCR)

Meme rating prediction using TensorFlow.js

Real-time score display

Entirely client-side (no backend)

Fast development with Vite and hot reload

Responsive UI with Tailwind CSS

## Technologies Used
Vite

TypeScript

Tailwind CSS

Tesseract.js

TensorFlow.js

PostCSS

Node.js

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
```
## Future Plans
Add support for animated GIF memes

License
This project is licensed under the MIT License.
