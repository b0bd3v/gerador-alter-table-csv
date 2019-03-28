"use strict";
'use strict ';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFilePathCSV = function (filePath) {
    var regexp = /\.csv$/;
    return regexp.test(filePath);
};
