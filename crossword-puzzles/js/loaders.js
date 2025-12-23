/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */

function JPZtoJSON(doc) {

    function intAttribute(obj, attr) {
        return parseInt(obj.getAttribute(attr));
    }

    function rangeAttribute(obj, attr) {
        var range = obj.getAttribute(attr).split("-");
        var arr = [];
        for (var i=parseInt(range[0]); i<=parseInt(range[1]); i++)
            arr.push(i);
        return arr;
    }

    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    metadata = doc.querySelectorAll("metadata *");
    for (var i=0; i<metadata.length; i++)
        retval.metadata[metadata[i].nodeName] = metadata[i].textContent;

    var grid = doc.querySelector("grid");
    retval.ncol = intAttribute(grid, "width");
    retval.nrow = intAttribute(grid, "height");
    for (var i=0; i<retval.nrow; i++)
        retval.grid[i] = [];

    var cells = doc.querySelectorAll("crossword cell");
    for (var i=0; i<cells.length; i++) {
        var cell = cells[i];
        // JPZ uses 1-indexing
        retval.grid[intAttribute(cell, "y")-1][intAttribute(cell, "x")-1] = {
            solution: cell.getAttribute("solution"),
            number: cell.getAttribute("number"),
            type: cell.getAttribute("type"),
            shape: cell.getAttribute("background-shape")
        };
        if (cell.getAttribute("type") != "block")
            retval.ncells += 1;
    }

    var clues = doc.querySelectorAll("crossword clues");
    var acrossClues = clues[0].querySelectorAll("clue");
    for (var i=0; i<acrossClues.length; i++) {
        var clue = acrossClues[i];
        var number = intAttribute(clue, "number");
        retval.across[number] = clue.textContent;
        var format = clue.getAttribute("format");
        if (format)
            retval.across[number] += " (" + format + ")";
        var word = doc.querySelector("word[id='" + clue.getAttribute("word") + "']");
        var x = rangeAttribute(word, "x");
        var y = intAttribute(word, "y");
        for (var j=0; j<x.length; j++)
            retval.grid[y-1][x[j]-1].across = number;
    }
    var downClues = clues[1].querySelectorAll("clue");
    for (var i=0; i<downClues.length; i++) {
        var clue = downClues[i];
        var number = intAttribute(clue, "number");
        retval.down[number] = clue.textContent;
        var format = clue.getAttribute("format");
        if (format)
            retval.down[number] += " (" + format + ")";
        var word = doc.querySelector("word[id='" + clue.getAttribute("word") + "']");
        var x = intAttribute(word, "x");
        var y = rangeAttribute(word, "y");
        for (var j=0; j<y.length; j++)
            retval.grid[y[j]-1][x-1].down = number;
    }

    return retval;
}

function UClickXMLtoJSON(doc) {

    function getValue(tagname) {
        var el = doc.querySelector(tagname);
        return el ? el.getAttribute("v") : null;
    }

    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    retval.metadata["title"] = getValue("Title");
    var ed = getValue("Editor");
    retval.metadata["creator"] = getValue("Author") + (ed ? " / Ed. " + getValue("Editor") : "");
    retval.metadata["copyright"] = getValue("Copyright");
    retval.metadata["description"] = getValue("Category");

    retval.ncol = parseInt(getValue("Width"));
    retval.nrow = parseInt(getValue("Height"));
    var letters = getValue("AllAnswer");
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            var letter = letters[i*retval.ncol + j];
            retval.grid[i][j] = {
                solution: (letter == "-") ? null : letter,
                type: (letter == "-") ? "block" : null
            };
            if (letter != "-")
                retval.ncells += 1;
        }
    }

    var acrossClues = doc.querySelectorAll("across *");
    for (var i=0; i<acrossClues.length; i++) {
        var clue = acrossClues[i];
        var number = parseInt(clue.getAttribute("cn"));
        retval.across[number] = decodeURIComponent(clue.getAttribute("c"));
        var n = parseInt(clue.getAttribute("n")) - 1,
            x = n % retval.nrow,
            y = Math.floor(n / retval.nrow),
            l = clue.getAttribute("a").length;
        retval.grid[y][x].number = number;
        for (var j=0; j<l; j++)
            retval.grid[y][x+j].across = number;
    }

    var downClues = doc.querySelectorAll("down *");
    for (var i=0; i<downClues.length; i++) {
        var clue = downClues[i];
        var number = parseInt(clue.getAttribute("cn"));
        retval.down[number] = decodeURIComponent(clue.getAttribute("c"));
        var n = parseInt(clue.getAttribute("n")) - 1,
            x = n % retval.nrow,
            y = Math.floor(n / retval.nrow),
            l = clue.getAttribute("a").length;
        retval.grid[y][x].number = number;
        for (var j=0; j<l; j++)
            retval.grid[y+j][x].down = number;
    }

    return retval;
}

