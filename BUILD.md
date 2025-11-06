# Build & Deployment Guide

## 📦 Build System Overview

This project includes multiple build and deployment options:

### 1. Standard Build
Creates a production-ready `/build` directory with optimized files.

```bash
npm run build
```

This will:
- Create a `/build` directory
- Copy all necessary files (public, views, server.js)
- Install production dependencies only
- Generate production README

### 2. Development Mode

```bash
npm run dev
```

Runs the app with nodemon for auto-restart on file changes.

### 3. Production Mode

```bash
npm run production
```

Runs the app in production mode with NODE_ENV=production.

### 4. Docker Build

Build Docker image:
```bash
npm run build:docker
```

Run Docker container:
```bash
npm run run:docker
```

Or manually:
```bash
docker build -t video-chat-app .
docker run -p 3030:3030 video-chat-app
```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=3030
NODE_ENV=production
PEER_HOST=localhost
PEER_PORT=3030
CORS_ORIGIN=*
```

## 📁 Build Output Structure

After running `npm run build`, the `/build` directory contains:

```
build/
├── public/          # Static assets
├── views/           # EJS templates
├── server.js        # Server entry point
├── package.json     # Dependencies
└── README.md        # Production guide
```

## 🚀 Deployment Options

### Option 1: Traditional Server
1. Run `npm run build`
2. Copy `/build` directory to your server
3. Run `npm install` in build directory
4. Run `npm start`

### Option 2: Docker Container
1. Run `npm run build:docker`
2. Deploy container to any cloud platform (AWS, GCP, Azure, etc.)

### Option 3: Direct Deploy
1. Upload all files to server
2. Run `npm install`
3. Run `npm start` or `npm run production`

## 🐛 Bug Fixes Applied

- Fixed chat message display bug in `room-script.js` where sender name was not properly identified
- Added proper variable scoping to prevent userName collision

## 📋 Requirements

- Node.js 12 or higher
- npm 6 or higher
- Modern browser with WebRTC support
- (Optional) Docker for containerization

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables for sensitive data
- Configure CORS properly for production
- Enable HTTPS in production environments

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server in normal mode |
| `npm run dev` | Start with auto-reload (development) |
| `npm run build` | Create production build |
| `npm run production` | Start in production mode |
| `npm run build:docker` | Build Docker image |
| `npm run run:docker` | Run Docker container |

## ✅ Build Verification

After building, verify with:

```bash
cd build
npm install
npm start
```

Then visit `http://localhost:3030` to test the application.
