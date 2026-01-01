const allApp = document.getElementById("allAppIconScreen");
const wallpaperHome = document.getElementById("wallpaperHome");

let timeOutClosingApp = [];
let timeOutOpeningApp = [];
let currentOpeningElApp = null;
let currentOpeningEl = null;

let scriptForCloseApp = function () {};
function addScriptForCloseApp(script) {
    scriptForCloseApp = script;
    closeApp = function () {
        if (currentOpeningEl.parentElement != currentAppScreen) {
            if (currentOpeningEl.parentElement.id != "favApp") {
                closeAppToCenter();
                return;
            }
        }
        const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

        currentOpeningElApp.style.transition = ``;
        currentOpeningElApp.style.transform = ``;
        const appel = currentOpeningElApp;
        const el = currentOpeningEl;

        currentOpeningElApp = null;
        currentOpeningEl = null;

        allApp.classList.remove("open");
        wallpaperHome.classList.remove("open");
        appel.classList.remove("open");

        clearTimeout(timeOutOpeningApp[appel.id]);
        timeOutOpeningApp[appel.id] = null;

        appel.style.pointerEvents = "";

        timeOutClosingApp[appel.id] = setTimeout(() => {
            appDisplay.style.display = "";
            el.classList.remove("hidden");
            appel.style.opacity = "";
            timeOutClosingApp[appel.id] = null;
            scrollAppScreen.style.pointerEvents = "";
            removeScript(`/appData/${appel.id}/js/open/open.js`);
            runScript(`/appData/${appel.id}/js/close/close.js`);
        }, 800 * speed);
        scriptForCloseApp();
        closeApp = function () {
            if (currentOpeningEl.parentElement != currentAppScreen) {
                if (currentOpeningEl.parentElement.id != "favApp") {
                    closeAppToCenter();
                    return;
                }
            }
            const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

            currentOpeningElApp.style.transition = ``;
            currentOpeningElApp.style.transform = ``;
            const appel = currentOpeningElApp;
            const el = currentOpeningEl;

            currentOpeningElApp = null;
            currentOpeningEl = null;

            allApp.classList.remove("open");
            wallpaperHome.classList.remove("open");
            appel.classList.remove("open");

            clearTimeout(timeOutOpeningApp[appel.id]);
            timeOutOpeningApp[appel.id] = null;

            appel.style.pointerEvents = "";

            timeOutClosingApp[appel.id] = setTimeout(() => {
                appDisplay.style.display = "";
                el.classList.remove("hidden");
                appel.style.opacity = "";
                timeOutClosingApp[appel.id] = null;
                scrollAppScreen.style.pointerEvents = "";
                removeScript(`/appData/${appel.id}/js/open/open.js`);
                runScript(`/appData/${appel.id}/js/close/close.js`);
            }, 800 * speed);
        };
    };
}

function openApp(el) {
    currentOpeningEl = el;
    currentOpeningElApp = document.getElementById(currentOpeningEl.dataset.app);
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    currentOpeningElApp.style.transition = ``;

    allApp.classList.add("open");
    wallpaperHome.classList.add("open");
    currentOpeningElApp.classList.add("open");

    appDisplay.style.display = "flex";

    currentOpeningEl.classList.add("hidden");
    scrollAppScreen.style.pointerEvents = "none";

    clearTimeout(timeOutClosingApp[currentOpeningElApp.id]);
    timeOutClosingApp[currentOpeningElApp.id] = null;

    const appel = currentOpeningElApp;
    timeOutOpeningApp[currentOpeningElApp.id] = setTimeout(() => {
        appel.style.pointerEvents = "auto";
        timeOutOpeningApp[appel.id] = null;
    }, 400 * speed);

    removeScript(`/appData/${currentOpeningEl.dataset.app}/js/close/close.js`);
    runScript(`/appData/${currentOpeningEl.dataset.app}/js/open/open.js`);
}

