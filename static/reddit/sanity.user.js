// ==UserScript==
// @name     Reddit Sanity
// @description  With Russia propoganda and bots flooding reddit, this script aims to help identify users posts better, by including identicons, account age, and hate-sub posting warnings.
// @version  1
// @grant    none
// @include  http://old.reddit.com/*
// @include  https://old.reddit.com/*
// @include  http://www.reddit.com/*
// @include  https://www.reddit.com/*
// ==/UserScript==

// Inject Code from repo.
const s = document.createElement("script");
s.src = "//greymage.github.io/static/reddit/build/app.js?"+(+new Date());
document.body.appendChild(s);
