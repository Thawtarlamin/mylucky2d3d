const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const LotteryController = require('../controllers/LotteryController');
const WeeklyScraperService = require('./WeeklyScraperService');
const ThreeDScraperService = require('./ThreeDScraperService');

class CronService {
    constructor() {
        this.dataDirectory = path.join(__dirname, '../../data');
        this.dataFilePath = path.join(this.dataDirectory, 'lottery-data.json');
        this.weeklyDataFilePath = path.join(this.dataDirectory, 'weekly-data.json');
        this.threeDDataFilePath = path.join(this.dataDirectory, '3d-data.json');
        this.controller = null;
        this.weeklyScraperService = new WeeklyScraperService();
        this.threeDScraperService = new ThreeDScraperService();
        this.cronJob = null;
    }

    // Initialize data directory
    async initializeDataDirectory() {
        try {
            await fs.mkdir(this.dataDirectory, { recursive: true });
            console.log('✅ Data directory initialized');
        } catch (error) {
            console.error('Error creating data directory:', error.message);
        }
    }

    // Save lottery data to JSON file
    async saveDataToFile(data) {
        try {
            const jsonData = {
                lastUpdated: new Date().toISOString(),
                data: data
            };
            
            await fs.writeFile(
                this.dataFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8'
            );
            
            console.log(`✅ Data saved to ${this.dataFilePath}`);
            return true;
        } catch (error) {
            console.error('❌ Error saving data to file:', error.message);
            return false;
        }
    }

    // Read lottery data from JSON file
    async readDataFromFile() {
        try {
            const fileContent = await fs.readFile(this.dataFilePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet
                return {
                    lastUpdated: null,
                    data: null,
                    message: 'No data available yet. Waiting for first scrape...'
                };
            }
            throw error;
        }
    }

    // Save weekly data to JSON file
    async saveWeeklyDataToFile(data) {
        try {
            const jsonData = {
                lastUpdated: new Date().toISOString(),
                totalRecords: data.length,
                data: data
            };
            
            await fs.writeFile(
                this.weeklyDataFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8'
            );
            
            console.log(`✅ Weekly data saved to ${this.weeklyDataFilePath}`);
            return true;
        } catch (error) {
            console.error('❌ Error saving weekly data to file:', error.message);
            return false;
        }
    }

    // Read weekly data from JSON file
    async readWeeklyDataFromFile() {
        try {
            const fileContent = await fs.readFile(this.weeklyDataFilePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {
                    lastUpdated: null,
                    totalRecords: 0,
                    data: [],
                    message: 'No weekly data available yet.'
                };
            }
            throw error;
        }
    }

    // Save 3D data to JSON file
    async saveThreeDDataToFile(data) {
        try {
            const jsonData = {
                lastUpdated: new Date().toISOString(),
                totalRecords: data.length,
                data: data
            };
            
            await fs.writeFile(
                this.threeDDataFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8'
            );
            
            console.log(`✅ 3D data saved to ${this.threeDDataFilePath}`);
            return true;
        } catch (error) {
            console.error('❌ Error saving 3D data to file:', error.message);
            return false;
        }
    }

    // Read 3D data from JSON file
    async readThreeDDataFromFile() {
        try {
            const fileContent = await fs.readFile(this.threeDDataFilePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {
                    lastUpdated: null,
                    totalRecords: 0,
                    data: [],
                    message: 'No 3D data available yet.'
                };
            }
            throw error;
        }
    }

    // Scrape and save lottery data
    async scrapeAndSave() {
        console.log('\n' + '='.repeat(60));
        console.log(`🕐 Cron job started at: ${new Date().toLocaleString()}`);
        console.log('='.repeat(60));

        try {
            // Scrape main page
            console.log('\n📍 Scraping main page...');
            this.controller = new LotteryController();
            await this.controller.scrapeLottery();
            const data = this.controller.getData();

            if (data) {
                await this.saveDataToFile(data);
                console.log('✅ Main page scraping completed');
            } else {
                console.log('⚠️  No data retrieved from main page');
            }

            // Scrape weekly page
            console.log('\n📍 Scraping weekly page...');
            const weeklyData = await this.weeklyScraperService.scrape();
            
            if (weeklyData && weeklyData.length > 0) {
                await this.saveWeeklyDataToFile(weeklyData);
                console.log(`✅ Weekly page scraping completed (${weeklyData.length} records)`);
            } else {
                console.log('⚠️  No weekly data retrieved');
            }

            // Scrape 3D page
            console.log('\n📍 Scraping 3D page...');
            const threeDData = await this.threeDScraperService.scrapeThreeDData();
            
            if (threeDData && threeDData.length > 0) {
                await this.saveThreeDDataToFile(threeDData);
                console.log(`✅ 3D page scraping completed (${threeDData.length} records)`);
            } else {
                console.log('⚠️  No 3D data retrieved');
            }

        } catch (error) {
            console.error('❌ Error during scraping:', error.message);
        }

        console.log('='.repeat(60) + '\n');
    }

    // Start cron job (every minute)
    startCronJob() {
        // Run every minute: '* * * * *'
        // Format: minute hour day month weekday
        this.cronJob = cron.schedule('* * * * *', async () => {
            await this.scrapeAndSave();
        });

        console.log('🚀 Cron job started - Running every minute');
        console.log('⏰ Schedule: Every minute');
        
        // Run immediately on start
        this.scrapeAndSave();
    }

    // Stop cron job
    stopCronJob() {
        if (this.cronJob) {
            this.cronJob.stop();
            console.log('🛑 Cron job stopped');
        }
    }

    // Check if data file exists
    async dataFileExists() {
        try {
            await fs.access(this.dataFilePath);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = CronService;
