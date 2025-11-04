# Quick Start Guide

## Installation
```bash
git clone https://github.com/yourusername/mylucky2d3d.git
cd mylucky2d3d
npm install
npm run server
```

## API Endpoints

### Current 2D Lottery
- `GET /api/lottery` - All current data
- `GET /api/lottery/am` - 12:01 AM results
- `GET /api/lottery/pm` - 16:30 PM results
- `GET /api/lottery/live` - Live number
- `GET /api/lottery/additional` - Modern/Internet

### 2D Historical
- `GET /api/lottery/weekly` - All weekly data
- `GET /api/lottery/weekly/:date` - Specific date

### 3D Lottery
- `GET /api/lottery/3d` - All 3D data
- `GET /api/lottery/3d/:date` - Specific date

## Example Usage

### JavaScript
```javascript
fetch('http://localhost:3000/api/lottery')
  .then(res => res.json())
  .then(data => console.log(data));
```

### cURL
```bash
curl http://localhost:3000/api/lottery/3d
```

## Features
✅ Auto-scraping every minute
✅ 11 API endpoints
✅ JSON file storage
✅ MVC architecture
✅ CORS enabled

## Tech Stack
- Node.js
- Puppeteer
- Express.js
- node-cron
