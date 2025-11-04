const LotteryServer = require('./src/LotteryServer');

// Create and start server
const server = new LotteryServer(3000);
server.start();
