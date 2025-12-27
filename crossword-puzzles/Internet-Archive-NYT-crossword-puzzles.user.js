// ==UserScript==
// @name         Internet Archive: NYT Crossword Puzzles
// @description  Add a small "pencil" icon to the left of all AcrossLite (.puz) files, which opens the crossword puzzle file in an online viewer in a new browser tab.
// @version      1.1.0
// @match        *://archive.org/download/nyt-puz/*
// @icon         https://github.com/rschroll/crosswords/raw/master/crosswords.png
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/single-page-apps/tree/userscripts
// @supportURL   https://github.com/warren-bank/single-page-apps/issues
// @downloadURL  https://github.com/warren-bank/single-page-apps/raw/userscripts/crossword-puzzles/Internet-Archive-NYT-crossword-puzzles.user.js
// @updateURL    https://github.com/warren-bank/single-page-apps/raw/userscripts/crossword-puzzles/Internet-Archive-NYT-crossword-puzzles.user.js
// @require      ./lib/common.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// tested on:
//   https://archive.org/download/nyt-puz/daily/2021/08/

// "pencil" icon belongs to:
//   font-family: "Iconochive-Regular"
//   https://www.onlinewebfonts.com/download/7460b5eac07072219464dee08159625e

var user_options = {
  "crosswords_url": "https://warren-bank.github.io/single-page-apps/crossword-puzzles/index.html",
  "cors_proxy_url_prefix": "https://cors-crossword-puzzles.warren-bank.workers.dev/"
}

;(function(){
  var $anchors = unsafeWindow.document.querySelectorAll('table.directory-listing-table > tbody > tr > td:first-child > a:first-child[href$=".puz"]')
  var $a, $td
  var url, new_$a, new_$span

  for (var i=0; i < $anchors.length; i++) {
    $a  = $anchors[i]
    $td = $a.parentElement

    url = $a.href
    url = get_anchor_url(user_options, url)

    new_$a = unsafeWindow.document.createElement('a')
    new_$a.setAttribute('target', '_blank')
    new_$a.setAttribute('href', url)
    new_$a.setAttribute('style', 'margin-right: 0.5em;')

    new_$span = unsafeWindow.document.createElement('span')
    new_$span.setAttribute('class', 'iconochive-crossword')
    new_$span.setAttribute('title', 'Open Crossword Puzzle')
    new_$span.setAttribute('aria-hidden', 'true')
    new_$span.innerHTML = '&#x270E;'

    new_$a.appendChild(new_$span)
    $td.insertBefore(new_$a, $a)
  }
})()
