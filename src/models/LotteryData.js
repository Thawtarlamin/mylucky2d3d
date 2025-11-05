// Lottery Data Model
class LotteryData {
    constructor() {
        this.title = '';
        this.date = '';
        this.liveNumber = '';
        this.liveSet = '';
        this.liveValue = '';
        this.updatedTime = '';
        this.am = {
            time: '12:01 AM',
            result: '',
            set: '',
            value: ''
        };
        this.pm = {
            time: '16:30 PM',
            result: '',
            set: '',
            value: ''
        };
        this.additional = {
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
        };
    }

    // Set title
    setTitle(title) {
        this.title = title;
    }

    // Set date
    setDate(date) {
        this.date = date;
    }

    // Set live number
    setLiveNumber(liveNumber) {
        this.liveNumber = liveNumber;
    }

    //Set live set
    setLiveSet(liveSet) {
        this.liveSet = liveSet;
    }

    //Set live value
    setLiveValue(liveValue) {
        this.liveValue = liveValue;
    }

    // Set updated time
    setUpdatedTime(updatedTime) {
        this.updatedTime = updatedTime;
    }

    // Set AM data
    setAmData(result, set, value) {
        this.am.result = result;
        this.am.set = set;
        this.am.value = value;
    }

    // Set PM data
    setPmData(result, set, value) {
        this.pm.result = result;
        this.pm.set = set;
        this.pm.value = value;
    }

    // Set Additional AM data (Modern/Internet)
    setAdditionalAmData(modern, internet) {
        this.additional.am.Modern = modern;
        this.additional.am.Internet = internet;
    }

    // Set Additional PM data (Modern/Internet)
    setAdditionalPmData(modern, internet) {
        this.additional.pm.Modern = modern;
        this.additional.pm.Internet = internet;
    }

    // Get all data as JSON
    toJSON() {
        return {
            title: this.title,
            date: this.date,
            liveNumber: this.liveNumber,
            liveSet: this.liveSet,
            liveValue: this.liveValue,
            updatedTime: this.updatedTime,
            am: this.am,
            pm: this.pm,
            additional: this.additional
        };
    }

    // Validate data
    isValid() {
        return this.title !== '' && this.date !== '';
    }
}

module.exports = LotteryData;
