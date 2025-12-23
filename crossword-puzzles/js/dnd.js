/* Copyright 2014-2015 Robert Schroll
 *
 * This file is part of Crosswords and is distributed under the terms
 * of the GPL. See the file LICENSE for full details.
 */

(function () {
    var counter = 0;

    function increment() {
        if (counter == 0)
            document.body.classList.add("dnd");
        counter += 1;
    }

    function decrement() {
        if (counter > 0)
            counter -= 1;
        if (counter == 0)
            document.body.classList.remove("dnd");
    }

    function doIfHasFiles(func) {
        return function (event) {
            for (var i in event.dataTransfer.types) {
                if (event.dataTransfer.types[i] == "Files") {
                    event.stopPropagation();
                    event.preventDefault();
                    if (func)
                        func(event);
                    return;
                }
            }
        }
    }

    document.addEventListener("dragenter", doIfHasFiles(increment));

    document.addEventListener("dragover", doIfHasFiles(), false);

    document.addEventListener("drop", doIfHasFiles(function (event) {
        decrement();
        var f = event.dataTransfer.files[0];
        riot.loadPuzzle(window.URL.createObjectURL(f), f.name, true);
    }));

    document.addEventListener("dragleave", doIfHasFiles(decrement));
})();
