class CommonTestMethods {
    constructor() {
    }
    getRandomNumber = (min, max)  => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = new CommonTestMethods();
