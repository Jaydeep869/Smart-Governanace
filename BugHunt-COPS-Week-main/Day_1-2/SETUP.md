# Local Setup Instructions

## Day 1-2:

### Prerequisites

- Node.js and npm(if not installed, download from https://nodejs.org/en/download)
- Git installed and Github account
- A code editor (VS Code recommended)

### Getting started

#### 1. Download and Extract

1. Download the ZIP file from the official repository
2. Extract the contents to your desired location
3. Open the extracted folder in your code editor

#### 2. Create Your Private Repository

```bash
git init
git remote add origin <your-private-repo-url>
git branch -M main
```

#### 3. Install dependencies

```bash
cd "Day_1-2"
npm install
```

#### 4. Start the server and application

```bash
npm run dev
# The server will run on http://localhost:3000
```

- Open Day_1-2/public/index.html in your web browser
  Or use a local development server (Live Server extension in VS Code may come handy)