function WSJtoJSON(str) {
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    var lines = str.split("\n"),
        size = lines[0].split("|"),
        about = lines[3].split("|");
    retval.metadata["title"] = about[0];
    retval.metadata["creator"] = about[1];

    // Not sure about the order here!
    retval.nrow = size[0];
    retval.ncol = size[1];
    var n = 1;
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            var letter = lines[1][i*retval.ncol + j];
            if (letter != "+") {
                retval.ncells += 1;
                retval.grid[i][j] = { solution: letter };
                if (j == 0 || retval.grid[i][j-1].type == "block") {
                    retval.grid[i][j].number = n++;
                    retval.grid[i][j].across = retval.grid[i][j].number;
                } else {
                    retval.grid[i][j].across = retval.grid[i][j-1].across;
                }
                if (i==0 || retval.grid[i-1][j].type == "block") {
                    if (!retval.grid[i][j].number)
                        retval.grid[i][j].number = n++;
                    retval.grid[i][j].down = retval.grid[i][j].number;
                } else {
                    retval.grid[i][j].down = retval.grid[i-1][j].down;
                }
            } else {
                retval.grid[i][j] = { type: "block" };
            }
        }
    }

    var clues = lines[2].split("|");
    for (var i=0; i<clues.length; i+=3) {
        if (clues[i+1])
            retval.across[parseInt(clues[i])] = clues[i+1];
        if (clues[i+2])
            retval.down[parseInt(clues[i])] = clues[i+2];
    }
    return retval;
}

function KingTXTtoJSON(str, url) {
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    // No metadata in this format, so make up a title from the URL
    var m = url.match(/clues\/(\w*)\/(\d{4})(\d{2})(\d{2}).txt/);
    if (m) {
        var name = { joseph: "Thomas Joseph", sheffer: "Eugene Sheffer", premier: "King Premier" }[m[1]],
            date = new Date(m[2] + "-" + m[3] + "-" + m[4]);
        // date is interpreted as midnight in UTC, but will print in current time zone, so shift it
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        retval.metadata["title"] = name + " Crossword—" + date.toDateString();
    } else {
        retval.metadata["title"] = url.split("/").slice(-1);
    }

    // Sometimes lines are split by \n, sometimes by \r\n...
    str = str.replace(/\r/g, "");
    var parts = str.split("{"),
        numbers = parts[1].split("|\n").map(function (s) {
            return s.trim().split(/ +/).map(function (n) {
                return parseInt(n);
            })
        }),
        letters = parts[2].split("|\n").map(function (s) {
            return s.trim().split(/ +/);
        });
    retval.nrow = numbers.length;
    retval.ncol = numbers[0].length;
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            if (numbers[i][j] != -1) {
                retval.ncells += 1;
                retval.grid[i][j] = {
                    solution: letters[i][j],
                    number: numbers[i][j] || null
                };
                if (j == 0 || retval.grid[i][j-1].type == "block") {
                    retval.grid[i][j].across = retval.grid[i][j].number;
                } else {
                    retval.grid[i][j].across = retval.grid[i][j-1].across;
                }
                if (i==0 || retval.grid[i-1][j].type == "block") {
                    retval.grid[i][j].down = retval.grid[i][j].number;
                } else {
                    retval.grid[i][j].down = retval.grid[i-1][j].down;
                }
            } else {
                retval.grid[i][j] = { type: "block" };
            }
        }
    }

    function separateClues(list) {
        return list.split("|\n").map(function (s) {
            var m = s.match(/([0-9]+)\. (.*\S)/);
            return [parseInt(m[1]), m[2]];
        });
    }
    var acrossClues = separateClues(parts[3]);
    for (var i=0; i<acrossClues.length; i++)
        retval.across[acrossClues[i][0]] = acrossClues[i][1];
    var downClues = separateClues(parts[4]);
    for (var i=0; i<downClues.length; i++)
        retval.down[downClues[i][0]] = downClues[i][1];
    return retval;
}

