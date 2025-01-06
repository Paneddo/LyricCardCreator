const colorThief = new ColorThief();
const colorPickerBackground = $('#colorPickerBG');
const colorPickerText = $('#colorPickerText');

function resetColors() {
    colorPickerBackground.val(backGroundColor);
    colorPickerText.val(textColor);
    updateBackgroundColor();
    updateTextColor();
}

function updateBackgroundColor() {
    var color = colorPickerBackground.val();
    $('#background').css({ fill: color });
}

function updateTextColor() {
    var color = colorPickerText.val();

    $('#svg-card text').css({ fill: color });
    $('#lyricsContainer').css({ color: color });
}

function initializeColors() {
    const img = new Image();
    img.src = localStorage.getItem('imgB64');
    img.onload = () => {
        rgb = colorThief.getColor(img);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];

        backGroundColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        textColor = `#${toHex(255 - r)}${toHex(255 - g)}${toHex(255 - b)}`;
        colorPickerBackground.val(backGroundColor);
        colorPickerText.val(textColor);
        updateBackgroundColor();
        updateTextColor();
    };
}

function toHex(n) {
    return n.toString(16).padStart(2, '0');
}

$(document).ready(async () => {
    initializeColors();
});