let scaleAllAppReverse = 1 / 0.86;
function closeApp() {
    if (isVisuallyInsidePhone(currentOpeningEl.parentElement)) {
        closeAppToCenter();
        return;
    }
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    currentOpeningElApp.style.transition = ``;
    currentOpeningElApp.style.transform = ``;
    const appel = currentOpeningElApp;
    const el = currentOpeningEl;

    currentOpeningElApp = null;
    currentOpeningEl = null;

    allApp.classList.remove("open");
    wallpaperHome.classList.remove("open");
    appel.classList.remove("open");

    clearTimeout(timeOutOpeningApp[appel.id]);
    timeOutOpeningApp[appel.id] = null;

    appel.style.pointerEvents = "";

    timeOutClosingApp[appel.id] = setTimeout(() => {
        appDisplay.style.display = "";
        el.classList.remove("hidden");
        appel.style.opacity = "";
        timeOutClosingApp[appel.id] = null;
        scrollAppScreen.style.pointerEvents = "";
        removeScript(`/appData/${appel.id}/js/open/open.js`);
        runScript(`/appData/${appel.id}/js/close/close.js`);
    }, 700 * speed);
}
function closeAppToCenter() {
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    currentOpeningElApp.style.transition = `all 0s 0.4s, opacity 0s 0s`;
    currentOpeningElApp.style.transform = ``;
    const appel = currentOpeningElApp;
    const el = currentOpeningEl;

    currentOpeningElApp = null;
    currentOpeningEl = null;

    allApp.classList.remove("open");
    wallpaperHome.classList.remove("open");

    clearTimeout(timeOutOpeningApp[appel.id]);
    timeOutOpeningApp[appel.id] = null;

    appel.style.pointerEvents = "";
    appel.style.opacity = "";
    el.classList.remove("hidden");

    appel.anim = appel.animate(
        [
            {transform: getComputedStyle(appel).transform},
            {opacity: 1},
            {
                transform: "translateY(-150px) scale(0.01)",
                opacity: 0,
            },
        ],
        {
            duration: 400 * speed,
            composite: "replace",
        }
    );

    appel.anim.onfinish = () => {
        appDisplay.style.display = "";

        appel.classList.remove("open");
        scrollAppScreen.style.pointerEvents = "";
        removeScript(`/appData/${appel.id}/js/open/open.js`);
        runScript(`/appData/${appel.id}/js/close/close.js`);

        appel.anim.onfinish = null;
        appel.anim = null;
    };
}

function isVisuallyInsidePhone(el) {
    const e = el.getBoundingClientRect();
    return !(
        e.left >= phoneRect.left &&
        e.top >= phoneRect.top &&
        e.right <= phoneRect.right &&
        e.bottom <= phoneRect.bottom
    );
}

function updateTransform(y, x) {
    y = Math.max(0, y);
    y = Math.min(140, y);

    currentOpeningElApp.style.transition = `all 0.08s`;
    currentOpeningElApp.style.transform = `translateX(${x}px) translateY(${-y}px) scale(${1 - y / 280})`;
}

function resetpop() {
    currentOpeningElApp.style.transition = `all 0.4s`;
    currentOpeningElApp.style.transform = ``;
}

let startY = 0;
let startX = 0;
let deltaY = 0;
let deltaX = 0;
let dragging = false;

nav.addEventListener("touchstart", (e) => {
    if (!currentOpeningElApp) return;
    currentOpeningEl.classList.add("hidden");
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;

    deltaY = 0;
    deltaX = 0;
});

nav.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        if (!currentOpeningElApp) return;
        deltaY = startY - e.touches[0].clientY;
        deltaX = e.touches[0].clientX - startX;
        updateTransform(deltaY, deltaX);
    },
    {
        passive: false,
    }
);

nav.addEventListener("touchend", () => {
    if (!currentOpeningElApp) return;
    if (deltaY > 40) closeApp();
    else resetpop();
    deltaY = 0;
    deltaX = 0;
});

nav.addEventListener("mousedown", (e) => {
    deltaY = 0;
    deltaX = 0;
    startY = 0;
    startX = 0;

    if (!currentOpeningElApp) return;
    currentOpeningElApp.style.pointerEvents = "none";
    currentOpeningEl.classList.add("hidden");
    dragging = true;
    startY = e.clientY;
    startX = e.clientX;
});

