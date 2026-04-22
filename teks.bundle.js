(function () {

    // =========================
    // TTS
    // =========================
    const TTS = {
        speech: null,

        start(target = "body") {
            this.stop();

            const el = document.querySelector(target);
            if (!el) return;

            const text = el.innerText.substring(0, 3000);
            if (!text) return;

            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = "id-ID";

            const voices = speechSynthesis.getVoices();
            const indo = voices.find(v => v.lang === "id-ID");
            if (indo) utter.voice = indo;

            speechSynthesis.cancel();
            speechSynthesis.speak(utter);
        },

        stop() {
            speechSynthesis.cancel();
        }
    };

    window.APR_TTS = TTS;

    // =========================
    // VOICE
    // =========================
    let recognition = null;

    const VOICE = {

        start() {
            if (!('webkitSpeechRecognition' in window)) return;

            recognition = new webkitSpeechRecognition();
            recognition.lang = "id-ID";
            recognition.continuous = true;

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();

                if (transcript.includes("scroll bawah")) {
                    window.scrollBy({ top: 500, behavior: 'smooth' });
                }

                if (transcript.includes("scroll atas")) {
                    window.scrollBy({ top: -500, behavior: 'smooth' });
                }

                if (transcript.includes("baca")) {
                    TTS.start();
                }

                if (transcript.includes("stop")) {
                    TTS.stop();
                }
            };

            recognition.start();
        },

        stop() {
            if (recognition) recognition.stop();
        }
    };

    window.APR_VOICE = VOICE;

    // =========================
    // ZOOM
    // =========================
    let zoomLevel = 1;

    const ZOOM = {
        in() {
            zoomLevel += 0.25;
            this.apply();
        },

        out() {
            zoomLevel = Math.max(1, zoomLevel - 0.25);
            this.apply();
        },

        reset() {
            zoomLevel = 1;
            this.apply();
        },

        apply() {
            document.body.style.transform = `scale(${zoomLevel})`;
            document.body.style.transformOrigin = "top left";
            document.body.style.width = (100 / zoomLevel) + "%";
        }
    };

    window.APR_ZOOM = ZOOM;

    // =========================
    // MAGNIFIER (SAFE)
    // =========================
    let active = false;
    let lens = null;

    const MAGNIFIER = {

        init() {
            lens = document.createElement("div");

            Object.assign(lens.style, {
                position: "fixed",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "2px solid #000",
                overflow: "hidden",
                pointerEvents: "none",
                display: "none",
                zIndex: "9999",
                background: "#fff"
            });

            document.body.appendChild(lens);
        },

        toggle() {
            active = !active;

            if (active) {
                lens.style.display = "block";
                document.addEventListener("mousemove", this.move);
            } else {
                lens.style.display = "none";
                document.removeEventListener("mousemove", this.move);
            }
        },

        move(e) {
            const x = e.clientX;
            const y = e.clientY;

            lens.style.left = (x - 75) + "px";
            lens.style.top = (y - 75) + "px";

            const element = document.elementFromPoint(x, y);
            if (!element || element === lens) return;

            lens.innerHTML = element.outerHTML;

            const inner = lens.firstChild;
            if (!inner) return; // 🔥 FIX

            inner.style.transform = "scale(2)";
            inner.style.transformOrigin = "center";
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        MAGNIFIER.init();
    });

    window.APR_MAGNIFIER = MAGNIFIER;

    console.log("TEKS CLEAN READY");

})();