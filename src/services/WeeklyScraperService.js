const puppeteer = require('puppeteer');
const config = require('../config/config');

// Weekly Scraper Service - Scrapes 2D Weekly historical data
class WeeklyScraperService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    // Initialize browser
    async initialize() {
        console.log('Initializing browser for weekly data...');
        this.browser = await puppeteer.launch(config.puppeteer);
        this.page = await this.browser.newPage();
    }

    // Navigate to weekly page
    async navigateToWeeklyPage() {
        console.log(`Navigating to ${config.scraper.weeklyPage.url}...`);
        await this.page.goto(config.scraper.weeklyPage.url, {
            waitUntil: 'networkidle2',
            timeout: config.scraper.weeklyPage.timeout
        });
        
        await this.page.waitForSelector(config.scraper.weeklyPage.waitForSelector, {
            timeout: config.scraper.weeklyPage.selectorTimeout
        });
    }

    // Extract weekly data from page
    async extractWeeklyData() {
        console.log('Extracting weekly lottery data...');
        
        const weeklyData = await this.page.evaluate(() => {
            const results = [];
            
            // Find all rows that contain date headers
            const rows = document.querySelectorAll('.row');
            
            let currentDateData = null;
            
            rows.forEach(row => {
                // Check if this row contains a date header
                const dateHeader = row.querySelector('h4.section-title.text-center');
                
                if (dateHeader) {
                    // Save previous date data if exists
                    if (currentDateData) {
                        results.push(currentDateData);
                    }
                    
                    // Extract date and day
                    const dateText = dateHeader.textContent.trim();
                    const dateMatch = dateText.match(/(\d{2}\/\w{3}\/\d{4})\s*-\s*(\w+)/);
                    
                    if (dateMatch) {
                        currentDateData = {
                            date: dateMatch[1],
                            day: dateMatch[2],
                            am: {
                                time: '12:01 AM',
                                result: '',
                                set: '',
                                value: ''
                            },
                            pm: {
                                time: '16:30 PM',
                                result: '',
                                set: '',
                                value: ''
                            },
                            additional: {
                                am: {
                                    time: '9:30 AM',
                                    Modern: '',
                                    Internet: ''
                                },
                                pm: {
                                    time: '2:00 PM',
                                    Modern: '',
                                    Internet: ''
                                }
                            }
                        };
                    }
                }
                
                // Check if this row contains AM/PM cards
                if (currentDateData) {
                    const featureCards = row.querySelectorAll('.feature-card');
                    
                    if (featureCards.length === 2) {
                        // Check if first card has light blue background (Modern/Internet)
                        const firstCard = featureCards[0];
                        const bgColor = window.getComputedStyle(firstCard).backgroundColor;
                        
                        if (bgColor.includes('177, 225, 227') || 
                            firstCard.style.backgroundColor === '#b1e1e3' || 
                            firstCard.style.backgroundColor === 'rgb(177, 225, 227)') {
                            
                            // This is Modern/Internet row
                            featureCards.forEach(card => {
                                const table = card.querySelector('table');
                                if (table) {
                                    const rows = table.querySelectorAll('tr');
                                    
                                    if (rows.length >= 2) {
                                        const headerCells = rows[0].querySelectorAll('td');
                                        const valueCells = rows[1].querySelectorAll('td');
                                        
                                        if (headerCells.length >= 3 && valueCells.length >= 2) {
                                            const timeText = headerCells[0].textContent.trim();
                                            const modernValue = valueCells[0].textContent.trim();
                                            const internetValue = valueCells[1].textContent.trim();
                                            
                                            if (timeText.includes('9:30 AM')) {
                                                currentDateData.additional.am.Modern = modernValue;
                                                currentDateData.additional.am.Internet = internetValue;
                                            } else if (timeText.includes('2:00 PM')) {
                                                currentDateData.additional.pm.Modern = modernValue;
                                                currentDateData.additional.pm.Internet = internetValue;
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            // This is AM/PM row
                            // First card is AM
                            const amResult = featureCards[0].querySelector('.blockLucky');
                            const amCells = featureCards[0].querySelectorAll('.blockValStyle');
                            
                            if (amResult) currentDateData.am.result = amResult.textContent.trim();
                            if (amCells.length >= 2) {
                                currentDateData.am.set = amCells[0].textContent.trim();
                                currentDateData.am.value = amCells[1].textContent.trim();
                            }
                            
                            // Second card is PM
                            const pmResult = featureCards[1].querySelector('.blockLucky');
                            const pmCells = featureCards[1].querySelectorAll('.blockValStyle');
                            
                            if (pmResult) currentDateData.pm.result = pmResult.textContent.trim();
                            if (pmCells.length >= 2) {
                                currentDateData.pm.set = pmCells[0].textContent.trim();
                                currentDateData.pm.value = pmCells[1].textContent.trim();
                            }
                        }
                    }
                }
            });
            
            // Push last date data
            if (currentDateData) {
                results.push(currentDateData);
            }
            
            return results;
        });

        return weeklyData;
    }

    // Close browser
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('Browser closed.');
        }
    }

    // Main scrape method
    async scrape() {
        try {
            await this.initialize();
            await this.navigateToWeeklyPage();
            const data = await this.extractWeeklyData();
            return data;
        } catch (error) {
            console.error('Weekly scraping error:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
}

module.exports = WeeklyScraperService;
