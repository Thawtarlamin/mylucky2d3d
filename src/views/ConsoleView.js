// Console View - Displays data in console
class ConsoleView {
    // Display lottery data in formatted console output
    static display(lotteryData) {
        console.log('\n' + '='.repeat(50));
        console.log('           LOTTERY DATA');
        console.log('='.repeat(50) + '\n');

        console.log(`📋 Title: ${lotteryData.title}`);
        console.log(`📅 Date: ${lotteryData.date}`);
        console.log(`🎯 Live Number: ${lotteryData.liveNumber}`);
        console.log(`⏰ Updated Time: ${lotteryData.updatedTime}`);
        
        console.log('\n' + '-'.repeat(50));
        console.log('  12:01 AM Draw');
        console.log('-'.repeat(50));
        console.log(`⏰ Time: ${lotteryData.am.time}`);
        console.log(`🎲 Result: ${lotteryData.am.result}`);
        console.log(`📊 Set: ${lotteryData.am.set}`);
        console.log(`💰 Value: ${lotteryData.am.value}`);
        
        console.log('\n' + '-'.repeat(50));
        console.log('  16:30 PM Draw');
        console.log('-'.repeat(50));
        console.log(`⏰ Time: ${lotteryData.pm.time}`);
        console.log(`🎲 Result: ${lotteryData.pm.result}`);
        console.log(`📊 Set: ${lotteryData.pm.set}`);
        console.log(`💰 Value: ${lotteryData.pm.value}`);
        
        console.log('\n' + '-'.repeat(50));
        console.log('  9:30 AM (Modern/Internet)');
        console.log('-'.repeat(50));
        console.log(`⏰ Time: ${lotteryData.additional.am.time}`);
        console.log(`🏢 Modern: ${lotteryData.additional.am.Modern}`);
        console.log(`🌐 Internet: ${lotteryData.additional.am.Internet}`);
        
        console.log('\n' + '-'.repeat(50));
        console.log('  2:00 PM (Modern/Internet)');
        console.log('-'.repeat(50));
        console.log(`⏰ Time: ${lotteryData.additional.pm.time}`);
        console.log(`🏢 Modern: ${lotteryData.additional.pm.Modern}`);
        console.log(`🌐 Internet: ${lotteryData.additional.pm.Internet}`);
        
        console.log('\n' + '='.repeat(50) + '\n');
    }

    // Display JSON output
    static displayJSON(lotteryData) {
        console.log('\n' + '='.repeat(50));
        console.log('           JSON OUTPUT');
        console.log('='.repeat(50) + '\n');
        console.log(JSON.stringify(lotteryData.toJSON(), null, 2));
        console.log('\n' + '='.repeat(50) + '\n');
    }

    // Display error
    static displayError(error) {
        console.error('\n' + '='.repeat(50));
        console.error('           ERROR');
        console.error('='.repeat(50));
        console.error(`❌ ${error.message}`);
        console.error('='.repeat(50) + '\n');
    }

    // Display success message
    static displaySuccess(message) {
        console.log(`\n✅ ${message}\n`);
    }

    // Display loading message
    static displayLoading(message) {
        console.log(`\n⏳ ${message}...`);
    }
}

module.exports = ConsoleView;
