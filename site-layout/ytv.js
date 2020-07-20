function resizeYoutubeIframe() {
    let container = document.getElementById('yvpContainer');
    let width = container.dataset.vw;
    let ratio = container.dataset.ratio.split(':');
    container.setAttribute('style', 'width: ' + width + '%;');
    let youTubePlayer = document.getElementById('ytv');
    youTubePlayer.width = container.offsetWidth;
    youTubePlayer.height = container.offsetWidth / parseInt(ratio[0]) * parseInt(ratio[1]);
}
resizeYoutubeIframe();

window.onresize = resizeYoutubeIframe;
