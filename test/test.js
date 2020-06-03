const mongoose = require("mongoose");
const { expect } = chai

const User = require("./../models/User");

describe('Testing the routes', function () {

    before('connect', function () {
        return mongoose.connect(process.env.TEST_MONGODB_URI);
    })
})