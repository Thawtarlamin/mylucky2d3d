const puppeteer = require('puppeteer');
const config = require('../config/config');

// Scraper Service - Handles web scraping operations
class ScraperService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    // Initialize browser
    async initialize() {
        console.log('Initializing browser...');
        this.browser = await puppeteer.launch(config.puppeteer);
        this.page = await this.browser.newPage();
    }

    // Navigate to website
    async navigateToWebsite() {
        console.log(`Navigating to ${config.scraper.mainPage.url}...`);
        await this.page.goto(config.scraper.mainPage.url, {
            waitUntil: 'networkidle2',
            timeout: config.scraper.mainPage.timeout
        });
        
        // Wait for the pricing section to load
        await this.page.waitForSelector(config.scraper.mainPage.waitForSelector, {
            timeout: config.scraper.mainPage.selectorTimeout
        });
    }

    // Extract lottery data from page
    async extractData() {
        console.log('Extracting lottery data...');
        
        const data = await this.page.evaluate(() => {
            const result = {
                title: '',
                date: '',
                liveNumber: '',
                updatedTime: '',
                am: { result: '', set: '', value: '' },
                pm: { result: '', set: '', value: '' },
                additional: {
                    am: { Modern: '', Internet: '' },
                    pm: { Modern: '', Internet: '' }
                }
            };

            // Get title (2D)
            const titleElement = document.querySelector('.section-title');
            if (titleElement) {
                result.title = titleElement.textContent.trim();
            }

            // Get date
            const dateElement = document.querySelector('.section-subtitle');
            if (dateElement) {
                result.date = dateElement.textContent.trim();
            }

            // Get live number
            const liveNumberElement = document.querySelector('#luckyNumbWrp');
            if (liveNumberElement) {
                result.liveNumber = liveNumberElement.textContent.trim();
            }

            // Get updated time
            const updatedTimeElement = document.querySelector('#updTimeWrp');
            if (updatedTimeElement) {
                result.updatedTime = updatedTimeElement.textContent.trim();
            }

            // Get AM data (12:01)
            const amResultElement = document.querySelector('#amLuckyWrp');
            if (amResultElement) {
                result.am.result = amResultElement.textContent.trim();
            }

            const amSetElement = document.querySelector('#amSetWrp');
            if (amSetElement) {
                result.am.set = amSetElement.textContent.trim();
            }

            const amValueElement = document.querySelector('#amValueWrp');
            if (amValueElement) {
                result.am.value = amValueElement.textContent.trim();
            }

            // Get PM data (16:30)
            const pmResultElement = document.querySelector('#pmLuckyWrp');
            if (pmResultElement) {
                result.pm.result = pmResultElement.textContent.trim();
            }

            const pmSetElement = document.querySelector('#pmSetWrp');
            if (pmSetElement) {
                result.pm.set = pmSetElement.textContent.trim();
            }

            const pmValueElement = document.querySelector('#pmValueWrp');
            if (pmValueElement) {
                result.pm.value = pmValueElement.textContent.trim();
            }

            // Get Modern/Internet data
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                const bgColor = window.getComputedStyle(card).backgroundColor;
                
                if (bgColor.includes('177, 225, 227') || 
                    card.style.backgroundColor === '#b1e1e3' || 
                    card.style.backgroundColor === 'rgb(177, 225, 227)') {
                    
                    const tables = card.querySelectorAll('table');
                    if (tables.length > 0) {
                        const table = tables[0];
                        const rows = table.querySelectorAll('tr');
                        
                        if (rows.length >= 2) {
                            const headerCells = rows[0].querySelectorAll('td');
                            const valueCells = rows[1].querySelectorAll('td');
                            
                            if (headerCells.length >= 3 && valueCells.length >= 2) {
                                const timeText = headerCells[0].textContent.trim();
                                const modernValue = valueCells[0].textContent.trim();
                                const internetValue = valueCells[1].textContent.trim();
                                
                                if (timeText.includes('9:30 AM')) {
                                    result.additional.am.Modern = modernValue;
                                    result.additional.am.Internet = internetValue;
                                } else if (timeText.includes('2:00 PM')) {
                                    result.additional.pm.Modern = modernValue;
                                    result.additional.pm.Internet = internetValue;
                                }
                            }
                        }
                    }
                }
            });

            return result;
        });

        return data;
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
            await this.navigateToWebsite();
            const data = await this.extractData();
            return data;
        } catch (error) {
            console.error('Scraping error:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
}

module.exports = ScraperService;
