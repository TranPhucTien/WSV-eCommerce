"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./src/app");
var PORT = 3055;
var server = app_1.default.listen(PORT, function () {
    console.log("WSV eCommerce start with ".concat(PORT));
});
process.on('SIGTERM', function () {
    server.close(function () { return console.log("Exit Server Express"); });
});
