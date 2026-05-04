/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */
riot.tag('about-page', '<header class="page"> <button class="back" onclick="{ close }" title="Back"></button> <h1>About</h1> </header> <div> <h2>Welcome to Crosswords!</h2> <p>When you first start Crosswords, you are presented with a list of sources for puzzles. Select any of these, and you will see a selection of recent puzzles, ordered newest to oldest. Selecting any puzzle will cause it to be downloaded and opened for solving.</p> <p>As you work on the crossword, your progress is saved. Incomplete puzzles are listed in the <i>In Progress</i> category and are moved to the <i>Completed</i> category once they have been solved. Puzzles with no cells filled in are listed under <i>Empty</li>.</p> <h2>Solving</h2> <p>Enter a letter in the highlighted cell with your keyboard. On touch devices, your on-screen keyboard should open automatically; if not, touch the grid to trigger it. After you enter a letter, the highlight will move to the next cell in the answer. <b>Space</b> will clear the current square and move forwards, and <b>Backspace</b> will clear and move backwards. Select another cell to move the highlight, or select the highlighted cell again to switch between across and down. Selecting a clue will move the highlight to the first empty cell in that answer.</p> <p>You may navigate around the grid using the arrow keys. Use <b>,</b> to change the direction without moving the highlight. <b>Tab</b> and <b>Enter</b> move to the answer for the next clue, while <b>Shift</b>+<b>Tab</b> or <b>.</b> moves to the previous clue\'s answer. <b>Home</b> moves to the first cell in the current answer, while <b>End</b> moves to the last cell.</p> <p>Several actions can be triggered by icons on the puzzle page. On large screens, these icons are in the header. On small screens, these icons are displayed by activating the <img src="img/navigation-menu.svg" alt="Menu"> icon in the lower right. The <img src="img/tick@30.png" alt="Check"> icon will check your fill and change any incorrect letters to red. Use the <img src="img/reveal.svg" alt="Reveal"> icon to show the correct letter for the current cell, or <img src="img/compose.svg" alt="Solve"> to solve the whole puzzle. <img src="img/info.svg" alt="Info"> will display information about the puzzle, and <img src="img/back.svg" alt="Back"> returns you to the list of puzzles.</p> <h2>Importing</h2> <p>Crosswords can import puzzle files in a number of formats, although the only one you are likely to encounter online is the Across Lite <tt>.puz</tt> format. At the bottom of the list of puzzle sources is the <i>Import File</i> item. Select this and a file dialog will open, allowing you to choose a file to import. At the moment, only a single puzzle can be imported at a time. <span if="{ riot.system == \'Ubuntu Touch\' }">(Unfortunately, Ubuntu Touch does not support this option as of this writing.)</span> Puzzles can also be drag-and-dropped into Crosswords.</p> <p if="{ riot.system == \'Ubuntu Touch\' }">On Ubuntu Touch, you can also import files via the Content Hub. Crosswords is registered as an importer of documents. Any other app that recognizes puzzle files as documents can export them to Crosswords. (As of this writing, we are unaware of any apps that do so.) You can also share links to puzzles and have Crosswords import them automatically. (As of this writing, this can be done from the web browser only with a bit of trickery: When you encounter a link to a puzzle online, long press it and then select "Open link in new tab". A new tab will open, and then an "Open with" dialog appears, which gives you no options. Touch "Cancel" at the bottom to return to the (empty) tab. Open the menu at the top right, select "Share", and then choose "Crosswords" as the destination.)</p> <p if="{ riot.system == \'Android\' }">On Android, Crosswords can act as a viewer for <tt>.puz</tt> files. When you try to open a <tt>.puz</tt> from the internet or your files, Crosswords should be listed as an option.</p> <h2>Deleting</h2> <p>You may delete puzzles in the <i>Empty</i>, <i>In Progress</i>, and <i>Completed</i> categories. Select the <img src="img/delete.svg" alt="Delete"> icon to enter delete mode. Select the puzzles which you wish to delete, or select the category to choose all the puzzles. Use the <img src="img/delete-red.svg" alt="Delete"> icon to delete those puzzles, or cancel with <img src="img/cancel.svg" alt="Cancel">.</p> <h2>Bugs</h2> <p>While we hope you will only be frustrated with the crossword puzzles, we\'re sure there are a few bugs in the app itself. If you find one, please report it to our <a href="https://github.com/rschroll/crosswords/issues">bug tracker</a>.</p> <h2>Colophon</h2> <p>This is version 0.3.3 of <a href="http://rschroll.github.io/crosswords/">Crosswords</a>.</p> <p>Crosswords is Copyright 2014-2015 by Robert Schroll and incorporates copyrighted material for several other authors under various licenses.</p> <p>Crosswords is released under the <a href="https://github.com/rschroll/crosswords/blob/master/LICENSE">GPL v3 (or later)</a>. The source code is <a href="https://github.com/rschroll/crosswords/">available on Github</a>.</p> </div>', function(opts) {
        var self = this;
        self.mixin("display");

});

/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */
riot.tag('overlay-dialog', '<div> <h1>{ title }</h1> <div> <yield></yield> </div> <menu> <button onclick="{ close }">{ buttonlabel }</button> </menu> </div>', function(opts) {
        var self = this;
        self.mixin("display");

        self.title = opts.title;
        self.buttonlabel = opts.buttonlabel;

});

