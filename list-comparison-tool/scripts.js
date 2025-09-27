var button = document.getElementById('compare');
var list1 = document.getElementById('list-1');
var list2 = document.getElementById('list-2');
var list3 = document.getElementById('list-3');
var list4 = document.getElementById('list-4');
var list5 = document.getElementById('list-5');
var list6 = document.getElementById('list-6');
var list7 = document.getElementById('list-7');
button.onclick = function () {
    if ($('#CaseSensitive').is(':checked')) {
        if ($('#deletespaces').is(':checked')) {
            var arr1 = list1.value.trim().replace(/\r\n/g, "\n").split("\n");
            var arr2 = list2.value.trim().replace(/\r\n/g, "\n").split("\n");
        } else {
            var arr1 = list1.value.replace(/\r\n/g, "\n").split("\n");
            var arr2 = list2.value.replace(/\r\n/g, "\n").split("\n");
        }

    } else {
        if ($('#deletespaces').is(':checked')) {
            var arr1 = list1.value.trim().toLowerCase().replace(/\r\n/g, "\n").split("\n");
            var arr2 = list2.value.trim().toLowerCase().replace(/\r\n/g, "\n").split("\n");
        } else {
            var arr1 = list1.value.toLowerCase().replace(/\r\n/g, "\n").split("\n");
            var arr2 = list2.value.toLowerCase().replace(/\r\n/g, "\n").split("\n");
        }
    }





    arr1 = arr1.filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
    arr2 = arr2.filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });

    let intersection = arr1.filter(x => arr2.includes(x));
    let difference = arr1.filter(x => !arr2.includes(x));
    let difference2 = arr2.filter(x => !arr1.includes(x));
    let difference3 = arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
    let summ = arr1.concat(arr2);

    const uniqueSumm = summ.filter((value, index) => {
        return summ.indexOf(value) === index;
    });

    list3.value = difference.join("\n");
    list4.value = difference2.join("\n");
    list5.value = intersection.join("\n");
    list6.value = uniqueSumm.join("\n");
    list7.value = difference3.join("\n");


    $([document.documentElement, document.body]).animate({
        scrollTop: $("#result-box").offset().top
    }, 1000);


};



jQuery(function ($) {
    $(document).ready(function() {

        $('.copy-button').click(function(){
            $(this).closest('.list-block__content').find('textarea').select();
            document.execCommand('copy');
        });

        $('.clear-button').click(function(){
            $(this).closest('.list-block__content').find('textarea').val('');
        });

$('.sort-button').click(function(){
   var textarea = $(this).closest('.list-block__content').find('textarea');
    var currentVal = textarea.val().split("\n");

    if ($(this).data('reverse') === undefined || $(this).data('reverse') === false) {
        currentVal.sort();
        $(this).data('reverse', true);
        $(this).find('span').text('Sort (Z-A)');
    } else {
        currentVal.sort().reverse();
        $(this).data('reverse', false);
        $(this).find('span').text('Sort (A-Z)');
    }

    textarea.val(currentVal.join("\n"));
});

$('.split-csv').click(function(){
    var textarea = $(this).closest('.list-block__content').find('textarea');
    var currentVal = textarea.val();

    var splitLines = currentVal.split(/[\s,;:]+/);

   textarea.val(splitLines.join("\n"));
});

$('.trim-spaces-duplicates').click(function() {
    var textarea = $(this).closest('.list-block__content').find('textarea');
    var currentVal = textarea.val();
    var lines = currentVal.split("\n");
    var trimmedLines = $.map(lines, function(line) {
        return line.trim();
    });
    var uniqueLines = [];
    $.each(trimmedLines, function(index, value) {
        if ($.inArray(value, uniqueLines) === -1) {
            uniqueLines.push(value);
        }
    });
    textarea.val(uniqueLines.join("\n"));
});

function countLinesAndDuplicates() {
    $('.list-block__content').each(function() {
        var contentBlock = $(this);
        var textarea = contentBlock.find('textarea');
        var currentVal = textarea.val();
        
        var lines = currentVal.split("\n").filter(function(line) {
            return line.trim() !== '';
        });
        
        var lineCounts = {};
        var duplicateCount = 0;

        lines.forEach(function(line) {
            var trimmedLine = line.trim();
            lineCounts[trimmedLine] = (lineCounts[trimmedLine] || 0) + 1;
        });

        Object.values(lineCounts).forEach(function(count) {
            if (count > 1) {
                duplicateCount += count - 1;
            }
        });

        var totalLines = lines.length;
        var uniqueLines = Object.keys(lineCounts).length;

        var countLineSpan = contentBlock.find('.count-line');
        
        var lineText = totalLines > 0 ? totalLines : 0;

        if (duplicateCount > 0) {
            lineText += ' (' + duplicateCount + ' duplicates)';
        }

        countLineSpan.text(lineText);
    });
}


$('textarea').on('input', function() {
    countLinesAndDuplicates();
});


$('button').click(function() {
    countLinesAndDuplicates();
});





    });
});

