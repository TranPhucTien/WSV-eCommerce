"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var connectString = "mongodb://localhost:27017/shopDEV";
mongoose_1.default.connect(connectString)
    .then(function (_) { return console.log("Connected mongodb success"); })
    .catch(function (err) { return console.log("Error connect: ".concat(err)); });
exports.default = mongoose_1.default;
