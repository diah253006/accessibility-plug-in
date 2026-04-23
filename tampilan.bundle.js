(function () {

    const Images = {
        toggle(target = "body") {
            const el = document.querySelector(target);
            if (!el) return;

            el.classList.toggle("hide-images");

            if (window.speechSynthesis) {
                speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(
                    el.classList.contains("hide-images")
                        ? "Gambar disembunyikan"
                        : "Gambar ditampilkan"
                );
                msg.lang = "id-ID";
                speechSynthesis.speak(msg);
            }
        }
    };

    const Contrast = {
        toggle(target = "body") {
            const el = document.querySelector(target);
            if (!el) return;

            el.classList.toggle("high-contrast");

            if (window.speechSynthesis) {
                speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(
                    el.classList.contains("high-contrast")
                        ? "Kontras tinggi aktif"
                        : "Mode normal aktif"
                );
                msg.lang = "id-ID";
                speechSynthesis.speak(msg);
            }
        }
    };

    const Animation = {
        toggle(target = "body") {
            const el = document.querySelector(target);
            if (!el) return;

            el.classList.toggle("reduce-motion");

            if (window.speechSynthesis) {
                speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(
                    el.classList.contains("reduce-motion")
                        ? "Animasi dimatikan"
                        : "Animasi diaktifkan"
                );
                msg.lang = "id-ID";
                speechSynthesis.speak(msg);
            }
        }
    };

    const Mono = {
        toggle(target = "body") {
            const el = document.querySelector(target);
            if (!el) return;
    
            el.classList.toggle("monochrome");
    
            if (window.speechSynthesis) {
                speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(
                    el.classList.contains("monochrome")
                    ? "Monochrome diaktifkan"
                    : "Monochrome dimatikan"
                );
                msg.lang = "id-ID";
                speechSynthesis.speak(msg);
            }
        }
    };

    const Cursor = {
        toggle(target = "body") {
            const el = document.querySelector(target);
            if (!el) return;
    
            el.classList.toggle("big-cursor");
    
            if (window.speechSynthesis) {
                speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(
                    el.classList.contains("big-cursor")
                    ? "Big cursor diaktifkan"
                    : "Big cursor dimatikan"
                );
                msg.lang = "id-ID";
                speechSynthesis.speak(msg);
            }
        }
    };

    // EXPORT GLOBAL
    window.APR_IMAGES = Images;
    window.APR_CONTRAST = Contrast;
    window.APR_ANIMATION = Animation;
    window.APR_MONO = Mono;
    window.APR_CURSOR = Cursor;
    //window.APR_VISUAL = Mono;

    console.log("TAMPILAN CLEAN READY");

})();