/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */
riot.tag('list-page', '<header class="page"> <h1>Puzzles</h1> <ul class="actions"> <li if="{ deleteMode }" onclick="{ disableDelete }"> <img src="img/cancel.svg" alt="Cancel" title="Cancel"> <span>Delete</span> </li> <li if="{ deleteMode }" onclick="{ deletePuzzles }"> <img src="img/delete-red.svg" alt="Delete" title="Delete"> <span>Delete</span> </li> <li onclick="{ enableDelete }" if="{ !deleteMode && puzzles.length && (selected == \'Empty\' || selected == \'In Progress\' || selected == \'Completed\') }"> <img src="img/delete.svg" alt="Delete" title="Delete"> <span>Delete</span> </li> <li if="{ !deleteMode }" onclick="{ decreaseFontSize }"> <img src="img/font-size-decrease.svg" alt="Smaller Font" title="Smaller Font"> <span>Smaller Font</span> </li> <li if="{ !deleteMode }" onclick="{ increaseFontSize }"> <img src="img/font-size-increase.svg" alt="Larger Font" title="Larger Font"> <span>Larger Font</span> </li> <li if="{ !deleteMode }" onclick="{ about }"> <img src="img/info.svg" alt="About" title="About"> <span>About</span> </li> </ul> </header> <section id="sources" class="{ list: true, deleteMode: deleteMode }"> <ul> <li each="{ urlGens }" class="{ selected: parent.selected == title }" onclick="{ parent.setPuzzles }"> { title } <span if="{ parent.deleteMode && parent.selected == title }"> <input type="checkbox" onclick="{ parent.setPuzzlesInput }"> </span> </li> <li onclick="{ getFile }">Import File</li> <li onclick="{ getUrl }">Import URL</li> </ul> <input type="file" id="fileinput" onchange="{ loadFile }"> </section> <section id="dates" class="{ list: true, deleteMode: deleteMode }" show="{ selected }"> <ul> <li each="{ puzzles }" onclick="{ parent.clickPuzzle }">{ title } <span if="{ !parent.deleteMode && completion > 0 }">{ (completion*100).toFixed(0) + "%" }</span> <span if="{ parent.deleteMode }"> <input type="checkbox" url="{ url }" onclick="{ parent.clickPuzzleInput }"> </span> <div class="export" if="{ !parent.deleteMode }"><a href="{ url }"><button onclick="{ parent.saveToPUZ }" title="save PUZ file">PUZ</button></a><button onclick="{ parent.saveToPDF }" title="save PDF file">PDF</button></div> </li> <div id="dates-notes" show="{ puzzles.length == 0 }"> <span>{ note }</span> </div> </ul> </section>', function(opts) {
        var self = this;
        self.mixin("display");

        function strZero(n) {
            if (n < 10)
                return "0" + n;
            return n.toString();
        }

        function sixDigitDate(d) {
            return strZero(d.getFullYear() % 100) + strZero(d.getMonth() + 1) + strZero(d.getDate());
        }

        function eightDigitDate(d) {
            return d.getFullYear() + strZero(d.getMonth() + 1) + strZero(d.getDate()) ;
        }

        function lastTwoWeeks(fn, skip) {
            return function () {
                var date = new Date();
                var retval = [];
                for (var i=0; i<14; i++) {
                    if (!skip || skip.indexOf(date.getDay()) == -1)
                        retval.push({url: fn(date), title: date.toDateString()});
                    date.setDate(date.getDate() - 1);
                }
                return retval;
            }
        }

        function weekly(fn, day) {
            return function () {
                var date = new Date();
                var delta = day - date.getDay();
                var retval = [];
                if (delta > 0)
                    delta -= 7;
                date.setDate(date.getDate() + delta);
                for (var i=0; i<10; i++) {
                    retval.push({url: fn(date), title: date.toDateString()});
                    date.setDate(date.getDate() - 7);
                }
                return retval
            }
        }

        function fromList(list) {
            var retval = [];
            for (var i in list)
                retval.push({url: list[i]});
            return retval;
        }

        this.urlGens = [
            { title: "Empty",
                func: function () {
                    self.note = "No empty puzzles";
                    return fromList(database.getPuzzleUrls(database.EMPTY));
                }},
            { title: "In Progress",
                func: function () {
                    self.note = "No puzzles in progress";
                    return fromList(database.getPuzzleUrls(database.INPROGRESS));
                }},
            { title: "Completed",
                func: function () {
                    self.note = "No completed puzzles";
                    return fromList(database.getPuzzleUrls(database.COMPLETED));
                }},
            { title: "Wall Street Journal",
                func: lastTwoWeeks(function (date) {
                    return "https://cors-crossword-puzzles.warren-bank.workers.dev/" +
                            "https://herbach.dnsalias.com/wsj/wsj" +
                            sixDigitDate(date) + ".puz";
                })},
            { title: "Universal Daily Crossword",
                func: lastTwoWeeks(function (date) {
                    return "https://cors-crossword-puzzles.warren-bank.workers.dev/" +
                            "https://herbach.dnsalias.com/uc/uc" +
                            sixDigitDate(date) + ".puz";
                })},
            { title: "Newsday",
                func: lastTwoWeeks(function (date) {
                    return "https://cors-crossword-puzzles.warren-bank.workers.dev/" +
                            "https://www.brainsonly.com/servlets-newsday-crossword/newsdaycrossword?date=" +
                            sixDigitDate(date) + "&fmt=nwd";  // fmt only to help our format detection
                })},
            { title: "Jonesin'",
                func: weekly(function (date) {
                    return "https://cors-crossword-puzzles.warren-bank.workers.dev/" +
                            "https://herbach.dnsalias.com/Jonesin/jz" +
                            sixDigitDate(date) + ".puz";
                }, /* Thursday */ 4)}
        ];

        self.puzzles = [];
        self.note = "";
        self.selected = null;
        self.deleteMode = false;

        this.setPuzzles = function(event) {
            var smallscreen = (self.sources.offsetWidth == document.body.offsetWidth);
            if (event.item.title == self.selected) {
                if (self.deleteMode) {
                    var input = event.target.querySelector("input");
                    if (input.indeterminate) {
                        input.indeterminate = false;
                        input.checked = true;
                    } else {
                        input.checked = !input.checked;
                    }
                    self.datesDelete(input.checked);
                    event.preventUpdate = true;
                    return;
                }
                if (smallscreen) {
                    self.puzzles = [];
                    self.note = "";
                    self.deleteMode = false;
                    window.history.back();
                    return;
                }
                event.preventUpdate = true;
                return;
            }
            if (smallscreen)
                self.sources.scrollTop = 0;
            self.dates.scrollTop = 0;
            self.puzzles = event.item.func();
            self.deleteMode = false;
            riot.route("/" + event.item.title);
        }.bind(this);

        this.setPuzzlesInput = function(event) {
            event.preventUpdate = true;
            event.stopPropagation();
            self.datesDelete(event.target.checked);
        }.bind(this);

        this.datesDelete = function(checked) {
            var inputs = self.dates.querySelectorAll("input");
            for (var i=0; i<inputs.length; i++)
                inputs[i].checked = checked;
        }.bind(this);

        this.saveToPUZ = function(event) {
            event.preventUpdate = true;
            event.stopPropagation();
            if (! self.deleteMode) {
                var url = event.item.url;
                window.open(url, '_blank')
            }
        }.bind(this);

        this.saveToPDF = function(event) {
            event.preventUpdate = true;
            event.stopPropagation();
            if (! self.deleteMode) {
                var url = event.item.url;
                save_PUZ_URL_to_PDF_file(url);
            }
        }.bind(this);

        this.clickPuzzle = function(event) {
            event.preventUpdate = true;
            if (self.deleteMode) {
                var input = event.target.querySelector("input");
                input.checked = !input.checked;
                self.sourcesDeleteIndeterminate();
            } else {
                event.target.classList.add("busy");
                riot.loadPuzzle(event.item.url);
            }
        }.bind(this);

        this.clickPuzzleInput = function(event) {
            event.preventUpdate = true;
            event.stopPropagation();
            self.sourcesDeleteIndeterminate();
        }.bind(this);

        this.sourcesDeleteIndeterminate = function() {
            var input = self.sources.querySelector("input");
            var inputs = self.dates.querySelectorAll("input");
            var checked = false;
            var unchecked = false;
            for (var i=0; i<inputs.length; i++)
                if (inputs[i].checked)
                    checked = true;
                else
                    unchecked = true;
            input.indeterminate = checked && unchecked;
            input.checked = checked && !unchecked;
        }.bind(this);

        this.decreaseFontSize = function(event) {
            event.preventUpdate = true;
            var newFontSize = self.calculateFontSize(-2)
            document.documentElement.style.fontSize = newFontSize + 'px'
        }.bind(this);

        this.increaseFontSize = function(event) {
            event.preventUpdate = true;
            var newFontSize = self.calculateFontSize(2)
            document.documentElement.style.fontSize = newFontSize + 'px'
        }.bind(this);

        this.calculateFontSize = function(change, defaultFontSize = 16, minFontSize = 4) {
            var oldFontSize = parseInt(document.documentElement.style.fontSize, 10)
            if (isNaN(oldFontSize) || (oldFontSize <= 0))
              oldFontSize = defaultFontSize
            var newFontSize = oldFontSize + change
            if (newFontSize < minFontSize)
              newFontSize = minFontSize
            return newFontSize
        }.bind(this);

        this.about = function(event) {
            event.preventUpdate = true;
            riot.route("about");
        }.bind(this);

        this.enableDelete = function(event) {
            self.deleteMode = true;
        }.bind(this);

        this.disableDelete = function(event) {
            self.deleteMode = false;
            var inputs = self.root.querySelectorAll("input[type='checkbox']");
            for (var i=0; i<inputs.length; i++) {
                inputs[i].checked = false;
                inputs[i].indeterminate = false;
            }
        }.bind(this);

        this.deletePuzzles = function(event) {
            var inputs = self.dates.querySelectorAll("input");
            var deleteUrls = [];
            for (var i=0; i<inputs.length; i++)
                if (inputs[i].checked)
                    deleteUrls.push(inputs[i].attributes.url.value);
            database.deletePuzzles(deleteUrls);
            self.disableDelete();
            self.update();
        }.bind(this);

        this.getFile = function(event) {
            self.fileinput.click();

            self.puzzles = [];
            self.note = "";
            self.selected = null;
            self.deleteMode = false;
        }.bind(this);

        this.getUrl = function(event) {
            var url = window.prompt('URL:')
            if (url && (url.substring(0, 4).toLowerCase() === 'http'))
                riot.loadPuzzle(url);
        }.bind(this);

        this.loadFile = function(event) {
            if (event.target.files.length == 0)
                return;
            var f = event.target.files[0];
            riot.loadPuzzle(window.URL.createObjectURL(f), f.name);
        }.bind(this);

        self.on("update", function () {
            var puzzles;

            if (self.selected == "Empty")
                puzzles = fromList(database.getPuzzleUrls(database.EMPTY));
            else if (self.selected == "In Progress")
                puzzles = fromList(database.getPuzzleUrls(database.INPROGRESS));
            else if (self.selected == "Completed")
                puzzles = fromList(database.getPuzzleUrls(database.COMPLETED));
            else
                puzzles = self.puzzles;

            for (var i in puzzles) {
                var stored = database.getPuzzle(puzzles[i]["url"]);
                if (stored) {
                    puzzles[i]["title"] = stored.puzzle.metadata["title"];
                    puzzles[i]["completion"] = stored.completion;
                } else {
                    puzzles[i]["completion"] = 0;
                }
            }
            self.puzzles = puzzles;
            if (self.selected)
                self.root.classList.add("view-dates");
            else
                self.root.classList.remove("view-dates");

            var busy = self.root.querySelectorAll(".busy");
            for (var i=0; i<busy.length; i++)
                busy[i].classList.remove("busy");
        });

});