function NYTtoJSON(str) {
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    var nyt = JSON.parse(str).results[0];
    retval.metadata["title"] = "NYT " + nyt.puzzle_meta.publishType + "—" + nyt.puzzle_meta.printDate;
    retval.metadata["creator"] = nyt.puzzle_meta.author + " / Ed. " + nyt.puzzle_meta.editor;
    retval.metadata["copyright"] = nyt.puzzle_meta.copyright;
    retval.metadata["description"] = nyt.puzzle_meta.notes;

    retval.nrow = nyt.puzzle_meta.height;
    retval.ncol = nyt.puzzle_meta.width;
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            var letter = nyt.puzzle_data.answers[i*retval.ncol + j];
            retval.grid[i][j] = letter ? { solution: letter } : { type: "block" };
            if (letter)
                retval.ncells += 1;
        }
    }

    var elem = document.createElement("div");
    function entityDecode(input) {
        elem.innerHTML = input;
        return elem.childNodes[0].nodeValue;
    }
    var acrossClues = nyt.puzzle_data.clues.A;
    for (var i=0; i<acrossClues.length; i++) {
        var clue = acrossClues[i];
        retval.across[clue.clueNum] = entityDecode(clue.value);
        var x1 = clue.clueStart % retval.nrow,
            x2 = clue.clueEnd % retval.nrow,
            y = Math.floor(clue.clueStart / retval.nrow);
        retval.grid[y][x1].number = clue.clueNum;
        for (var x=x1; x<=x2; x++)
            retval.grid[y][x].across = clue.clueNum;
    }

    var downClues = nyt.puzzle_data.clues.D;
    for (var i=0; i<downClues.length; i++) {
        var clue = downClues[i];
        retval.down[clue.clueNum] = entityDecode(clue.value);
        var x = clue.clueStart % retval.nrow,
            y1 = Math.floor(clue.clueStart / retval.nrow),
            y2 = Math.floor(clue.clueEnd / retval.nrow);
        retval.grid[y1][x].number = clue.clueNum;
        for (var y=y1; y<=y2; y++)
            retval.grid[y][x].down = clue.clueNum;
    }
    return retval;
}

function PUZtoJSON(buffer) {
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    var bytes = new Uint8Array(buffer);
    
    retval.ncol = bytes[44];
    retval.nrow = bytes[45];
    if (!(bytes[50] == 0 && bytes[51] == 0))
        return "Cannot open scrambled PUZ file";
    
    var n = 1;
    var acrossN = [];
    var downN = [];
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            var letter = String.fromCharCode(bytes[52 + i*retval.ncol + j]);
            if (letter != ".") {
                retval.ncells += 1;
                retval.grid[i][j] = { solution: letter };
                if (j == 0 || retval.grid[i][j-1].type == "block") {
                    retval.grid[i][j].number = n++;
                    retval.grid[i][j].across = retval.grid[i][j].number;
                    acrossN.push(retval.grid[i][j].number);
                } else {
                    retval.grid[i][j].across = retval.grid[i][j-1].across;
                }
                if (i==0 || retval.grid[i-1][j].type == "block") {
                    if (!retval.grid[i][j].number)
                        retval.grid[i][j].number = n++;
                    retval.grid[i][j].down = retval.grid[i][j].number;
                    downN.push(retval.grid[i][j].number);
                } else {
                    retval.grid[i][j].down = retval.grid[i-1][j].down;
                }
            } else {
                retval.grid[i][j] = { type: "block" };
            }
        }
    }
    
    var ibyte = 52 + retval.ncol * retval.nrow * 2 - 1;
    function readString() {
        var retval = "";
        var b = bytes[++ibyte];
        while (b != 0 && ibyte < bytes.length) {
            retval += String.fromCharCode(b);
            b = bytes[++ibyte];
        }
        return retval;
    }
    
    retval.metadata["title"] = readString();
    retval.metadata["creator"] = readString();
    retval.metadata["copyright"] = readString();
    
    for (var i=1; i<n; i++) {
        if (acrossN[0] == i) {
            retval.across[i] = readString();
            acrossN.splice(0, 1);
        }
        if (downN[0] == i) {
            retval.down[i] = readString();
            downN.splice(0, 1);
        }
    }
    
    retval.metadata["description"] = readString();
    return retval;
}