window.addEventListener("mousemove", (e) => {
    if (!dragging || !currentOpeningElApp) return;
    deltaY = startY - e.clientY;
    deltaX = e.clientX - startX;
    updateTransform(deltaY, deltaX);
});

window.addEventListener("mouseup", () => {
    if (!dragging || !currentOpeningElApp) return;
    currentOpeningElApp.style.pointerEvents = "all";
    dragging = false;
    if (deltaY > 40) closeApp();
    else resetpop();
});

// Lưu animation hiện tại theo id app
const appAnimations = {};

function closeAppToCenterWithScript(script) {
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    currentOpeningElApp.style.transition = `all 0s 0.4s, opacity 0s 0s`;
    currentOpeningElApp.style.transform = ``;
    const appel = currentOpeningElApp;
    const el = currentOpeningEl;

    currentOpeningElApp = null;
    currentOpeningEl = null;

    allApp.classList.remove("open");
    wallpaperHome.classList.remove("open");

    clearTimeout(timeOutOpeningApp[appel.id]);
    timeOutOpeningApp[appel.id] = null;

    appel.style.pointerEvents = "";
    appel.style.opacity = "";
    el.classList.remove("hidden");

    const anim = appel.animate(
        [
            {transform: getComputedStyle(appel).transform},
            {opacity: 1},
            {
                transform: "translateY(-150px) scale(0.01)",
                opacity: 0,
            },
        ],
        {
            duration: 400 * speed,
            easing: "ease-out",
            composite: "replace",
        }
    );

    anim.onfinish = () => {
        appDisplay.style.display = "";

        appel.classList.remove("open");
        scrollAppScreen.style.pointerEvents = "";
        removeScript(`/appData/${appel.id}/js/open/open.js`);
        runScript(`/appData/${appel.id}/js/close/close.js`);

        script();
    };
}

function closeAppToLeft() {
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    // Nếu app đang có animation mở -> cancel

    currentOpeningElApp.style.transition = `all 0s`;
    currentOpeningElApp.style.transform = ``;
    const appel = currentOpeningElApp;
    const el = currentOpeningEl;

    currentOpeningElApp = null;
    currentOpeningEl = null;

    allApp.classList.remove("open");
    wallpaperHome.classList.remove("open");

    clearTimeout(timeOutOpeningApp[appel.id]);
    timeOutOpeningApp[appel.id] = null;

    appel.style.pointerEvents = "";
    appel.style.opacity = "";
    el.classList.remove("hidden");
    const animAPI = appAnimations[appel.id];

    const anim = appel.animate(
        [
            {transform: getComputedStyle(appel).transform},
            {opacity: 1},
            {transform: "translateX(-100%) scale(0.8)", opacity: 1},
        ],
        {
            duration: 400 * speed,
            easing: "ease-out",
        }
    );
    if (animAPI) {
        animAPI.cancel();
    }

    // Lưu animation vào object
    appAnimations[appel.id] = anim;

    anim.onfinish = () => {
        appDisplay.style.display = "";
        appel.classList.remove("open");
        scrollAppScreen.style.pointerEvents = "";
        removeScript(`/appData/${appel.id}/js/open/open.js`);
        runScript(`/appData/${appel.id}/js/close/close.js`);

        // Xoá animation đã xong
        delete appAnimations[appel.id];
    };
}

