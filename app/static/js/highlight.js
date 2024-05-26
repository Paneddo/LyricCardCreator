var lines = $('#lyrics > span');
var lyricsDiv = $('#svg-lyrics');
var startHeight = $('#svg-card').height();
var selectionRange = 1;
var clickedIndices = { min: -1, max: -1 };

function isWithinRange(index) {
    return (
        clickedIndices.max === -1 ||
        (index <= clickedIndices.max + selectionRange &&
            index >= clickedIndices.min - selectionRange)
    );
}

function isNotBorder(index) {
    return (
        clickedIndices.max !== -1 &&
        index > clickedIndices.min &&
        index < clickedIndices.max
    );
}

function updateRange(index, increase) {
    if (clickedIndices.max === -1) {
        clickedIndices = { min: index, max: index };
    } else if (increase) {
        clickedIndices = {
            min: Math.min(clickedIndices.min, index),
            max: Math.max(clickedIndices.max, index),
        };
    } else {
        if (index === clickedIndices.max) clickedIndices.max -= 1;
        if (index === clickedIndices.min) clickedIndices.min += 1;
        if (clickedIndices.min > clickedIndices.max) {
            clickedIndices = { min: -1, max: -1 };
        }
    }
}

var previouslyAddedLines = new Set();

function updateLyricsContainer() {
    var lyricsContainer = $('#svg-lyrics');
    lyricsContainer.empty();

    var lastAddedParagraph = null;
    var newlyAddedLines = new Set();

    lines.each(function (index, line) {
        if ($(line).hasClass('clicked')) {
            var lineText = $(line).text();
            var p = $('<p></p>').text(lineText);
            lyricsContainer.append(p);
            newlyAddedLines.add(lineText); // Track newly added lines

            // Only set lastAddedParagraph if it's a new line
            if (!previouslyAddedLines.has(lineText)) {
                lastAddedParagraph = p;
            }
        }
    });

    if (lastAddedParagraph) {
        lastAddedParagraph.css('opacity', 0); // Initial opacity for fade-in
        requestAnimationFrame(() => {
            lastAddedParagraph.css('opacity', 1);
        });
    }

    // Update previously added lines
    previouslyAddedLines = newlyAddedLines;

    adjustSVGHeight();
}

function adjustSVGHeight() {
    var svg = $('#svg-card');
    var height = lyricsDiv.height();
    svg.attr('height', height + startHeight);
}

function handleClick(index) {
    if (isWithinRange(index)) {
        if (isNotBorder(index)) return;

        $(lines[index]).toggleClass('clicked');
        updateRange(index, $(lines[index]).hasClass('clicked'));
    } else {
        lines.removeClass('clicked');
        $(lines[index]).addClass('clicked');
        clickedIndices = { min: index, max: index };
    }
    updateLyricsContainer();
}

function handleMouseOver(index) {
    if (
        clickedIndices.max === -1 ||
        (isWithinRange(index) && !$(lines[index]).hasClass('clicked'))
    ) {
        $(lines[index]).addClass('highlighted');
    }
}

function handleMouseOut(index) {
    $(lines[index]).removeClass('highlighted');
}

lines.each(function (index, line) {
    $(line).on('click', () => {
        handleClick(index);
    });
    $(line).on('mouseover', () => {
        handleMouseOver(index);
    });
    $(line).on('mouseout', () => {
        handleMouseOut(index);
    });
});
