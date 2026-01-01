window.addEventListener("DOMContentLoaded", async () => {
    {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth();

        if (month === 0 && day >= 1 && day <= 3) {
            addNotification(
                "./originData/iconPacks/origin_icon/calendar.png",
                "calendar",
                "Happy New Year " + now.getFullYear() + "! 🎉🎉🎉",
                "app_none4"
            );
        }
    }
    // === hình nền đã lưu ===
    const wallpaperLock = localStorage.getItem("wallpaperLock");
    if (wallpaperLock) {
        document.documentElement.style.setProperty("--bg-wallpaperLock", wallpaperLock);
    }
    const wallpaperHome = localStorage.getItem("wallpaperHome");
    if (wallpaperHome) {
        document.documentElement.style.setProperty("--bg-wallpaperHome", wallpaperHome);
    }

    // === tên thiết bị đã lưu ===
    document.getElementById("rightBigTextNameDeviceInAbout").textContent =
        localStorage.getItem("rightBigTextNameDeviceInAbout") || "Click to rename";
    document.getElementById("phoneName").textContent = localStorage.getItem("phoneName") || "Click to rename";

    // === lấy các thông tin trong phần giới thiệu (ứng dụng cài đặt) ===
    let totalUsed = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            let value = localStorage.getItem(key);
            totalUsed += key.length + (value ? value.length : 0);
        }
    }
    let totalBytes = 5 * 1024 * 1024;
    let usedBytes = totalUsed;
    if (!isNaN(totalBytes) && !isNaN(usedBytes)) {
        document.getElementById("storage").textContent = formatSize(totalBytes);
        document.getElementById("storageUsed").textContent = formatSize(usedBytes);
    }

    if ("hardwareConcurrency" in navigator) {
        const cores = navigator.hardwareConcurrency;
        document.getElementById("CPUCore").textContent = cores + " cores";
    } else {
        document.getElementById("CPUCore").textContent = "Not supported";
    }

    // === Lấy thông tin GPU qua WebGL ===
    function getGPUInfo() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) {
            return "WebGL not supported";
        }

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return renderer;
        } else {
            return "Unavailable";
        }
    }

    const gpu = getGPUInfo();
    document.getElementById("GPU").textContent = gpu;
    document.getElementById("nameBrowser").textContent = navigator.userAgent;
    // === màn hình chào mừng khi lần đầu vào OriginWEB hoặc phiên bản mới ===
    if (localStorage.getItem("version") !== "2000") {
        if (localStorage.getItem("version") == null) {
            addNotification(
                "/originData/iconPacks/origin_icon/system_settings.png",
                "OriginWEB",
                "Welcome to OriginWEB V2.0.00 for the first time",
                "app_settings"
            );
        } else
            addNotification(
                "/originData/iconPacks/origin_icon/system_settings.png",
                "OriginWEB",
                "Welcome to OriginWEB V2.0.00",
                "app_settings"
            );
        localStorage.setItem("version", "2000");
    }

    // load clock app
    loadHTMLInto("#app_clock .appDisplay", "/appData/app_clock/html/html.html");
    loadHTMLInto("#app_calculator .appDisplay", "/appData/app_calculator/html/html.html");
    // === các function cần khi mở web ===
    loadAppLayout();
    cleanupEmptyScreens();
    buildDots();
    updateAppPositions();

    //showLockScreen();
    if (doubleTapOnOff) {
        lockScreen.addEventListener("click", powerOff2TapLockScreen);
        //scrollAppScreen.addEventListener("click", powerOff2TapHomeScreen);
    }

    scrollAppScreen.scrollBy({left: -10, behavior: "smooth"});

    //openApp(document.querySelector('[data-app="app_settings"]'));

    setTimeout(() => {
        unlockAnimWA();
    }, 500);

    // load from localstorage
    {
        // load dark mode
        if (localStorage.getItem("darkMode") == "1") {
            const element = document.getElementById("toggleDarkMode");
            element.classList.add("active");
            document.documentElement.style.setProperty("--bg-itemBackground", "#171717");
            document.documentElement.style.setProperty("--bg-appbackground", "#000");
            document.documentElement.style.setProperty("--bg-color", "white");
        } else {
            const element = document.getElementById("toggleDarkMode");
            element.classList.remove("active");
            document.documentElement.style.setProperty("--bg-itemBackground", "#fff");
            document.documentElement.style.setProperty("--bg-appbackground", "#eaeaea");
            document.documentElement.style.setProperty("--bg-color", "#000");
        }
    }
    {
        // load doubleTapOnOff
        if (localStorage.getItem("doubleTapOnOff") == "0") {
            const element = document.getElementById("toggle_doubleTapOnOff");
            element.classList.remove("active");
            doubleTapOnOff = 0;
        }
    }
    {
        // load hide icon text
        if (localStorage.getItem("hideIconText") == "1") {
            const element = document.getElementById("toggle_hideIconText");
            element.classList.add("active");
            phone.classList.add("hideIconText");
        }
    }
    {
        // load lock clock editor css variable
        const lockClockTranslate = localStorage.getItem("lockClockPosition");
        document.documentElement.style.setProperty("--bg-lockClockTranslate", lockClockTranslate);
        const el = document.querySelector(".lockContent.preview");
        if (lockClockTranslate) {
            let [x, y] = lockClockTranslate.split(" ");
            x = parseFloat(x);
            y = parseFloat(y);

            el._currentX = x;
            el._currentY = y;
            el.style.translate = `${x}px ${y}px`;
            document.documentElement.style.setProperty("--bg-lockClockTranslate", `${x}px ${y}px`);
        } else {
            el._currentX = 0;
            el._currentY = 0;
        }

        // load scale lock clock content
        const scaleLockContent = localStorage.getItem("scaleLockContent");
        document.documentElement.style.setProperty("--bg-scaleLockContent", scaleLockContent);
        const scaleLockClockValue = document.getElementById("scaleLockClockValue");
        const scaleLockClockSlider = document.getElementById("scaleLockClockSlider");
        if (scaleLockClockSlider) {
            scaleLockClockSlider.value = scaleLockContent;
        }
        if (scaleLockClockValue) {
            scaleLockClockValue.textContent = parseFloat(scaleLockContent).toFixed(2);
        }
    }
    {
        // load font weight lock clock
        const fontWeightLockClock = localStorage.getItem("fontWeightLockClock");
        document.documentElement.style.setProperty("--bg-fontWeightLockClock", fontWeightLockClock);
        const fontClockWeightValue = document.getElementById("fontClockWeightValue");
        const fontClockWeightSlider = document.getElementById("fontClockWeightSlider");
        if (fontClockWeightSlider) {
            fontClockWeightSlider.value = fontWeightLockClock;
        }
        if (fontClockWeightValue) {
            fontClockWeightValue.textContent = fontWeightLockClock;
        }
    }
    {
        // load color button medium wallpaper
        const urlImg = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-wallpaperLock")
        .trim()
        .replace(/url\(["']?(.*?)["']?\)/, "$1");

        colorMediumImg(urlImg).then((color) => {
            const finalColor = darkerOrBrighterColor(color, 0.5);
            document.getElementById("colorMediumWallpaperButton").style.backgroundColor = color;

            originColorWallpaperLock = color;
            darkerColorWallpaperLock = finalColor;

            wallpaperLockColorPre.style.cssText = `background: linear-gradient( ${darkerColorWallpaperLock}, ${originColorWallpaperLock});`;
            wallpaperOnStyle();
        });
    }

    {
        // load color lock clock
        const colorLockClock = localStorage.getItem("colorLockClock");
        document.documentElement.style.setProperty("--bg-colorLockClock", colorLockClock);
        const colorCircles = document.querySelectorAll("#app_SettingsAppLockEditor .colorCircle");
        colorCircles.forEach((colorCircle) => {
            if (colorCircle.style.backgroundColor === colorLockClock) {
                colorCircle.classList.add("active");
            }
        });
    }
    {
        // load font lock clock
        const fontLockClock = localStorage.getItem("fontLockClock");
        document.documentElement.style.setProperty("--bg-fontLockClock", fontLockClock);
        const allFontCircle = document.querySelectorAll("#app_SettingsAppLockEditor .fontCircle");
        allFontCircle.forEach((fontCircle) => {
            if (fontCircle.style.fontFamily === fontLockClock) {
                fontCircle.classList.add("active");
            }
        });
    }
    {
        // load opacity lock clock
        const opacityLockClock = localStorage.getItem("opacityLockClock");
        document.documentElement.style.setProperty("--bg-opacityLockClock", opacityLockClock);
        const opacityLockClockValue = document.getElementById("opacityLockClockValue");
        const opacityLockClockSlider = document.getElementById("opacityLockClockSlider");
        if (opacityLockClockSlider) opacityLockClockSlider.value = parseFloat(opacityLockClock);
        if (opacityLockClockValue) opacityLockClockValue.textContent = Math.round(parseFloat(opacityLockClock)) + "%";
    }
    {
        // load opacity lock clock
        const liquidOpacity = localStorage.getItem("liquidOpacity");
        document.documentElement.style.setProperty("--bg-liquidOpacity", liquidOpacity);
        const opacityLockClockSlider = document.getElementById("inputRangeLiquidOpacity");
        if (opacityLockClockSlider) opacityLockClockSlider.value = parseFloat(liquidOpacity);
    }
    {
        // camera btn saved
        const item = localStorage.getItem("appcamerabtn");
        if (item) {
            cameraBtn.dataset.appcamerabtn = item;
            const activeItem = document.querySelector(`[data-appforcamerabtn='${item}']`);
            if (activeItem) activeItem.classList.add("active");

            document
            .querySelector("#app_SettingsAppActionBtn .box .borderPhonePre .buttonPreview svg path")
            .setAttribute("d", activeItem.dataset.path);
        }
    }
    {
        // phone color
        document.documentElement.style.setProperty(
            "--bg-phoneColor",
            localStorage.getItem("colorPhone") ? localStorage.getItem("colorPhone") : "rgb(221, 221, 221)"
        );
    }
    {
        // turn blur off
        if (localStorage.getItem("turnBlurOff") == "1") {
            document.getElementById("blurAllApp").classList.add("displayN");
            document.getElementById("toggle_turnBlurOff").classList.remove("active");
        }
    }
    {
        // phone shadow saved
        if (localStorage.getItem("togglePhoneShadow") == "1") {
            phone.classList.add("phoneShadow");
            document.getElementById("togglePhoneShadow").classList.add("active");
        }
    }
    {
        // aod style saved
        const aodStyle = localStorage.getItem("aodStyle");
        if (aodStyle) {
            const activeItem = document.querySelector(`[data-style='${aodStyle}']`);
            if (activeItem) activeItem.classList.add("active");
            currentWallpaperOffStyle = allWallpaperOffStyle[aodStyle];
        }
    }

    {
        // turn off aod
        if (localStorage.getItem("turnAodOff") == "1") {
            {
                // toggle AOD on/off
                const el = document.getElementById("toggle_turnAodOff");
                el.classList.remove("active");
                phone.classList.add("aodOff");

                if (currentWallpaperOnStyle === allWallpaperOnStyle[1]) {
                    currentWallpaperOffStyle = allWallpaperOffStyle[1];
                } else {
                    currentWallpaperOffStyle = allWallpaperOffStyle[2];
                }

                document.querySelector("#app_SettingsAppAOD .horizontalScroll").classList.add("notWork");
            }
        }
    }

    {
        // load unlock animation
        const unlockAnimation = localStorage.getItem("unlockAnimation");
        if (unlockAnimation) {
            changeUnlockAnimStyle(unlockAnimation);
            const selectUnlockAnimation = document.querySelector(
                "#app_SettingsAppAnimation .select[name='unlockAnimation']"
            );
            const selectBoxs = selectUnlockAnimation.querySelector(".selectBoxs");
            selectBoxs.querySelector(".itemChild.active").classList.remove("active");
            selectBoxs.querySelectorAll(".itemChild").forEach((item) => {
                if (item.dataset.value === unlockAnimation) {
                    item.classList.add("active");
                    return;
                }
            });
        }
    }
    {
        // load liquid glass effect
        if (localStorage.getItem("turnLiquidOff") == "1") {
            const el = document.getElementById("toggle_turnLiquidOff");
            el.classList.remove("active");
            phone.classList.add("noLiquid");
            document.querySelector(".settingsItem[notWorkBy='toggle_turnLiquidOff']").classList.add("notWork");
        }
    }
    {
        // fingerprint toggle
        if (localStorage.getItem("fingerprint") == "1") {
            const el = document.getElementById("toggle_fingerprint");
            el.classList.add("active");
            fingerprintOnOff = 1;
            fingerBtn.classList.remove("displayN");
            document.getElementById("fingerBtn2").classList.remove("displayN");
            document.getElementById("ani_fingerprint").classList.remove("displayN");
        }
    }

    document.getElementById("passwordIn4").textContent =
        "password: " + (correctPassword !== "" ? correctPassword : "not set");
});

function formatSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