function NewsdaytoJSON(str) {
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    var parts = str.split("\n\n");
    retval.metadata["title"] = parts[2];
    retval.metadata["creator"] = parts[3];

    // Not sure about the order here!
    retval.nrow = parts[5];
    retval.ncol = parts[4];
    var n = 1;
    var rows = parts[8].split("\n");
    var acrossN = [];
    var downN = [];
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            var letter = rows[i][j];
            if (letter != "#") {
                retval.ncells += 1;
                retval.grid[i][j] = { solution: letter };
                if (j == 0 || retval.grid[i][j-1].type == "block") {
                    retval.grid[i][j].number = n++;
                    retval.grid[i][j].across = retval.grid[i][j].number;
                    acrossN.push(retval.grid[i][j].number);
                } else {
                    retval.grid[i][j].across = retval.grid[i][j-1].across;
                }
                if (i==0 || retval.grid[i-1][j].type == "block") {
                    if (!retval.grid[i][j].number)
                        retval.grid[i][j].number = n++;
                    retval.grid[i][j].down = retval.grid[i][j].number;
                    downN.push(retval.grid[i][j].number);
                } else {
                    retval.grid[i][j].down = retval.grid[i-1][j].down;
                }
            } else {
                retval.grid[i][j] = { type: "block" };
            }
        }
    }

    var acrossClues = parts[9].split("\n");
    for (var i=0; i<acrossN.length; i++)
        retval.across[acrossN[i]] = acrossClues[i];
    var downClues = parts[10].split("\n");
    for (var i=0; i<downN.length; i++)
        retval.down[downN[i]] = downClues[i];

    return retval;
}


function GuardiantoJSON(str) {
    var parser = new DOMParser();
    try {
        var doc = parser.parseFromString(str, "text/html");
        var json = JSON.parse(doc.querySelector("div[data-crossword-data]")
                              .getAttribute("data-crossword-data"));
    } catch (error) {
        return "Could not find crossword puzzle on page.";
    }
    
    var retval = {
        metadata: {},
        grid: [],
        across: [],
        down: [],
        ncells: 0
    };
    retval.metadata["title"] = json.name;
    if (json.creator) {
        retval.metadata["creator"] = json.creator.name;
        retval.metadata["description"] = json.creator.webUrl;
    }
    
    retval.ncol = json.dimensions.cols;
    retval.nrow = json.dimensions.rows;
    var emptyCell = { type: "block" };
    for (var i=0; i<retval.nrow; i++) {
        retval.grid[i] = [];
        for (var j=0; j<retval.ncol; j++) {
            retval.grid[i][j] = emptyCell;
        }
    }
    
    for (var k in json.entries) {
        var entry = json.entries[k];
        retval[entry.direction][entry.number] = entry.clue;
        if (!entry.solution)
            retval.noSolution = true;
        
        var i = entry.position.y,
            j = entry.position.x,
            di = (entry.direction == "down") ? 1 : 0,
            dj = (entry.direction == "across") ? 1 : 0;
        for (var l=0; l<entry.length; l++) {
            if (retval.grid[i][j] === emptyCell) {
                retval.grid[i][j] = { solution: entry.solution ? entry.solution[l] : "" };
                retval.ncells += 1;
            }
            if (l == 0)
                retval.grid[i][j].number = entry.number;
            retval.grid[i][j][entry.direction] = entry.number;
            i += di;
            j += dj;
        }
    }
    
    return retval;
}