function openAppByID(idApp) {
    if (isLock) {
        showPasswordScreen(() => {
            hiddenLockScreen();
            openAppByID(idApp);
        }, `Enter password to open ${document.querySelector(`[data-app='${idApp}'] label`).textContent.trim()} app`);
        return;
    }
    const alreadyOpen1 = !currentOpeningElApp;
    const alreadyOpen = currentOpeningElApp && currentOpeningElApp.id != idApp;
    if (alreadyOpen) {
        closeAppToLeft();
    }

    currentOpeningElApp = document.getElementById(idApp);
    currentOpeningEl = document.querySelector(`[data-app='${idApp}']`);
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    // Nếu app đang có animation đóng -> cancel

    currentOpeningElApp.style.transition = `none`;

    allApp.classList.add("open");
    wallpaperHome.classList.add("open");
    currentOpeningElApp.classList.add("open");

    appDisplay.style.display = "flex";

    currentOpeningEl.classList.add("hidden");
    scrollAppScreen.style.pointerEvents = "none";

    clearTimeout(timeOutClosingApp[currentOpeningElApp.id]);
    timeOutClosingApp[currentOpeningElApp.id] = null;

    const appel = currentOpeningElApp;
    appel.style.pointerEvents = "auto";

    const animAPI = appAnimations[appel.id];

    if (alreadyOpen) {
        const anim = appel.animate(
            [
                {transform: "translateX(330px) scale(0.8)"},
                {transform: "translateX(200px) scale(0.8)"},
                {transform: "translateX(100px) scale(0.85)"},
                {transform: "scale(1)"},
            ],
            {
                duration: 400 * speed,
                easing: "ease-out",
            }
        );
        appAnimations[appel.id] = anim;

        const temp = currentOpeningEl;
        anim.onfinish = () => {
            removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
            runScript(`/appData/${temp.dataset.app}/js/open/open.js`);

            // Xoá animation đã xong
            delete appAnimations[appel.id];
        };
    } else {
        if (alreadyOpen1) {
            const anim = appel.animate([{transform: "scale(0.6)", opacity: 0}, {opacity: 1}, {transform: "scale(1)"}], {
                duration: 400 * speed,
                easing: "ease",
                composite: "replace",
            });
            appAnimations[appel.id] = anim;

            const temp = currentOpeningEl;
            anim.onfinish = () => {
                removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
                runScript(`/appData/${temp.dataset.app}/js/open/open.js`);

                // Xoá animation đã xong
                delete appAnimations[appel.id];
            };
        }
    }

    if (animAPI) animAPI.cancel();
}

function openAppByIDFromIslandWithScript(idApp, script) {
    if (isLock) {
        showPasswordScreen(() => {
            hiddenLockScreen();
            openAppByIDFromIslandWithScript(idApp, script);
        }, `Enter password to open ${document.querySelector(`[data-app='${idApp}'] label`).textContent.trim()} app`);
        return;
    }
    const alreadyOpen1 = !currentOpeningElApp;
    const alreadyOpen = currentOpeningElApp && currentOpeningElApp.id != idApp;

    if (alreadyOpen) {
        closeAppToLeft();
    }

    currentOpeningElApp = document.getElementById(idApp);
    currentOpeningEl = document.querySelector(`[data-app='${idApp}']`);
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    // Nếu app đang có animation đóng -> cancel

    currentOpeningElApp.style.transition = `none`;

    allApp.classList.add("open");
    wallpaperHome.classList.add("open");
    currentOpeningElApp.classList.add("open");

    appDisplay.style.display = "flex";

    currentOpeningEl.classList.add("hidden");
    scrollAppScreen.style.pointerEvents = "none";

    clearTimeout(timeOutClosingApp[currentOpeningElApp.id]);
    timeOutClosingApp[currentOpeningElApp.id] = null;

    const appel = currentOpeningElApp;
    appel.style.pointerEvents = "auto";

    const animAPI = appAnimations[appel.id];

    if (alreadyOpen) {
        const anim = appel.animate(
            [
                {transform: "translateX(120%) scale(0.8)"},
                {transform: "translateX(80%) scale(0.8)"},
                {transform: "translateX(40%) scale(0.85)"},
                {transform: "scale(1)"},
            ],
            {
                duration: 400 * speed,
                easing: "ease-out",
            }
        );
        appAnimations[appel.id] = anim;

        const temp = currentOpeningEl;
        anim.onfinish = () => {
            removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
            runScript(`/appData/${temp.dataset.app}/js/open/open.js`);

            // Xoá animation đã xong
            delete appAnimations[appel.id];
        };
    } else {
        if (alreadyOpen1) {
            appel.classList.remove("animationAppOpenFromIsland");
            requestAnimationFrame(() => {
                appel.classList.add("animationAppOpenFromIsland");
            });
            const anim = appel.animate([], {
                duration: 650 * speed,
                easing: "ease-in-out",
                composite: "replace",
            });
            appAnimations[appel.id] = anim;

            const temp = currentOpeningEl;

            timeOutOpeningApp[appel.id] = setTimeout(() => {
                removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
                runScript(`/appData/${temp.dataset.app}/js/open/open.js`);

                timeOutOpeningApp[appel.id] = null;

                // Xoá animation đã xong
                delete appAnimations[appel.id];
            }, 650);
            setTimeout(() => {
                appel.classList.remove("animationAppOpenFromIsland");
            }, 650);
        }
    }

    if (animAPI) animAPI.cancel();
    script();
}
const cameraBtn = document.querySelector(".cameraBtn");
cameraBtn.addEventListener("click", (e) => {
    openAppByIDFromCameraBtn(document.querySelector(".cameraBtn").dataset.appcamerabtn);
});

