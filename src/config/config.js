// Configuration settings
module.exports = {
    scraper: {
        mainPage: {
            url: 'https://mylucky2d3d.com/',
            timeout: 30000,
            waitForSelector: '#pricing',
            selectorTimeout: 10000
        },
        weeklyPage: {
            url: 'https://mylucky2d3d.com/2d',
            timeout: 30000,
            waitForSelector: '#pricing',
            selectorTimeout: 10000
        },
        threeDPage: {
            url: 'https://mylucky2d3d.com/3d',
            timeout: 30000,
            waitForSelector: '#pricing',
            selectorTimeout: 10000
        }
    },
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
};
