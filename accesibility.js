(function () {

    console.log("ACCESSIBILITY CLEAN INIT");

    // =============================
    // GLOBAL STATE
    // =============================
    const STATE = {
        images: false,
        contrast: false,
        animationPaused: false,
        mono: false,
        cursor: false
    };
    window.APR_STATE = STATE;

    const BASE = "https://cdn.jsdelivr.net/gh/diah253006/accessibility-plug-in@latest/";

    // =============================
    // LOAD CSS
    // =============================
    const css = document.createElement("link");
    css.rel = "stylesheet";
    //css.href = "aksesibilitas.css";
    css.href = BASE + "aksesibilitas.css";

    css.onload = () => loadScripts();
    document.head.appendChild(css);

    // =============================
    // LOAD BUNDLES (NO DUPLICATE)
    // =============================
    function loadScripts() {
        //const scripts = [
        //    "bundle/tampilan1.bundle.js",
        //    "bundle/teks1.bundle.js"
        //];

        const scripts = [
            BASE + "tampilan.bundle.js",
            BASE + "teks.bundle.js"
        ];

        let loaded = 0;

        scripts.forEach(src => {
            const s = document.createElement("script");
            s.src = src;
            s.defer = true;

            s.onload = () => {
                loaded++;
                if (loaded === scripts.length) init();
            };

            document.body.appendChild(s);
        });
    }

    // =============================
    // INIT
    // =============================
    function init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", injectPanel);
        } else {
            injectPanel();
        }

        attachEventRouter();
    }

    // =============================
    // SINGLE EVENT ROUTER
    // =============================
    function attachEventRouter() {

        document.addEventListener("click", function (e) {

            const btn = e.target.closest("button");
            if (!btn || !btn.closest("#accessibilityPanel")) return;

            // ===== PANEL TOGGLE (FIX CLOSE BUTTON) =====
            if (btn.dataset.aprPanelToggle !== undefined) {
                const panel = document.getElementById("accessibilityPanel");
                if (panel) panel.classList.toggle("hide");
                return;
            }

            // ===== TAMPILAN =====

            if (btn.dataset.aprImages !== undefined) {
                window.APR_IMAGES.toggle();
            }

            if (btn.dataset.aprContrast !== undefined) {
                window.APR_CONTRAST.toggle();
            }

            if (btn.dataset.aprAnimation !== undefined) {
                window.APR_ANIMATION.toggle();
            }

            if (btn.dataset.aprMonochrome !== undefined) {
                window.APR_MONO.toggle();
            }

            if (btn.dataset.aprCursor !== undefined) {
                window.APR_CURSOR.toggle();
            }

            // ===== FONT =====
            if (btn.dataset.aprFont) {
                const type = btn.dataset.aprFont;
                document.body.classList.remove("font-sans", "font-serif", "font-dyslexic");

                if (type !== "default") {
                    document.body.classList.add("font-" + type);
                }
                return;
            }

            if (btn.dataset.aprFontIncrease !== undefined) {
                changeFontSize(2);
                return;
            }

            if (btn.dataset.aprFontDecrease !== undefined) {
                changeFontSize(-2);
                return;
            }

            // ===== TEXT ALIGNMENT =====
            if (btn.dataset.aprAlign) {
                document.body.style.textAlign = btn.dataset.aprAlign;
                return;
            }

            // ===== SPACING =====
            if (btn.dataset.aprWord) {
                document.body.style.wordSpacing = btn.dataset.aprWord + "px";
                return;
            }

            if (btn.dataset.aprLine) {
                document.body.style.lineHeight = btn.dataset.aprLine;
                return;
            }

            if (btn.dataset.aprLetter) {
                document.body.style.letterSpacing = btn.dataset.aprLetter + "px";
                return;
            }

            if (btn.dataset.aprSpacingReset !== undefined) {
                document.body.style.lineHeight = "";
                document.body.style.letterSpacing = "";
                return;
            }

            // ===== TTS =====
            if (btn.dataset.aprTts !== undefined) {
                window.APR_TTS?.start("body");
                return;
            }

            if (btn.dataset.aprTtsStop !== undefined) {
                window.APR_TTS?.stop();
                return;
            }

            // ===== VOICE =====
            if (btn.dataset.aprVoice !== undefined) {
                window.APR_VOICE?.start();
                return;
            }

            if (btn.dataset.aprVoiceStop !== undefined) {
                window.APR_VOICE?.stop();
                return;
            }

            // ===== ZOOM =====
            if (btn.dataset.aprZoomIn !== undefined) {
                window.APR_ZOOM?.in();
                return;
            }

            if (btn.dataset.aprZoomOut !== undefined) {
                window.APR_ZOOM?.out();
                return;
            }

            if (btn.dataset.aprZoomReset !== undefined) {
                window.APR_ZOOM?.reset();
                return;
            }

            // ===== MAGNIFIER =====
            if (btn.dataset.aprMagnifier !== undefined) {
                toggleMagnifier();
                return;
            }
            // ===== RESET ALL =====
            if (btn.dataset.aprResetAll !== undefined) {

                document.body.classList.remove(
                    "hide-images",
                    "high-contrast",
                    "reduce-motion",
                    "monochrome",
                    "big-cursor",
                    "font-sans",
                    "font-serif",
                    "font-dyslexic"
                );
            
                document.body.style.fontSize = "";
                document.body.style.lineHeight = "";
                document.body.style.letterSpacing = "";
                document.body.style.wordSpacing = "";
                document.body.style.textAlign = "";
            
                return;
            }

        });
    }

    // =============================
    // HELPERS
    // =============================
    function speak(text) {
        if (!window.speechSynthesis) return;

        speechSynthesis.cancel(); // 🔥 anti numpuk

        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "id-ID";
        speechSynthesis.speak(msg);
    }

    function changeFontSize(delta) {
        const size = parseInt(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (size + delta) + "px";
    }

    // =============================
    // SIMPLE MAGNIFIER (STABLE)
    // =============================
    let zoomActive = false;

    function toggleMagnifier() {
        zoomActive = !zoomActive;

        if (zoomActive) {
            //document.body.style.transform = "scale(1.5)";

            //=========================
            let fontScale = 100;

            function applyZoom() {
                document.documentElement.style.fontSize = fontScale + "%";
            }

            window.APR_ZOOM = {
                in() {
                    fontScale += 10;
                    applyZoom();
                },
                out() {
                    fontScale = Math.max(80, fontScale - 10);
                    applyZoom();
                },
                reset() {
                    fontScale = 100;
                    applyZoom();
                }
            };
            //=========================

            document.body.style.transformOrigin = "0 0";
        } else {
            document.body.style.transform = "";
        }
    }

    // =============================
    // PANEL UI
    // =============================
    function injectPanel() {

        const panel = document.createElement("div");
        panel.id = "accessibilityPanel";
        panel.className = "apr-1303223025-panel hide";

        panel.innerHTML = `
        <div class="apr-header">
            <span>Aksesibilitas</span>
            <button data-apr-panel-toggle>✖</button>
        </div>

        <div class="apr-section">
            <h4>Tampilan</h4>
            <button data-apr-images> 🖼️ Gambar</button>
            <button data-apr-contrast> 🌗 Contrast</button>
            <button data-apr-animation> ⏸ Animasi</button>
            <button data-apr-monochrome> ⚫ Mono</button>
            <button data-apr-cursor> 🖱️ Cursor</button>
        </div>

        <div class="apr-section">
            <h4>Teks</h4>
            <button data-apr-font-increase>+</button>
            <button data-apr-font-decrease>-</button>
            <button data-apr-font="default">Default</button>
            <button data-apr-font="sans">Sans</button>
            <button data-apr-font="serif">Serif</button>
            <button data-apr-font="dyslexic">Dyslexic</button>
        </div>

        <div class="apr-section">
            <h4>Alignment</h4>
            <button data-apr-align="left">Left</button>
            <button data-apr-align="center">Center</button>
            <button data-apr-align="right">Right</button>
            <button data-apr-align="justify">Justify</button>
        </div>

        <div class="apr-section">
            <h4>Spacing</h4>
            <button data-apr-word="2">Word Spacing</button>
            <button data-apr-line="1">1x</button>
            <button data-apr-line="1.5">1.5x</button>
            <button data-apr-line="2">2x</button>
            <button data-apr-spacing-reset>Normal</button>
            <button data-apr-letter="2">Lebar</button>
        </div>

        <div class="apr-section">
            <h4>Aksesibilitas</h4>
            <button data-apr-tts>Baca</button>
            <button data-apr-tts-stop>Stop baca</button>
            <button data-apr-voice>Voice</button>
            <button data-apr-voice-stop>Stop Voice</button>
            <button data-apr-zoom-in>Zoom +</button>
            <button data-apr-zoom-out>Zoom -</button>
            <button data-apr-zoom-reset>Reset Zoom</button>
            <button data-apr-magnifier>Magnifier</button>
        </div>

        <div class="apr-section">
            <h4>Reset</h4>
            <button data-apr-reset-all>Reset Semua</button>
        </div>
        `;

        document.body.appendChild(panel);

        const tab = document.createElement("div");
        tab.id = "accessibilityTab";
        tab.className = "apr-1303223025-tab";
        tab.innerHTML = "♿";

        document.body.appendChild(tab);

        tab.addEventListener("click", () => {
            panel.classList.toggle("hide");
        });
    }

})();
