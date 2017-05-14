"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap = require('snoowrap');
const credentials = require('./credentials');
function handle(e, ctx, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("running");
            const { clientId, clientSecret, refreshToken } = credentials;
            const r = new snoowrap({
                userAgent: 'wsip_scraper',
                clientId,
                clientSecret,
                refreshToken
            });
            // Printing a list of the titles on the front page
            const titles = yield r.getHot().map(post => post.title);
            console.log('titles', titles);
            cb(null, titles);
        }
        catch (e) {
            console.log("error", e);
            cb(e);
        }
    });
}
exports.handle = handle;
