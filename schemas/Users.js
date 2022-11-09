"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
//Users Schema
var Users = new mongoose_1["default"].Schema({
    uid: {
        type: 'Number'
    },
    userName: {
        type: 'String'
    }
}, { timestamps: true });
exports["default"] = mongoose_1["default"].model('Users', Users);
