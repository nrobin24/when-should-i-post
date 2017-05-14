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
const AWS = require("aws-sdk");
const moment = require("moment");
const R = require("ramda");
const snoowrap = require('snoowrap');
const credentials = require('./credentials');
const promisify = require('promisify-node');
const s3 = new AWS.S3();
const s3Bucket = 'nr-wsip';
const aws_utils_1 = require("./aws-utils");
function handle(e, ctx, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Load recent posts that we already have data on from S3
            const today = moment().format('YYYY-MM-DD');
            console.log('today is: ', today);
            console.log("checking for daily data file");
            const keys = yield aws_utils_1.listKeys(s3Bucket, today);
            const todayKeyExists = keys.filter(R.equals(today));
            let posts = [];
            if (todayKeyExists.length) {
                const oldPosts = yield aws_utils_1.getObject(s3Bucket, today);
                posts = posts.concat(oldPosts);
            }
            console.log(`already keeping track of ${posts.length} posts`);
            // Get data from reddit
            const { clientId, clientSecret, refreshToken } = credentials;
            const r = new snoowrap({
                userAgent: 'wsip_scraper',
                clientId,
                clientSecret,
                refreshToken
            });
            const subs = yield r.getPopularSubreddits({ limit: 20 }).map(s => s.display_name);
            const newPostsNested = yield Promise.all(subs.map(s => r.getSubreddit(s).getNew({ limit: 5 })));
            const newPostsData = newPostsNested.reduce((p, c) => p.concat(c), []);
            const newPosts = newPostsData.map(p => {
                const { id, created, subreddit, ups } = p;
                const lastUpdate = moment().unix();
                return { id, created, subreddit: subreddit.display_name, lastUpdate, ups };
            });
            // Add any unseen posts to existing data
            console.log(`fetched info from reddit on ${newPosts.length} posts`);
            const allPosts = R.uniqBy(R.prop('id'), R.concat(posts, newPosts));
            const newPostsFound = allPosts.length - posts.length;
            console.log(`${newPostsFound} new posts found`);
            // Write data to file in S3
            if (newPostsFound) {
                console.log("putting posts to s3");
                const body = allPosts.reduce((p, c) => p + JSON.stringify(c) + '\n', "");
                const s3Response = yield aws_utils_1.putObject(s3Bucket, today, body);
                console.log("got s3 response", s3Response);
            }
            cb(null, 'success');
        }
        catch (e) {
            console.log("error", e);
            cb(e);
        }
    });
}
exports.handle = handle;