function openAppByIDFromCameraBtn(idApp) {
    if (!idApp) return;
    if (isLock) {
        showPasswordScreen(() => {
            hiddenLockScreen();
            openAppByIDFromCameraBtn(idApp);
        }, `Enter password to open ${document.querySelector(`[data-app='${idApp}'] label`).textContent.trim()} app`);
        return;
    }
    const alreadyOpen1 = !currentOpeningElApp;
    const alreadyOpen = currentOpeningElApp && currentOpeningElApp.id != idApp;
    if (alreadyOpen) {
        closeAppToLeft();
    }

    currentOpeningElApp = document.getElementById(idApp);
    currentOpeningEl = document.querySelector(`[data-app='${idApp}']`);
    const appDisplay = currentOpeningElApp.querySelector(".appDisplay");

    // Nếu app đang có animation đóng -> cancel

    currentOpeningElApp.style.transition = `none`;

    allApp.classList.add("open");
    wallpaperHome.classList.add("open");
    currentOpeningElApp.classList.add("open");

    appDisplay.style.display = "flex";

    currentOpeningEl.classList.add("hidden");
    scrollAppScreen.style.pointerEvents = "none";

    clearTimeout(timeOutClosingApp[currentOpeningElApp.id]);
    timeOutClosingApp[currentOpeningElApp.id] = null;

    const appel = currentOpeningElApp;
    appel.style.pointerEvents = "auto";

    if (appel.anim) {
        appel.anim.onfinish = null;
        appel.anim.cancel();
    }

    const animAPI = appAnimations[appel.id];
    if (animAPI) animAPI.cancel();
    if (alreadyOpen) {
        const anim = appel.animate(
            [
                {transform: "translateX(120%) scale(0.8)"},
                {transform: "translateX(80%) scale(0.8)"},
                {transform: "translateX(40%) scale(0.85)"},
                {transform: "scale(1)"},
            ],
            {
                duration: 400 * speed,
                easing: "ease-out",
            }
        );
        appAnimations[appel.id] = anim;

        const temp = currentOpeningEl;
        anim.onfinish = () => {
            // Xoá animation đã xong
            delete appAnimations[appel.id];

            removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
            runScript(`/appData/${temp.dataset.app}/js/open/open.js`);
        };
    } else {
        if (alreadyOpen1) {
            appel.classList.remove("animationAppOpenFromCameraBtn");
            requestAnimationFrame(() => {
                appel.classList.add("animationAppOpenFromCameraBtn");
            });
            const anim = appel.animate([], {
                duration: 650 * speed,
                easing: "ease-in-out",
                composite: "replace",
            });
            appAnimations[appel.id] = anim;

            const temp = currentOpeningEl;

            timeOutOpeningApp[appel.id] = setTimeout(() => {
                timeOutOpeningApp[appel.id] = null;

                // Xoá animation đã xong
                delete appAnimations[appel.id];

                removeScript(`/appData/${temp.dataset.app}/js/close/close.js`);
                runScript(`/appData/${temp.dataset.app}/js/open/open.js`);
            }, 650);

            setTimeout(() => {
                appel.classList.remove("animationAppOpenFromCameraBtn");
            }, 650);
        }
    }
}
