const express = require('express');
const path = require('path');
const CronService = require('./services/CronService');

class LotteryServer {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.cronService = new CronService();
        this.setupMiddleware();
        this.setupRoutes();
    }

    // Setup middleware
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    // Setup routes
    setupRoutes() {
        // Home route
        this.app.get('/', (req, res) => {
            res.json({
                message: 'My Lucky 2D 3D API',
                version: '1.0.0',
                endpoints: {
                    lottery: '/api/lottery',
                    lotteryData: '/api/lottery/data',
                    am: '/api/lottery/am',
                    pm: '/api/lottery/pm',
                    additional: '/api/lottery/additional',
                    liveNumber: '/api/lottery/live',
                    weekly: '/api/lottery/weekly',
                    weeklyByDate: '/api/lottery/weekly/:date (e.g., 04/Nov/2025)',
                    threeD: '/api/lottery/3d',
                    threeDByDate: '/api/lottery/3d/:date (e.g., 01/Nov/2025)'
                },
                documentation: 'Visit endpoints for lottery data'
            });
        });

        // Get all lottery data
        this.app.get('/api/lottery', async (req, res) => {
            try {
                const data = await this.cronService.readDataFromFile();
                res.json({
                    success: true,
                    ...data
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get only lottery data (without metadata)
        this.app.get('/api/lottery/data', async (req, res) => {
            try {
                const fileData = await this.cronService.readDataFromFile();
                res.json({
                    success: true,
                    data: fileData.data
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get AM data only
        this.app.get('/api/lottery/am', async (req, res) => {
            try {
                const fileData = await this.cronService.readDataFromFile();
                if (fileData.data) {
                    res.json({
                        success: true,
                        am: fileData.data.am,
                        lastUpdated: fileData.lastUpdated
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get PM data only
        this.app.get('/api/lottery/pm', async (req, res) => {
            try {
                const fileData = await this.cronService.readDataFromFile();
                if (fileData.data) {
                    res.json({
                        success: true,
                        pm: fileData.data.pm,
                        lastUpdated: fileData.lastUpdated
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get Additional (Modern/Internet) data only
        this.app.get('/api/lottery/additional', async (req, res) => {
            try {
                const fileData = await this.cronService.readDataFromFile();
                if (fileData.data) {
                    res.json({
                        success: true,
                        additional: fileData.data.additional,
                        lastUpdated: fileData.lastUpdated
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get live number only
        this.app.get('/api/lottery/live', async (req, res) => {
            try {
                const fileData = await this.cronService.readDataFromFile();
                if (fileData.data) {
                    res.json({
                        success: true,
                        liveNumber: fileData.data.liveNumber,
                        title: fileData.data.title,
                        date: fileData.data.date,
                        updatedTime: fileData.data.updatedTime,
                        lastUpdated: fileData.lastUpdated
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get all weekly data
        this.app.get('/api/lottery/weekly', async (req, res) => {
            try {
                const weeklyData = await this.cronService.readWeeklyDataFromFile();
                res.json({
                    success: true,
                    ...weeklyData
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get weekly data by date
        this.app.get('/api/lottery/weekly/:date', async (req, res) => {
            try {
                const { date } = req.params;
                const weeklyData = await this.cronService.readWeeklyDataFromFile();
                
                if (weeklyData.data && weeklyData.data.length > 0) {
                    const dateData = weeklyData.data.find(item => item.date === date);
                    
                    if (dateData) {
                        res.json({
                            success: true,
                            data: dateData,
                            lastUpdated: weeklyData.lastUpdated
                        });
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `No data found for date: ${date}`
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        message: 'No weekly data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get all 3D data
        this.app.get('/api/lottery/3d', async (req, res) => {
            try {
                const threeDData = await this.cronService.readThreeDDataFromFile();
                res.json({
                    success: true,
                    ...threeDData
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get 3D data by date
        this.app.get('/api/lottery/3d/:date', async (req, res) => {
            try {
                const date = req.params.date; // e.g., "01/Nov/2025"
                const threeDData = await this.cronService.readThreeDDataFromFile();
                
                if (threeDData.data && threeDData.data.length > 0) {
                    const dateData = threeDData.data.find(item => item.date === date);
                    
                    if (dateData) {
                        res.json({
                            success: true,
                            data: dateData,
                            lastUpdated: threeDData.lastUpdated
                        });
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `No 3D data found for date: ${date}`
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        message: 'No 3D data available yet'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Route not found',
                availableRoutes: [
                    '/',
                    '/api/lottery',
                    '/api/lottery/data',
                    '/api/lottery/am',
                    '/api/lottery/pm',
                    '/api/lottery/additional',
                    '/api/lottery/live',
                    '/api/lottery/weekly',
                    '/api/lottery/weekly/:date',
                    '/api/lottery/3d',
                    '/api/lottery/3d/:date'
                ]
            });
        });
    }

    // Start server
    async start() {
        try {
            // Initialize data directory
            await this.cronService.initializeDataDirectory();

            // Start cron job
            this.cronService.startCronJob();

            // Start Express server
            this.app.listen(this.port, () => {
                console.log('\n' + '='.repeat(60));
                console.log('🚀 My Lucky 2D 3D API Server Started');
                console.log('='.repeat(60));
                console.log(`📍 Server running at: http://localhost:${this.port}`);
                console.log(`⏰ Cron job: Running every minute`);
                console.log(`📁 Data file: ${this.cronService.dataFilePath}`);
                console.log('\n📚 Available Endpoints:');
                console.log(`   GET http://localhost:${this.port}/`);
                console.log(`   GET http://localhost:${this.port}/api/lottery`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/data`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/am`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/pm`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/additional`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/live`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/weekly`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/weekly/:date`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/3d`);
                console.log(`   GET http://localhost:${this.port}/api/lottery/3d/:date`);
                console.log('='.repeat(60) + '\n');
            });

            // Handle shutdown
            process.on('SIGINT', () => {
                console.log('\n\n🛑 Shutting down server...');
                this.cronService.stopCronJob();
                process.exit(0);
            });

        } catch (error) {
            console.error('❌ Error starting server:', error.message);
            process.exit(1);
        }
    }
}

module.exports = LotteryServer;
