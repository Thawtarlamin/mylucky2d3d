# My Lucky 2D 3D API Server

Myanmar lottery scraper with automated cron job and REST API endpoints.

## 🚀 Quick Start

### Start the server with cron job:
```bash
npm run server
```

The server will:
- ✅ Start Express server on port 3000
- ✅ Run scraper every minute automatically
- ✅ Save data to `data/lottery-data.json`
- ✅ Serve data through API endpoints

## 📡 API Endpoints

### 1. Get All Data
```
GET http://localhost:3000/api/lottery
```
Returns complete lottery data with metadata

### 2. Get Lottery Data Only
```
GET http://localhost:3000/api/lottery/data
```
Returns only lottery data without metadata

### 3. Get AM Draw Data
```
GET http://localhost:3000/api/lottery/am
```
Returns 12:01 AM draw data

### 4. Get PM Draw Data
```
GET http://localhost:3000/api/lottery/pm
```
Returns 16:30 PM draw data

### 5. Get Additional Data (Modern/Internet)
```
GET http://localhost:3000/api/lottery/additional
```
Returns 9:30 AM and 2:00 PM Modern/Internet data

### 6. Get Live Number
```
GET http://localhost:3000/api/lottery/live
```
Returns current live number with basic info

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "lastUpdated": "2025-11-04T10:30:00.000Z",
  "data": {
    "title": "2D",
    "date": "05/Nov/2025 AM",
    "liveNumber": "--",
    "updatedTime": "",
    "am": {
      "time": "12:01 AM",
      "result": "--",
      "set": "----",
      "value": "----"
    },
    "pm": {
      "time": "16:30 PM",
      "result": "--",
      "set": "----",
      "value": "----"
    },
    "additional": {
      "am": {
        "time": "9:30 AM",
        "Modern": "--",
        "Internet": "--"
      },
      "pm": {
        "time": "2:00 PM",
        "Modern": "--",
        "Internet": "--"
      }
    }
  }
}
```

## ⏰ Cron Schedule

- **Frequency**: Every minute
- **Pattern**: `* * * * *`
- **Action**: Scrapes website and updates JSON file

## 📁 Project Structure

```
mylucky2d3d/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── models/
│   │   └── LotteryData.js
│   ├── views/
│   │   └── ConsoleView.js
│   ├── controllers/
│   │   └── LotteryController.js
│   ├── services/
│   │   ├── ScraperService.js
│   │   └── CronService.js        # NEW: Cron job service
│   └── LotteryServer.js           # NEW: Express server
├── data/
│   └── lottery-data.json          # Auto-generated data file
├── server.js                      # Server entry point
├── index.js                       # CLI entry point
└── package.json
```

## 🎯 NPM Scripts

```bash
# Start API server with cron job
npm run server

# Run scraper once (CLI mode)
npm start

# Development mode (same as server)
npm run dev
```

## 🔧 Configuration

Edit `src/config/config.js` to modify:
- Website URL
- Timeouts
- Selectors
- Puppeteer settings

## 📝 Features

- ✅ Automated scraping every minute
- ✅ RESTful API endpoints
- ✅ JSON file storage
- ✅ CORS enabled
- ✅ Error handling
- ✅ Clean MVC architecture
- ✅ Easy to deploy

## 🌐 Test API

### Using Browser:
```
http://localhost:3000/api/lottery
```

### Using cURL:
```bash
curl http://localhost:3000/api/lottery
```

### Using JavaScript:
```javascript
fetch('http://localhost:3000/api/lottery')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🛑 Stop Server

Press `Ctrl + C` to stop the server and cron job.

## 📦 Dependencies

- express - Web server
- puppeteer - Web scraping
- node-cron - Scheduled tasks
- fs/promises - File operations

---

Made with ❤️ for Myanmar Lottery Players
