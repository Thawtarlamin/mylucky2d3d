const LotteryData = require('../models/LotteryData');
const ScraperService = require('../services/ScraperService');
const ConsoleView = require('../views/ConsoleView');

// Lottery Controller - Handles business logic
class LotteryController {
    constructor() {
        this.scraperService = new ScraperService();
        this.lotteryData = null;
    }

    // Scrape and process lottery data
    async scrapeLottery() {
        try {
            ConsoleView.displayLoading('Starting lottery data scraping');

            // Scrape data using service
            const rawData = await this.scraperService.scrape();

            // Create model instance
            this.lotteryData = new LotteryData();

            // Populate model with scraped data
            this.lotteryData.setTitle(rawData.title);
            this.lotteryData.setDate(rawData.date);
            this.lotteryData.setLiveNumber(rawData.liveNumber);
            this.lotteryData.setUpdatedTime(rawData.updatedTime);
            
            this.lotteryData.setAmData(
                rawData.am.result,
                rawData.am.set,
                rawData.am.value
            );
            
            this.lotteryData.setPmData(
                rawData.pm.result,
                rawData.pm.set,
                rawData.pm.value
            );
            
            this.lotteryData.setAdditionalAmData(
                rawData.additional.am.Modern,
                rawData.additional.am.Internet
            );
            
            this.lotteryData.setAdditionalPmData(
                rawData.additional.pm.Modern,
                rawData.additional.pm.Internet
            );

            // Validate data
            if (!this.lotteryData.isValid()) {
                throw new Error('Invalid lottery data retrieved');
            }

            ConsoleView.displaySuccess('Scraping completed successfully');
            return this.lotteryData;

        } catch (error) {
            ConsoleView.displayError(error);
            throw error;
        }
    }

    // Display lottery data in console
    displayData() {
        if (this.lotteryData) {
            ConsoleView.display(this.lotteryData);
        } else {
            ConsoleView.displayError(new Error('No data available to display'));
        }
    }

    // Display lottery data as JSON
    displayJSON() {
        if (this.lotteryData) {
            ConsoleView.displayJSON(this.lotteryData);
        } else {
            ConsoleView.displayError(new Error('No data available to display'));
        }
    }

    // Get lottery data
    getData() {
        return this.lotteryData ? this.lotteryData.toJSON() : null;
    }

    // Main execution method
    async execute() {
        try {
            await this.scrapeLottery();
            this.displayData();
            this.displayJSON();
            return this.getData();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LotteryController;
