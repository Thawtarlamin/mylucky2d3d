const LotteryController = require('./src/controllers/LotteryController');

// Main entry point
async function main() {
    const controller = new LotteryController();
    
    try {
        const data = await controller.execute();
        process.exit(0);
    } catch (error) {
        console.error('Failed to scrape lottery data:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

// Export for use as module
module.exports = { LotteryController };
