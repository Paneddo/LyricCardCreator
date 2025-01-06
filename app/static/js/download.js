function replaceFont(element) {
    return new Promise((resolve, reject) => {
        const fontNames = ['Sailec', 'Grotesk', 'Spotify'];

        let css = element.find('style').html();

        function fetchFont(fontName) {
            return new Promise((resolve, reject) => {
                const url = `/static/fonts/${fontName}.woff2`;
                const request = new XMLHttpRequest();
                request.open('get', url);
                request.responseType = 'blob';
                request.onloadend = () => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        css = css.replace(new RegExp(url), reader.result);
                        resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(request.response);
                };
                request.onerror = reject;
                request.send();
            });
        }

        const fontLoadingPromises = [];

        fontNames.forEach((fontName) => {
            fontLoadingPromises.push(fetchFont(fontName));
        });

        Promise.all(fontLoadingPromises)
            .then(() => {
                element.find('style').html(css);
                resolve(element);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function imageToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function downloadSVGasPNG() {
    let svgCard = await replaceFont($('#svg-card').clone());
    const imageSrc = $('#svg-card').find('image').attr('xlink:href');

    svgCard.find('image').attr('xlink:href', await imageToBase64(imageSrc));
    const svgStr = new XMLSerializer().serializeToString(svgCard[0]);
    console.log(svgStr);
    const svgData = `data:image/svg+xml;charset=utf8,${encodeURIComponent(
        svgStr
    )}`;
    const width = svgCard.attr('width') * 3;
    const height = svgCard.attr('height') * 3;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = svgData;
    canvas.width = width;
    canvas.height = height;

    image.onload = () => {
        context.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');

        const dlLink = document.createElement('a');

        const filename = document
            .getElementById('title')
            .textContent.toLowerCase();
        dlLink.download = filename.replace(/[^a-zA-Z0-9]/g, '') + '_card';
        dlLink.href = dataUrl;
        dlLink.dataset.downloadurl = [
            'image/png',
            dlLink.download,
            dlLink.href,
        ].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    };
}
