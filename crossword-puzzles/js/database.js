/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */

(function (self) {

    var db = localStorage["crosswords"] ? JSON.parse(localStorage["crosswords"]) :
                                          { puzzles: {}, inprogress: [], completed: [] };
    if (db.empty === undefined)
        db.empty = [];

    function saveDb() {
        localStorage["crosswords"] = JSON.stringify(db);
    }
    
    function deleteFromLists(url) {
        var i = db.inprogress.indexOf(url);
        if (i > -1)
            db.inprogress.splice(i, 1);
        i = db.completed.indexOf(url);
        if (i > -1)
            db.completed.splice(i, 1);
        i = db.empty.indexOf(url);
        if (i > -1)
            db.empty.splice(i, 1);
    }

    // Completion worked out from fill, but capped at 0.99.  Must pass 1 for full completion.
    self.putPuzzle = function (url, puzzle, fill, completion) {
        if (completion == null) {
            if (fill == null) {
                completion = 0;
            } else {
                var count = 0;
                for (var i=0; i<puzzle.nrow; i++)
                    for (var j=0; j<puzzle.ncol; j++)
                        if (fill[i][j] != " ")
                            count += 1;
                completion = Math.min(count/puzzle.ncells, puzzle.noSolution ? 1.0 : 0.99);
            }
        }
        var obj = { puzzle: puzzle, fill: fill, completion: completion };
        db.puzzles[url] = obj;

        deleteFromLists(url);
        if (completion == 1)
            db.completed.splice(0, 0, url);
        else if (completion > 0)
            db.inprogress.splice(0, 0, url);
        else
            db.empty.splice(0, 0, url);
        saveDb();
    }

    self.getPuzzle = function (url) {
        return db.puzzles[url];
    }

    self.EMPTY = 0
    self.INPROGRESS = 1
    self.COMPLETED = 2
    self.getPuzzleUrls = function (type) {
        switch (type) {
          case self.EMPTY:
            return db.empty;
          case self.INPROGRESS:
            return db.inprogress;
          case self.COMPLETED:
            return db.completed;
        }
    }

    self.deletePuzzles = function (urls) {
        for (var i in urls) {
            delete db.puzzles[urls[i]];
            deleteFromLists(urls[i]);
        }
        saveDb();
    }

})(window.database = window.database || {})
