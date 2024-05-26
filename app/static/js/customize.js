const colorThief = new ColorThief();
const colorPickerBackground = $('#colorPickerBG');
const colorPickerText = $('#colorPickerText');

function updateBackgroundColor() {
    var color = colorPickerBackground.val();
    $('#background').css({ fill: color });
}

function updateTextColor() {
    var color = colorPickerText.val();

    $('#svg-card text').css({ fill: color });
    $('#lyricsContainer').css({ color: color });
}

function updateColors() {
    const img = new Image();
    img.src = localStorage.getItem('imgB64');
    img.onload = () => {
        rgb = colorThief.getColor(img);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];

        colorPickerBackground.val(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
        colorPickerText.val(
            `#${toHex(255 - r)}${toHex(255 - g)}${toHex(255 - b)}`
        );
        updateBackgroundColor();
        updateTextColor();
    };
}

function toHex(n) {
    return n.toString(16).padStart(2, '0');
}
