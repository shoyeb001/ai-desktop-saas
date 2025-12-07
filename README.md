# AI Social Desktop (Electron + React + ShadCN + LowDB)

A cross-platform desktop application built with **Electron**, **React (Vite + TypeScript)**, **ShadCN UI**, **LowDB**, and **Google Gemini**.  
This app includes:

- AI Article Writer
- Humanizer (2-step LLM pipeline)
- History sidebar with real-time updates
- Local database for settings + history
- Fully offline desktop application behavior (only LLM calls require internet)

---

## How to Run Locally

- Clone the repository
- `npm install`
- `cd frontend`
- `npm install`
- `cd ..`
- `npm run dev`

## How to Build for Production

- `npm run build:frontend`
- `npm run dist`
- You will get the windows and mac installer in release folder
