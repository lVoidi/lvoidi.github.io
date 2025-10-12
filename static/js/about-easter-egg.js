// Easter Egg - Image Click Counter
(function () {
    const easterEggImg = document.getElementById('easterEggImage');
    let clickCount = 0;
    const maxClicks = 10;

    const redirectUrl = '/fate.html';

    if (!easterEggImg) return;

    easterEggImg.style.cursor = 'pointer';
    easterEggImg.style.transition = 'transform 0.2s ease, box-shadow 0.3s ease';

    easterEggImg.addEventListener('click', function (e) {
        e.preventDefault();
        clickCount++;

        this.style.transform = 'scale(1.1) rotate(' + (clickCount * 36) + 'deg)';


        const glowIntensity = 30 + (clickCount * 15);
        const glowOpacity = 0.3 + (clickCount * 0.07);
        this.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 68, 68, ${glowOpacity}), 
                                 0 0 ${glowIntensity * 1.5}px rgba(255, 68, 68, ${glowOpacity * 0.5})`;


        if (clickCount >= maxClicks) {
            triggerFlashbang();
            clickCount = 0;
        }
    });

    function triggerFlashbang() {

        const flashbang = document.createElement('div');
        flashbang.id = 'flashbang';
        flashbang.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: all;
        `;
        document.body.appendChild(flashbang);

        setTimeout(() => {
            flashbang.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
        setTimeout(() => {
            flashbang.remove();
        }, 1650);


    }
})();
