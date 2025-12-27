// ==UserScript==
// @name         The Guardian: Crossword Puzzles
// @description  Add an image to the top-left corner of pages that contain a crossword puzzle, which opens the crossword puzzle in an online viewer in a new browser tab.
// @version      1.0.0
// @include      /^https?:\/\/(?:[^\.]*\.)*theguardian\.com\/crosswords\/(?:(?:quick|cryptic|prize|quick-cryptic|quiptic|sunday-quick|speedy|everyman|weekend|mini)\/\d+|\d{4}\/[a-z]{3}\/\d{1,2}\/(?:azed|genius)-crossword(-no)?-\d+)$/
// @icon         https://github.com/rschroll/crosswords/raw/gh-pages/crosswords.png
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/single-page-apps/tree/userscripts
// @supportURL   https://github.com/warren-bank/single-page-apps/issues
// @downloadURL  https://github.com/warren-bank/single-page-apps/raw/userscripts/crossword-puzzles/The-Guardian-crossword-puzzles.user.js
// @updateURL    https://github.com/warren-bank/single-page-apps/raw/userscripts/crossword-puzzles/The-Guardian-crossword-puzzles.user.js
// @require      ./lib/common.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

var user_options = {
  "crosswords_url": "https://warren-bank.github.io/single-page-apps/crossword-puzzles/index.html",
  "cors_proxy_url_prefix": "https://cors-crossword-puzzles.warren-bank.workers.dev/",
  "anchor_image": {
    "url":    "https://rschroll.github.io/crosswords/crosswords.png",
    "width":  "100px",
    "height": "100px"
  }
}

append_anchor_image(user_options)