/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */
riot.tag('puzzle-page', '<header class="page collapsed"> <button class="back" onclick="{ back }" title="Back"></button> <h1>{ puzzle.metadata.title }</h1> <ul class="actions"> <li onclick="{ solve }" show="{ !puzzle.noSolution }"> <img src="img/compose.svg" alt="Solve" title="Solve"> <span>Solve</span> </li> <li onclick="{ check }" show="{ !puzzle.noSolution }"> <img src="img/tick@30.png" alt="Check" title="Check"> <span>Check</span> </li> <li onclick="{ reveal }" show="{ !puzzle.noSolution }"> <img src="img/reveal.svg" alt="Reveal" title="Reveal"> <span>Reveal</span> </li> <li if="{ !deleteMode }" onclick="{ decreaseFontSize }"> <img src="img/font-size-decrease.svg" alt="Smaller Font" title="Smaller Font"> <span>Smaller Font</span> </li> <li if="{ !deleteMode }" onclick="{ increaseFontSize }"> <img src="img/font-size-increase.svg" alt="Larger Font" title="Larger Font"> <span>Larger Font</span> </li> <li onclick="{ info }"> <img src="img/info.svg" alt="Info" title="Info"> <span>Info</span> </li> <li class="menu" onclick="{ collapse }"> <img src="img/navigation-menu.svg" alt="Menu" title="Menu"> <span>Menu</span> </li> </ul> </header> <div id="gridcontainer"> <table id="grid" class="{ solved: completion == 1 }"> <tr each="{ row, i in puzzle.grid }"><td each="{ cell, j in row }" class="{ parent.parent.gridClass(cell) }" id="{ \'r\' + i + \'c\' + j }"><span class="number" if="{ cell.number }">{ cell.number }</span><span class="letter">{ parent.parent.fill[i][j] }</span></td></tr> </table> <div id="Vscroll"></div> <div id="Hscroll"></div> </div> <section id="across" class="clues list"> <header>Across</header> <ul> <li each="{ enumerate(puzzle.across) }" id="{ \'across\' + n }" onclick="{ parent.clickClue(\'across\', n) }"> { n + ". " + clue } </li> </ul> </section> <section id="down" class="clues list"> <header>Down</header> <ul> <li each="{ enumerate(puzzle.down) }" id="{ \'down\' + n }" onclick="{ parent.clickClue(\'down\', n) }"> { n + ". " + clue } </li> </ul> </section>', function(opts) {
        var self = this;
        self.mixin("display");

        self.url = "";
        self.puzzle = null;
        self.fill = [];
        self.selr = 0;
        self.selc = 0;
        self.seldir = "across";
        self.fitzoom = 1;
        self.startzoom = 1;
        self.startoffset = [0, 0];
        self.gridzoom = 1;
        self.gridoffset = [0, 0];
        self.container = { X: 0, Y: 0, width: 0, height: 0 };
        self.gridSize = { width: 0, height: 0 };
        self.solved = false;

        self.transformName = (document.body.style.transform == "") ? "transform" : "webkitTransform";
        self.focuser = document.querySelector("#focuser");

        this.enumerate = function(list) {
            retval = []
            for (var k in list)
                if (list[k] !== null)
                    retval.push({"n": k, "clue": list[k]});
            return retval;
        }.bind(this);

        this.gridClass = function(cell) {
            var classes = [];
            if (cell.type == "block")
                classes.push("block");
            if (cell.across)
                classes.push("across" + cell.across);
            if (cell.down)
                classes.push("down" + cell.down);
            if (cell.shape)
                classes.push(cell.shape);
            return classes.join(" ");
        }.bind(this);

        this.setSeldir = function(dir) {
            if (!dir)
                dir = (self.seldir == "across") ? "down" : "across";
            self.seldir = dir;
            if (dir == "across") {
                self.across.classList.add("seldir");
                self.down.classList.remove("seldir");
            } else {
                self.across.classList.remove("seldir");
                self.down.classList.add("seldir");
            }
        }.bind(this);

        this.canChangeDir = function(dir) {
            return (self.puzzle.grid[self.selr][self.selc][dir] !== undefined);
        }.bind(this);

        function coordsFromID(id) {
            var coords = id.slice(1).split("c");
            return [parseInt(coords[0]), parseInt(coords[1])];
        }

        this.clickClue = function(dir, num) {
            return function (event) {
                event.preventUpdate = true;
                self.setSeldir(dir);
                var cells = document.querySelectorAll("." + dir + num);
                for (var i=0; i<cells.length; i++) {
                    var coords = coordsFromID(cells[i].id);
                    if (self.fill[coords[0]][coords[1]] == " ") {
                        self.selectCell(coords[0], coords[1]);
                        return;
                    }
                }
                var coords = coordsFromID(cells[0].id);
                self.selectCell(coords[0], coords[1]);
            };
        }.bind(this);

        this.clickCell = function(y, x) {
            if (self.selr == y && self.selc == x)
                self.setSeldir();
            self.selectCell(y, x);
        }.bind(this);

        function getCellEl(y, x, subel) {
            if (subel == null) subel = "";
            return document.querySelector("#r" + y + "c" + x + subel);
        }

        this.selectCell = function(y, x) {
            self.selr = y;
            self.selc = x;
            var across = self.puzzle.grid[y][x].across,
                down = self.puzzle.grid[y][x].down,
                styleClasses = ["selCell", "selCells", "selClue"];

            if (!across)
                self.setSeldir("down");
            else if (!down)
                self.setSeldir("across");

            for (var i=0; i<styleClasses.length; i++) {
                var els = document.querySelectorAll("." + styleClasses[i]);
                for (var j=0; j<els.length; j++)
                    els[j].classList.remove(styleClasses[i]);
            }

            var cell = getCellEl(y,x);
            cell.classList.add("selCell");
            var cells = document.querySelectorAll("." + self.seldir + ((self.seldir == "across") ? across : down));
            for (var i=0; i<cells.length; i++)
                cells[i].classList.add("selCells");
            var top = cells[0].offsetTop,
                left = cells[0].offsetLeft,
                bottom = cells[cells.length-1].offsetTop + cells[cells.length-1].offsetHeight,
                right = cells[cells.length-1].offsetLeft + cells[cells.length-1].offsetWidth;
            if (left < -self.gridoffset[1] / self.gridzoom || right > (self.container.width - self.gridoffset[1]) / self.gridzoom) {
                if (right - left < self.container.width / self.gridzoom)
                    self.gridoffset[1] = (self.container.width - self.gridzoom * (left + right))/2;
                else
                    self.gridoffset[1] = self.container.width / 2 -
                                         self.gridzoom * (cell.offsetLeft + cell.offsetWidth/2);
            }
            if (top < -self.gridoffset[0] / self.gridzoom || bottom > (self.container.height - self.gridoffset[0]) / self.gridzoom) {
                if (bottom - top < self.container.height / self.gridzoom)
                    self.gridoffset[0] = (self.container.height - self.gridzoom * (top + bottom))/2;
                else
                    self.gridoffset[0] = self.container.height / 2 -
                                         self.gridzoom * (cell.offsetTop + cell.offsetHeight/2);
            }
            self.fixView(true);

            var clues = document.querySelectorAll("#across" + across + ", #down" + down);
            for (var i=0; i<clues.length; i++) {
                var clue = clues[i];
                clue.classList.add("selClue");
                var parent = clue.offsetParent;
                if (clue.offsetTop < parent.scrollTop ||
                        clue.offsetTop + clue.offsetHeight > parent.scrollTop + parent.offsetHeight)
                    parent.scrollTop = clue.offsetTop + clue.offsetHeight/2 - parent.offsetHeight/2;
            }
        }.bind(this);

        this.checkSolved = function() {
            var tableClasses = self.grid.classList;
            tableClasses.remove("solved");
            self.solved = false;
            if (self.puzzle.noSolution)
                return;
            for (var i=0; i<self.puzzle.nrow; i++)
                for (var j=0; j<self.puzzle.ncol; j++)
                    if (self.puzzle.grid[i][j].solution && self.fill[i][j] != self.puzzle.grid[i][j].solution)
                        return;
            tableClasses.add("solved");
            self.solved = true;
        }.bind(this);

        this.checkAndSave = function() {
            self.checkSolved();
            database.putPuzzle(self.url, self.puzzle, self.fill, self.solved ? 1 : null);
        }.bind(this);

        this.insertLetter = function(v, y, x, skipcheck) {
            if (x == null) x = self.selc;
            if (y == null) y = self.selr;
            if (v == "solve") {
                if (self.puzzle.grid[y][x].solution)
                    v = self.puzzle.grid[y][x].solution;
                else
                    return;
            }
            self.fill[y][x] = v;
            var el = getCellEl(y, x, " .letter");
            el.textContent = v;
            el.classList.remove("error");
            if (!skipcheck)
                self.checkAndSave();
        }.bind(this);

        this.stepCoords = function(coords, dir) {
            var y = coords[0] + dir[0],
                x = coords[1] + dir[1];
            if (x >= self.puzzle.ncol) {
                x = 0;
                y += 1;
                if (y >= self.puzzle.nrow)
                    y = 0;
            } else if (x < 0) {
                x = self.puzzle.ncol - 1;
                y -= 1;
                if (y < 0)
                    y = self.puzzle.nrow - 1;
            }

            if (y >= self.puzzle.nrow) {
                y = 0;
                x += 1;
                if (x >= self.puzzle.ncol)
                    x = 0;
            } else if (y < 0) {
                y = self.puzzle.nrow - 1;
                x -= 1;
                if (x < 0)
                    x = self.puzzle.ncol - 1;
            }
            return [y, x];
        }.bind(this);

        this.moveCursor = function(dir, wrap) {
            var dx = (self.seldir == "across") ? dir : 0,
                dy = (self.seldir == "down") ? dir : 0,
                coords = self.stepCoords([self.selr, self.selc], [dy, dx]);
            while (self.puzzle.grid[coords[0]][coords[1]].type == "block") {
                coords = self.stepCoords(coords, [dy, dx]);
            }
            if (wrap || (coords[0] == self.selr + dy && coords[1] == self.selc + dx))
                self.selectCell(coords[0], coords[1]);
        }.bind(this);

        this.moveClue = function(dir) {
            var clue = document.querySelector("#" + self.seldir + " .selClue"),
                next = (dir > 0) ? clue.nextElementSibling : clue.previousElementSibling,
                event = new Event("click", {
                                      "view": window,
                                      "bubbles": true,
                                      "cancelable": true });
            if (next == null) {
                self.setSeldir();
                var clues = document.querySelectorAll("#" + self.seldir + " ul li");
                next = clues[(dir > 0) ? 0 : clues.length -1 ];
            }
            next.dispatchEvent(event);
        }.bind(this);

        this.setGeometry = function() {
            var containerEl = self.gridcontainer;

            self.container = { X: containerEl.offsetLeft, Y: containerEl.offsetTop,
                               width: containerEl.offsetWidth, height: containerEl.offsetHeight };
            self.gridSize = { width: self.grid.offsetWidth, height: self.grid.offsetHeight };
            while (containerEl = containerEl.offsetParent) {
                self.container.X += containerEl.offsetLeft;
                self.container.Y += containerEl.offsetTop;
            }

            self.fitzoom = Math.min(self.container.width / self.gridSize.width,
                                    self.container.height / self.gridSize.height);

            self.gridzoom = self.fitzoom;
            self.fixView();
        }.bind(this);

        this.fixView = function(animate) {
            if (animate)
                self.gridcontainer.classList.add("animate");
            else
                self.gridcontainer.classList.remove("animate");
            self.Vscroll.classList.remove("show");
            self.Hscroll.classList.remove("show");

            if (self.gridzoom < self.fitzoom)
                self.gridzoom = self.fitzoom;
            if (self.container.width >= self.gridSize.width * self.gridzoom) {
                self.gridoffset[1] = Math.round((self.container.width - self.gridSize.width * self.gridzoom)/2);
            } else {
                if (self.gridoffset[1] > 0)
                    self.gridoffset[1] = 0;
                if (self.gridoffset[1] < self.container.width - self.gridSize.width * self.gridzoom)
                    self.gridoffset[1] = Math.round(self.container.width - self.gridSize.width * self.gridzoom);
            }
            if (self.container.height >= self.gridSize.height * self.gridzoom) {
                self.gridoffset[0] = Math.round((self.container.height - self.gridSize.height * self.gridzoom)/2);
            } else {
                if (self.gridoffset[0] > 0)
                    self.gridoffset[0] = 0;
                if (self.gridoffset[0] < self.container.height - self.gridSize.height * self.gridzoom)
                    self.gridoffset[0] = Math.round(self.container.height - self.gridSize.height * self.gridzoom);
            }
            self.setTransform();
        }.bind(this);

        this.setTransform = function() {
            self.grid.style[self.transformName] =
                "matrix(" + self.gridzoom + ", 0, 0, " + self.gridzoom + ", " +
                self.gridoffset[1] + ", " + self.gridoffset[0] + ")";
            var Vstyle = self.Vscroll.style,
                Hstyle = self.Hscroll.style;
            Vstyle["height"] = self.container.height * self.container.height / (self.gridSize.height * self.gridzoom) + "px";
            Hstyle["width"] = self.container.width * self.container.width / (self.gridSize.width * self.gridzoom) + "px";
            Vstyle["top"] = -self.container.height * self.gridoffset[0] / (self.gridSize.height * self.gridzoom) + "px";
            Hstyle["left"] = -self.container.width * self.gridoffset[1] / (self.gridSize.width * self.gridzoom) + "px";
        }.bind(this);

        this.showScrolls = function() {
            self.Vscroll.classList.add("show");
            self.Hscroll.classList.add("show");
            document.body.offsetWidth; // Force layout, to allow for class change to take effect.
        }.bind(this);

        this.setStart = function() {
            self.startzoom = self.gridzoom;
            self.startoffset = self.gridoffset;
            self.gridcontainer.classList.remove("animate");
            self.showScrolls();
        }.bind(this);

        this.zoom = function(ratio, e) {
            var ctr = [e.pageY - self.container.Y, e.pageX - self.container.X];
            self.gridzoom = self.startzoom * ratio;
            self.gridoffset = [ratio * self.startoffset[0] + ctr[0] * (1 - ratio),
                               ratio * self.startoffset[1] + ctr[1] * (1 - ratio)];
        }.bind(this);

        this.decreaseFontSize = function(event) {
            event.preventUpdate = true;
            var newFontSize = self.calculateFontSize(-2)
            document.documentElement.style.fontSize = newFontSize + 'px'
            self.setGeometry()
        }.bind(this);

        this.increaseFontSize = function(event) {
            event.preventUpdate = true;
            var newFontSize = self.calculateFontSize(2)
            document.documentElement.style.fontSize = newFontSize + 'px'
            self.setGeometry()
        }.bind(this);

        this.calculateFontSize = function(change, defaultFontSize = 16, minFontSize = 4) {
            var oldFontSize = parseInt(document.documentElement.style.fontSize, 10)
            if (isNaN(oldFontSize) || (oldFontSize <= 0))
              oldFontSize = defaultFontSize
            var newFontSize = oldFontSize + change
            if (newFontSize < minFontSize)
              newFontSize = minFontSize
            return newFontSize
        }.bind(this);

        this.info = function(event) {
            event.preventUpdate = true;
            riot.route(encodeURI("info/" + (self.puzzle.metadata["title"] || "") +
                                 "~~~" + (self.puzzle.metadata["creator"] || "") +
                                 "~~~" + (self.puzzle.metadata["description"] || "") +
                                 "~~~" + (self.puzzle.metadata["copyright"] || "")));
        }.bind(this);

        this.reveal = function(event) {
            event.preventUpdate = true;
            self.insertLetter("solve");
            self.moveCursor(1, false);
        }.bind(this);

        this.check = function(event) {
            event.preventUpdate = true;
            self.grid.classList.add("checking");
            for (var i=0; i<self.puzzle.nrow; i++)
                for (var j=0; j<self.puzzle.ncol; j++)
                    if (self.fill[i][j] != self.puzzle.grid[i][j].solution && self.fill[i][j] != " ")
                        getCellEl(i, j, " .letter").classList.add("error");
            self.grid.offsetWidth; // Force layout, to allow for class change to take effect.
            self.grid.classList.remove("checking");
        }.bind(this);

        this.solve = function(event) {
            event.preventUpdate = true;
            for (var i=0; i<self.puzzle.nrow; i++)
                for (var j=0; j<self.puzzle.ncol; j++)
                    self.insertLetter("solve", i, j, true);
            self.checkAndSave();
        }.bind(this);

        this.back = function(event) {
            self.root.querySelector("header.page").classList.add("collapsed");
            self.close(event);
        }.bind(this);

        this.collapse = function(event) {
            event.preventUpdate = true;
            var classList = self.root.querySelector("header.page").classList;
            if (classList.contains("collapsed"))
                classList.remove("collapsed");
            else
                classList.add("collapsed");
        }.bind(this);

        this.loadDoc = function(surl, doc, sfill, completion) {
            self.url = surl;
            self.puzzle = doc;
            if (sfill == null) {
                self.fill = [];
                for (var i=0; i<self.puzzle.nrow; i++) {
                    self.fill[i] = [];
                    for (var j=0; j<self.puzzle.ncol; j++)
                        self.fill[i][j] = " ";
                }
            } else {
                self.fill = sfill;
            }

            self.selr = 0;
            self.selc = 0;
            self.setSeldir("across");
            while (self.puzzle.grid[self.selr][self.selc].type == "block")
                self.selc += 1;

            riot.route("loaded");
        }.bind(this);

        self.on("updated", function () {
            if (self.displayed) {
                self.checkAndSave();
                self.selectCell(self.selr, self.selc);
                self.setGeometry();
                self.focuser.focus();
            } else {
                self.focuser.blur();
            }
        });

        this.loadRemote = function(url, fn) {
            if (!fn)
                fn = url.split("/").slice(-1)[0];
            var ext = fn.slice(-3);
            var xhr = new XMLHttpRequest();
            var type = (ext == "puz") ? "arraybuffer" : "text";
            xhr.open("GET", url);
            xhr.responseType = type;

            xhr.onreadystatechange = function(e) {
                if (this.readyState == 4 ) {

                    if (this.status == 200 || url.slice(0, 4) == "file") {
                        var parser = new DOMParser();
                        var str = this.response;
                        var json, error;
                        switch (ext) {
                          case "xml":
                            var doc = parser.parseFromString(str.replace("&nbsp;", " "), "text/xml"),
                                rootname = doc.firstChild.nodeName;
                            if (rootname == "crossword-compiler" || rootname == "crossword-compiler-applet")
                                json = JPZtoJSON(doc);
                            else if (rootname == "crossword")
                                json = UClickXMLtoJSON(doc);
                            else
                                error = "Unknown format (" + rootname + ")";
                            break;

                          case "dat":
                            json = WSJtoJSON(str);
                            break;

                          case "txt":
                            json = KingTXTtoJSON(str, url);
                            break;

                          case "son":  // Actually json, but truncated by above
                            json = NYTtoJSON(str);
                            break;

                          case "puz":
                            json = PUZtoJSON(str);
                            if (typeof json == "string")
                                error = json;
                            break;

                          case "nwd":
                            json = NewsdaytoJSON(str);
                            break;

                          case "gdn":
                            json = GuardiantoJSON(str);
                            if (typeof json == "string")
                                error = json;
                            break;

                          default:
                            error = "Unknown format (" + ext + ")";
                        }
                        if (!error)
                            self.loadDoc(url, json);
                        else
                            self.loadError(url, error);
                    } else {
                        self.loadError(url, "Server status " + this.status);
                    }
                    if (url.slice(0, 4) == "blob")
                        window.URL.revokeObjectURL(url);
                }
            }
            xhr.send();
        }.bind(this);

        this.loadError = function(url, message) {
            riot.route(encodeURI("error/" + message + "~~~" + url));
        }.bind(this);

        this.loadURL = function(url, fn) {
            self.update({ puzzle: { across: [], down: [] } });  // Work around riot issue #925
            var puzzle = database.getPuzzle(url);
            if (puzzle)
                self.loadDoc(url, puzzle.puzzle, puzzle.fill, puzzle.completion);
            else
                self.loadRemote(url, fn);
        }.bind(this);

        document.addEventListener('keydown', function(e) {
            if (!self.displayed)
                return;

            if (e.keyCode == 229) // Returned by soft keyboard
                return;           // Let through and deal with in focuser input listener.
            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 32) { // space
                self.insertLetter(String.fromCharCode(e.keyCode));
                self.moveCursor(1, false);
            } else if (e.keyCode == 188) { // comma
                self.setSeldir();
                self.selectCell(self.selr, self.selc);
            } else if (e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 190) { // tab, enter, period
                self.moveClue(e.shiftKey != (e.keyCode == 190) ? -1 : 1);
            } else if (e.keyCode >= 37 && e.keyCode <= 40) { // left, up, right, down
                var dir = (e.keyCode % 2) ? "across" : "down";
                var inc = (e.keyCode < 39) ? -1 : 1;
                if (self.seldir != dir && self.fill[self.selr][self.selc] == " " && self.canChangeDir(dir)) {

                    self.setSeldir(dir);
                    self.selectCell(self.selr, self.selc);
                } else {

                    self.setSeldir(dir);
                    self.moveCursor(inc, true);
                }
            } else if (e.keyCode == 35 || e.keyCode == 36) { // end, home
                var clue = document.querySelector("#" + self.seldir + " .selClue"),
                    cells = document.querySelectorAll("." + clue.id),
                    cell = cells[(e.keyCode == 35) ? cells.length - 1 : 0],
                    coords = coordsFromID(cell.id);
                self.selectCell(coords[0], coords[1]);
            } else if (e.keyCode == 8) { // backspace
                if (self.fill[self.selr][self.selc] == " ")
                    self.moveCursor(-1, false);
                self.insertLetter(" ");
            } else {
                console.log(e.keyCode);
            }
            e.preventDefault();
        });

        self.focuser.addEventListener("blur", function (e) {
          if (self.displayed)
            e.target.focus();
        });

        var prevchar = "";
        document.querySelector("#focuser").addEventListener("input", function (e){
            var char = e.target.value.toUpperCase();
            if (char && char == prevchar && char != " ") {
                prevchar = "";
            } else {
                prevchar = char;
                if (char == ",") {
                    self.setSeldir();
                    self.selectCell(self.selr, self.selc);
                } else if (char == ".") {
                    self.moveClue(1);
                } else {
                    self.insertLetter(char);
                    self.moveCursor(1, false);
                }
            }
            e.target.value = "";
        });

        window.addEventListener("resize", function () {
            if (self.displayed)
                self.setGeometry();
        });

        self.gridcontainer.addEventListener("wheel", function (e) {
            var deltaY = (e.deltaY != undefined) ? e.deltaY : -e.wheelDeltaY
            self.setStart();
            if (deltaY > 0)
                self.zoom(1/1.1, e);
            if (deltaY < 0)
                self.zoom(1.1, e);
            e.preventDefault();
            self.fixView();
        });

        var hammer = Hammer(self.gridcontainer, { prevent_default: true });

        hammer.on("dragstart", self.setStart);
        hammer.on("drag", function (e) {
            self.gridoffset = [self.startoffset[0] + e.gesture.deltaY, self.startoffset[1] + e.gesture.deltaX];
            self.setTransform();
        });
        hammer.on("dragend", function (e) {
            self.fixView(true);
        });

        hammer.on("tap", function (e) {
            var el = e.target;
            while (!el.id)
                el = el.parentElement;
            var coords = coordsFromID(el.id);
            if (!isNaN(coords[0]) && !isNaN(coords[1]) && !el.classList.contains("block"))
                self.clickCell(coords[0], coords[1]);
        });

        hammer.on("transformstart", self.setStart);
        hammer.on("transform", function (e) {
            self.zoom(e.gesture.scale, e.gesture.center);
            self.setTransform();
        });
        hammer.on("transformend", function (e) {
            self.fixView(true);
        });

});
