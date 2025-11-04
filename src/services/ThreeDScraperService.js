const puppeteer = require('puppeteer');
const config = require('../config/config');

class ThreeDScraperService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        console.log('Initializing browser for 3D data...');
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
    }

    async scrapeThreeDData() {
        try {
            await this.initialize();
            
            console.log(`Navigating to ${config.scraper.threeDPage.url}...`);
            await this.page.goto(config.scraper.threeDPage.url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            const threeDData = await this.extractThreeDData();
            
            await this.close();
            
            return threeDData;
        } catch (error) {
            console.error('Error scraping 3D data:', error);
            await this.close();
            throw error;
        }
    }

    async extractThreeDData() {
        console.log('Extracting 3D lottery data...');
        
        const data = await this.page.evaluate(() => {
            const results = [];
            
            // Find all feature-card divs that contain 3D data
            const cards = document.querySelectorAll('.feature-card');
            
            cards.forEach(card => {
                // Get date from blockTime
                const dateElement = card.querySelector('.blockTime');
                // Get result from blockLucky
                const resultElement = card.querySelector('.blockLucky');
                
                if (dateElement && resultElement) {
                    const dateText = dateElement.textContent.trim();
                    const result = resultElement.textContent.trim();
                    
                    // Convert date format from "01/Nov/2025" to more standard format
                    // Parse the date parts
                    const dateParts = dateText.split('/');
                    if (dateParts.length === 3) {
                        const day = dateParts[0];
                        const month = dateParts[1];
                        const year = dateParts[2];
                        
                        // Get day of week
                        const months = {
                            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                        };
                        
                        const date = new Date(year, months[month], day);
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const dayOfWeek = days[date.getDay()];
                        
                        results.push({
                            date: dateText,
                            day: dayOfWeek,
                            result: result
                        });
                    }
                }
            });
            
            return results;
        });

        return data;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('Browser closed.');
        }
    }
}

module.exports = ThreeDScraperService;
