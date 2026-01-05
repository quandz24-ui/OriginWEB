let dragTarget = null;
let preview = null;
let originCol, originRow, originParent;
let holdTimer = null;
let isDragging = false;
let timeOutRemovePreviewIcon = null;

let startXMovingIcon = 0,
    startYMovingIcon = 0;
let scriptTriggered = false;

const nav = document.getElementById("nav");
const favApp = document.getElementById("favApp");
let currentAppScreen = document.getElementById("appScreen1");

const allAppScreen = document.getElementById("allAppIconScreen");

const phone = document.getElementById("phone");
let phoneRect = phone.getBoundingClientRect();
window.addEventListener("resize", () => {
    phoneRect = phone.getBoundingClientRect();
});

const blurAllApp = document.getElementById("blurAllApp");

const scrollAppScreen = document.getElementById("horizontalScrollAppScreen");

const COLS = 4;
const ROWS = 6;

let speed = getComputedStyle(document.documentElement).getPropertyValue("--bg-speedAnimation");

let powerOff2TapHomeScreenClickTime = 0;
function powerOff2TapHomeScreen(e) {
    if (e.target.matches(".appScreen")) {
        const currentTime = Date.now();
        const tapInterval = currentTime - powerOff2TapHomeScreenClickTime;

        if (tapInterval < 400 && tapInterval > 0) {
            powerOff();
            showLockScreen();
        }

        powerOff2TapHomeScreenClickTime = currentTime;
    }
}

document.querySelectorAll(".iconApp").forEach((icon) => {
    icon.addEventListener("pointerdown", (e) => {
        e.preventDefault();

        holdTimer = setTimeout(() => {
            if (currentOpeningEl) return;
            startDrag(icon, e);
            holdTimer = null;

            document.addEventListener("touchmove", pointerMovingIcon);
            document.addEventListener("touchend", pointerUpIconWhileDragIcon, {
                passive: false,
            });

            document.addEventListener("pointermove", pointerMovingIcon, {
                passive: false,
            });
            document.addEventListener("pointerup", pointerUpIconWhileDragIcon, {
                passive: false,
            });

            icon.removeEventListener("pointercancel", clearTimeoutHoldTimer);
            window.removeEventListener("mousemove", clearTimeoutHoldTimer);
        }, 500);

        icon.addEventListener("pointerup", pointerUpIcon);
        window.addEventListener("pointercancel", clearTimeoutHoldTimer);
        window.addEventListener("mousemove", clearTimeoutHoldTimer);
    });
    //moverIconApp(icon);
});

function pointerUpIcon(e) {
    if (holdTimer) {
        if (currentOpeningElApp) closeApp();
        clearTimeoutHoldTimer();
        openApp(e.target);
        holdTimer = null;
        window.removeEventListener("pointercancel", clearTimeoutHoldTimer);
        window.removeEventListener("mousemove", clearTimeoutHoldTimer);
    }
}
function clearTimeoutHoldTimer() {
    clearTimeout(holdTimer);
    window.removeEventListener("pointercancel", clearTimeoutHoldTimer);
    window.removeEventListener("mousemove", clearTimeoutHoldTimer);
}

function pointerDownPreviewIconOnBlur(e) {
    isDragging = true;
    scriptTriggered = false;

    startXMovingIcon = e.clientX - phoneRect.left;
    startYMovingIcon = e.clientY - phoneRect.top;
}

async function startDrag(icon, e) {
    if (dragTarget) await pointerUpIconWhileDragIconNoAnim();
    dragTarget = icon;
    isDragging = true;

    scriptTriggered = false;
    startXMovingIcon = e.clientX - phoneRect.left;
    startYMovingIcon = e.clientY - phoneRect.top;

    originCol = icon.style.gridColumn;
    originRow = icon.style.gridRow;
    originParent = icon.parentElement;

    icon.style.visibility = "hidden";

    const rect = icon.getBoundingClientRect();
    preview = document.createElement("div");
    preview.classList.add("previewIcon");
    preview.style.left = rect.left - phoneRect.left + "px";
    preview.style.top = rect.top - phoneRect.top + "px";

    const cs = window.getComputedStyle(icon);
    preview.style.backgroundImage = cs.backgroundImage;
    preview.style.backgroundColor = cs.backgroundColor;
    preview.style.borderRadius = cs.borderRadius;
    preview.style.backgroundSize = cs.backgroundSize;
    preview.style.backgroundPosition = cs.backgroundPosition;
    preview.style.backgroundRepeat = cs.backgroundRepeat;

    const width = rect.width;
    const height = rect.height;
    const offsetW = width * 0.1;
    const offsetH = height * 0.1;

    preview.animate(
        [
            {
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(0, 0)`,
            },
            {
                width: `${width * 1.2}px`,
                height: `${height * 1.2}px`,
                transform: `translate(${-offsetW}px, ${-offsetH}px)`,
            },
        ],
        {
            duration: 400,
            easing: "cubic-bezier(0.5, 2.5, 0.65, 1)",
            fill: "forwards",
        }
    );

    document.getElementById("phone").appendChild(preview);

    preview.setAttribute("data-app", icon.dataset.app);
    preview.innerHTML = `<div class='containerPreview liquid'><button onclick='removeApp("${preview.dataset.app}")' style='color: red'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'><path d='m379-278 101-102 102 102 80-80-102-102 102-102-80-80-102 102-101-102-80 80 101 102-101 102 80 80ZM267-74q-55.73 0-95.86-39.44Q131-152.88 131-210v-501H68v-136h268v-66h287v66h269v136h-63v501q0 57.12-39.44 96.56Q750.13-74 693-74H267Zm426-637H267v501h426v-501Zm-426 0v501-501Z'/></svg>remove</button></div>`;

    clearTimeout(timeOutRemovePreviewIcon);
    createAppScreen();
    allApp.classList.add("scaleForMovingApp");
}

let autoScrollInterval = null;

function pointerMovingIcon(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = clientX - phoneRect.left;
    const y = clientY - phoneRect.top;

    const dx = x - startXMovingIcon;
    const dy = y - startYMovingIcon;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= 50 && !scriptTriggered) {
        scriptTriggered = true;
        allApp.classList.remove("scaleForMovingApp");
        preview.style.translate = "";
        preview.querySelector(".containerPreview").classList.add("hidden");
    }

    if (!scriptTriggered) {
        return;
    }

    //preview.style.left = x - preview.offsetWidth / 2 + "px";
    //preview.style.top = y - preview.offsetHeight / 2 + "px";
    preview.style.translate = `${dx}px ${dy}px`;

    handleAutoScroll(x);
}

function handleAutoScroll(x) {
    const scrollContainer = document.getElementById("horizontalScrollAppScreen");
    const threshold = 20; 

    clearInterval(autoScrollInterval);


    if (x < threshold) {

        autoScrollInterval = setInterval(() => {
            if (scrollContainer.scrollLeft > 0) {
                scrollContainer.scrollBy({left: -10, behavior: "smooth"});
            }
        }, 11 - 0);
    } else if (phoneRect.width - x < threshold) {
 
        autoScrollInterval = setInterval(() => {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (scrollContainer.scrollLeft < maxScroll) {
                scrollContainer.scrollBy({left: 10, behavior: "smooth"});
            }
        }, 100);
    }
}

async function finishDragAnimation({removeBlur = false}, timeout = 300) {
    clearInterval(autoScrollInterval);
    isDragging = false;

    const rect = dragTarget.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();

    const deltaX = rect.left - previewRect.left;
    const deltaY = rect.top - previewRect.top;

    const offsetW = (rect.width * 0.2) / 2;
    const offsetH = (rect.height * 0.2) / 2;

    preview.animate(
        [
            {width: "", height: "", transform: ""},
            {
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                transform: `translate(${deltaX - offsetW}px, ${deltaY - offsetH}px)`,
            },
        ],
        {
            duration: timeout,
            easing: "ease",
            fill: "forwards",
        }
    );

    async function timeoutF() {
        preview?.remove();

        await updateAppPosNoRemove(() => {
            const layers = findWaterDrop(dragTarget, [
                ...currentAppScreen.querySelectorAll(".iconApp"),
                ...document.querySelectorAll("#favApp .iconApp"),
            ]);
            addAnimationWaterDrop(dragTarget, layers);

            dragTarget.animate(
                [
                    {transform: "scale(1)", boxShadow: "0 0 3rem aqua"},
                    {transform: "scale(0.9)", boxShadow: "0 0 0rem aqua"},
                    {transform: "scale(1)"},
                ],
                {
                    duration: timeout * 2,
                    easing: "ease-out",
                }
            );
        });

        dragTarget.style.visibility = "";
        dragTarget = null;
        preview = null;
    }

    if (timeout) {
        timeOutRemovePreviewIcon = setTimeout(timeoutF, timeout);

        if (removeBlur) allApp.classList.remove("scaleForMovingApp");

        cleanupEmptyScreens();
        saveAppLayout();
    } else await timeoutF();

    document.removeEventListener("pointermove", pointerMovingIcon);
    document.removeEventListener("pointerup", pointerUpIconWhileDragIcon);
    document.removeEventListener("pointercancel", pointerUpIconWhileDragIcon);
}
async function pointerUpIconWhileDragIcon(e) {
    if (holdTimer) clearTimeout(holdTimer);
    if (!isDragging || !dragTarget) return;

    if (!scriptTriggered) {
        isDragging = false;
        scriptTriggered = true;

        blurAllApp.addEventListener("pointerup", pointerUpIconWhileDragIconForBlurApp);
        blurAllApp.style.pointerEvents = "all";

        preview.addEventListener("pointerdown", pointerDownPreviewIconOnBlur);
        return;
    }

    blurAllApp.removeEventListener("pointerup", pointerUpIconWhileDragIconForBlurApp);
    blurAllApp.style.pointerEvents = "";

    const x = e.clientX || e.changedTouches?.[0]?.clientX;
    const y = e.clientY || e.changedTouches?.[0]?.clientY;

    const dropSlot = findSmartEmptySlot(x, y);
    if (dropSlot) {
        dropSlot.appendChild(dragTarget);
    } else {
        originParent.appendChild(dragTarget);
        dragTarget.style.gridColumn = originCol;
        dragTarget.style.gridRow = originRow;
    }

    await finishDragAnimation({removeBlur: false});
}
async function pointerUpIconWhileDragIconForBlurApp(e) {
    if (holdTimer) clearTimeout(holdTimer);
    if (!dragTarget) return;

    blurAllApp.removeEventListener("pointerup", pointerUpIconWhileDragIconForBlurApp);
    blurAllApp.style.pointerEvents = "";

    preview.querySelector(".containerPreview")?.classList.add("hidden");

    await finishDragAnimation({removeBlur: true});
}
async function pointerUpIconWhileDragIconNoAnim(e) {
    if (holdTimer) clearTimeout(holdTimer);
    if (!dragTarget) return;

    blurAllApp.removeEventListener("pointerup", pointerUpIconWhileDragIconForBlurApp);
    blurAllApp.style.pointerEvents = "";

    preview.querySelector(".containerPreview")?.classList.add("hidden");

    await finishDragAnimation({removeBlur: true}, 0);
}

let screenCounter = 2;
function createAppScreen() {
    const screen = document.createElement("div");
    screen.className = "appScreen";

    screen.id = `appScreen${screenCounter++}`;

    scrollAppScreen.appendChild(screen);

    buildDots();
    return screen;
}

function cleanupEmptyScreens() {
    document.querySelectorAll(".appScreen").forEach((screen) => {
        if (!screen.querySelector(".iconApp")) {
            screen.remove();
            screenCounter--;
        }
    });
    buildDots();
}

function findSmartEmptySlot(x, y) {
    const containers = document.querySelectorAll(".appScreen, #favApp");

    for (const container of containers) {
        const rect = container.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            const col = Math.min(COLS, Math.max(1, Math.floor(((x - rect.left) / rect.width) * COLS) + 1));
            const row =
                container.id === "favApp"
                    ? 1
                    : Math.min(ROWS, Math.max(1, Math.floor(((y - rect.top) / rect.height) * ROWS) + 1));

            const occupied = Array.from(container.children).some((child) => {
                return child !== dragTarget && child.style.gridColumn == col && child.style.gridRow == row;
            });

            if (!occupied) {
                dragTarget.style.gridColumn = col;
                dragTarget.style.gridRow = row;
                return container;
            }
        }
    }
    return null;
}

//----==
//--== save layout ==--
//----==
// ===========================
// ===========================
let removedApps = [];
let addedApps = [];
let isLoadingLayout = false;

// ===========================
// THÊM APP
// ===========================
function addApps(name = "none", appid = "none", background = "", anim = false) {
    if (document.querySelectorAll(".iconApp").length >= 60) {
        tb_system("maximum is 60 applications");
        return;
    }
    if (currentOpeningElApp) {
        addScriptForCloseApp(() => {
            setTimeout(() => {
                addApps(name, appid, background, anim);
            }, 700 * speed);
        });
        closeApp();
        return;
    }
    if (!appid) appid = "app_" + Date.now();

    let originalId = appid;
    let counter = 1;
    while (document.getElementById(appid)) {
        appid = originalId + counter;
        counter++;
    }

    removedApps = removedApps.filter((id) => id !== appid);

    const icon = document.createElement("div");
    icon.className = "iconApp";
    icon.dataset.app = appid;
    icon.style.background = `${background} no-repeat center center/105%`;

    const label = document.createElement("label");
    label.textContent = name;
    icon.appendChild(label);

    icon.addEventListener("pointerdown", (e) => {
        e.preventDefault();

        holdTimer = setTimeout(() => {
            if (currentOpeningEl) return;
            startDrag(icon, e);
            holdTimer = null;

            document.addEventListener("touchmove", pointerMovingIcon);
            document.addEventListener("touchend", pointerUpIconWhileDragIcon, {
                passive: false,
            });

            document.addEventListener("pointermove", pointerMovingIcon, {
                passive: false,
            });
            document.addEventListener("pointerup", pointerUpIconWhileDragIcon, {
                passive: false,
            });

            icon.removeEventListener("pointercancel", clearTimeoutHoldTimer);
            window.removeEventListener("mousemove", clearTimeoutHoldTimer);
        }, 500);

        icon.addEventListener("pointerup", pointerUpIcon);
        window.addEventListener("pointercancel", clearTimeoutHoldTimer);
        window.addEventListener("mousemove", clearTimeoutHoldTimer);
    });

    const appBox = document.createElement("div");
    appBox.className = "app";
    appBox.id = appid;
    appBox.innerHTML = `
        <div class="appDisplay">
            <div class="centerText">${name}</div>
        </div>
    `;
    document.getElementById("allAppIconScreen").appendChild(appBox);

    let placed = false;

    for (let i = parseInt(String(currentAppScreen.id).slice(-1)); i <= screenCounter; i++) {
        const container = document.getElementById(`appScreen${i}`);
        if (!container) continue;

        const maxCols = getComputedStyle(container).gridTemplateColumns.split(" ").length;
        const maxRows = getComputedStyle(container).gridTemplateRows.split(" ").length;

        const usedIcons = container.querySelectorAll(".iconApp");
        const occupied = Array.from({length: maxRows}, () => Array(maxCols).fill(false));

        usedIcons.forEach((el) => {
            const computed = window.getComputedStyle(el);
            const row = parseInt(computed.gridRowStart);
            const col = parseInt(computed.gridColumnStart);
            if (!isNaN(row) && !isNaN(col)) {
                occupied[row - 1][col - 1] = true;
            }
        });

        for (let r = 1; r <= maxRows && !placed; r++) {
            for (let c = 1; c <= maxCols && !placed; c++) {
                if (!occupied[r - 1][c - 1]) {
                    icon.style.gridArea = `${r} / ${c}`;
                    icon.setAttribute("data-row", r);
                    icon.setAttribute("data-col", c);
                    container.appendChild(icon);
                    placed = true;
                }
            }
        }
        if (placed) break;
    }

    if (!placed) {
        const newScreen = createAppScreen();
        newScreen.id = `appScreen${screenCounter}`;
        icon.style.gridArea = "1 / 1";
        newScreen.appendChild(icon);
    }

    addedApps.push({id: appid, name, background});

    saveAppLayout();
    if (anim)
        updateAppPosNoRemove(() => {
            const layers = findWaterDrop(icon, icon.parentElement);
            addAnimationWaterDrop(icon, layers);

            icon.animate([{transform: "scale(1)"}, {transform: "scale(0.9)"}, {transform: "scale(1)"}], {
                duration: 600,
                easing: "ease-out",
            });
        }, icon.parentElement);
    else updateAppPosNoRemove(() => {}, icon.parentElement);
}

// ===========================
// XOÁ APP
// ===========================
function removeApp(appId) {

    const el1 = document.querySelector(`[data-app="${appId}"]`);
    const el2 = document.getElementById(appId);

    if (el1.dataset.noremove == "1") {
        tb_system("This app cannot be removed.");
        return;
    }
    if (el1) el1.remove();
    if (el2) el2.remove();

    if (!removedApps.includes(appId)) removedApps.push(appId);
    addedApps = addedApps.filter((app) => app.id !== appId);

    saveAppLayout();

    if (holdTimer) clearTimeout(holdTimer);

    document.getElementById("blurAllApp").removeEventListener("pointerup", pointerUpIconWhileDragIconForBlurApp);
    document.getElementById("blurAllApp").style.pointerEvents = "";

    clearInterval(autoScrollInterval);

    isDragging = false;

    timeOutRemovePreviewIcon = setTimeout(() => {
        preview?.remove();
        dragTarget = preview = null;
        allApp.classList.remove("scaleForMovingApp");

        cleanupEmptyScreens();
        updateAppPosNoRemove();
    }, 200);

    document.removeEventListener("pointermove", pointerMovingIcon);
    document.removeEventListener("pointerup", pointerUpIconWhileDragIcon);
    document.removeEventListener("pointercancel", pointerUpIconWhileDragIcon);
    preview.querySelector(".containerPreview").classList.add("hidden");
}

// ===========================
// animation
// ===========================

function getGridPositionForWaterAnimation(el) {
    const gridArea = getComputedStyle(el).gridArea;
    let [row, col] = gridArea.split("/").map((v) => parseInt(v.trim()));
    if (el.parentElement.id == "favApp") return {row: row + 6, col};

    return {row, col};
}

function getDirectionVector(fromBox, toBox) {
    const from = getGridPositionForWaterAnimation(fromBox);
    const to = getGridPositionForWaterAnimation(toBox);

    let dx = to.col - from.col;
    let dy = to.row - from.row;

    const length = Math.sqrt(dx * dx + dy * dy) || 1;

    return {
        x: dx / length,
        y: dy / length,
    };
}

function findWaterDrop(centerBox, gridBox) {

    if (gridBox instanceof HTMLElement) {
        gridBox = [...gridBox.querySelectorAll(".iconApp")];
    }

    const centerPos = getGridPositionForWaterAnimation(centerBox);
    const layers = {};

    gridBox.forEach((box) => {
        if (box === centerBox) return;

        const {row, col} = getGridPositionForWaterAnimation(box);

        const distance = Math.sqrt((row - centerPos.row) ** 2 + (col - centerPos.col) ** 2);

        const layer = Math.ceil(distance);

        if (!layers[`layer${layer}`]) {
            layers[`layer${layer}`] = [];
        }

        layers[`layer${layer}`].push(box);
    });

    console.log(layers);
    return layers;
}

function addAnimationWaterDrop(centerBox, layerBoxes) {
    const maxScale = 1.21;
    const scaleStep = 0.05;

    const maxTranslate = 15;
    const translateStep = 2;

    const delayStep = 70;

    const layers = Object.keys(layerBoxes)
    .map((key) => ({
        key,
        index: parseInt(key.replace("layer", "")),
    }))
    .sort((a, b) => a.index - b.index);

    layers.forEach(({key, index}) => {
        const boxes = layerBoxes[key];
        const layerIndex = index;

        const scale = Math.max(maxScale - scaleStep * (layerIndex - 1), 1);

        const magnitude = Math.max(maxTranslate - translateStep * (layerIndex - 1), 0);

        const delay = delayStep * (layerIndex - 1);

        boxes.forEach((box) => {
            box.getAnimations().forEach((a) => a.cancel());

            const dir = getDirectionVector(centerBox, box);

            const x = dir.x * magnitude;
            const y = dir.y * magnitude;

            box.animate(
                [
                    {transform: "translate(0,0) scale(1)"}, //, boxShadow: ""
                    {transform: `translate(${x}px, ${y}px) scale(${scale})`}, //, boxShadow: "0 0 0rem 0 #05dbe9"
                    {transform: "translate(0,0) scale(1)"}, //, boxShadow: ""
                ],
                {
                    duration: 800 + delay / 2,
                    delay,
                    easing: "cubic-bezier(.22,.61,.36,1)",
                    fill: "both",
                }
            );
        });
    });
}
{
}

// ===========================
// LƯU APP LAYOUT
// ===========================
function saveAppLayout() {
    if (isLoadingLayout) return;

    const layout = [];
    const screens = document.querySelectorAll(".appScreen, #favApp");

    screens.forEach((container) => {
        const screenId = container.id;
        container.querySelectorAll(".iconApp").forEach((icon) => {
            const computed = window.getComputedStyle(icon);
            const row = computed.gridRowStart;
            const col = computed.gridColumnStart;

            layout.push({
                id: icon.dataset.app,
                screen: screenId,
                row,
                col,
            });
        });
    });

    const state = {layout, removedApps, addedApps, screenCounter};
    localStorage.setItem("appLayout", JSON.stringify(state));
}

// ===========================
// TẢI APP LAYOUT
// ===========================
function loadAppLayout() {
    const data = localStorage.getItem("appLayout");
    if (!data) return;

    isLoadingLayout = true;

    const state = JSON.parse(data);
    const {layout, removedApps: savedRemoved, addedApps: savedAdded, screenCounter: savedCounter} = state;

    screenCounter = savedCounter || 2;
    removedApps = savedRemoved || [];
    addedApps = savedAdded || [];

    addedApps.forEach((app) => {
        if (!document.querySelector(`[data-app="${app.id}"]`)) {
            addApps(app.name, app.id, app.background);
        }
    });

    layout.forEach((item) => {
        const icon = document.querySelector(`[data-app="${item.id}"]`);
        let container = document.getElementById(item.screen);

        if (!container && item.screen.startsWith("appScreen")) {
            container = createAppScreen();
            container.id = item.screen;
        }

        if (icon && container) {
            icon.style.gridRow = item.row;
            icon.style.gridColumn = item.col;
            container.appendChild(icon);
        }
    });

    removedApps.forEach((appId) => {
        document.querySelector(`[data-app="${appId}"]`)?.remove();
        document.getElementById(appId)?.remove();
    });

    isLoadingLayout = false;
    updateAppPosNoRemove();
}

//DDDDDDDDDDDD-------------DDDDDDDDDDDDD
//DDDDDDDDD--DDDDDDDDDDDDDDD--DDDDDDDDDD
//DDDDDD--DDDDDDDDDDDDDDDDDDDDD--DDDDDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDDDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDD---DDDDDD--DDDD
//DDD--DDDDDDDDDDDDDDDDDDDDDD--DDD--DDDD
//DDDDDD--DDDDDDDDDDDDDDDDDDDDD--DDDDDDD
//DDDDDDDDD--DDDDDDDDDDDDDDD--DDD--DDDDD
//DDDDDDDDDDDD-------------DDDDDDDD---DD

function setBackgroundColor(box, imageUrl) {
    return new Promise((resolve) => {
        const appId = document.getElementById(box?.dataset?.app);
        if (!box || !imageUrl || imageUrl === "none") return resolve();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const targetH = 50;
            const canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = targetH;

            const ctx = canvas.getContext("2d", {willReadFrequently: true});

            ctx.drawImage(img, img.width / 2, 0, 1, img.height, 0, 0, 1, targetH);

            const imgData = ctx.getImageData(0, 0, 1, targetH).data;

            let finalColor = "rgb(234, 234, 234)";

            for (let y = targetH - 1; y >= 0; y--) {
                const i = y * 4;
                const alpha = imgData[i + 3];

                if (alpha > 0) {

                    finalColor = `rgb(${imgData[i]}, ${imgData[i + 1]}, ${imgData[i + 2]})`;
                    break;
                }
            }

            box.style.backgroundColor = finalColor;
            if (appId) appId.style.backgroundColor = finalColor;

            resolve();
        };

        img.onerror = () => resolve();
    });
}
async function updateAppPositions(script = function () {}) {
    const phone = document.getElementById("allAppIconScreen");
    const phoneRect = phone.getBoundingClientRect();
    const innerW = phoneRect.width;
    const innerH = phoneRect.height;
    const centerX = innerW / 2;

    let styleTag = document.getElementById("dynamicAppPos");
    if (styleTag) styleTag.remove();
    styleTag = document.createElement("style");
    styleTag.id = "dynamicAppPos";
    document.head.appendChild(styleTag);

    let cssRules = "";

    const icons = document.querySelectorAll(".iconApp");

    for (const icon of icons) {
        const appId = icon.dataset.app;
        const appEl = document.getElementById(appId);
        if (!appEl) continue;

        const r = icon.getBoundingClientRect();
        const relLeft = r.left - phoneRect.left;
        const relTop = r.top - phoneRect.top;

        const iconW = Math.round(r.width);
        const iconH = Math.round(r.height);

        const isLeft = relLeft - iconW / 2 < centerX;
        const posX = isLeft ? "left" : "right";
        const offsetX = isLeft ? Math.round(relLeft) : Math.round(innerW - (relLeft + iconW));

        const cs = getComputedStyle(icon);
        const bg = cs.background;

        await setBackgroundColor(icon, cs.backgroundImage.replace(/url\(["']?(.+?)["']?\)/, "$1"));

        cssRules += `
            #${appId}{ ${posX}:${offsetX}px; ${top}:${Math.round(relTop)}px; width:${iconW}px; height:${iconH}px; }
            #${appId}.open{ ${posX}:0; ${top}:50%; translate:0 -50%; height: 100%; width: 100%; }
            #${appId}::before{ background:${bg}; }
        `;
    }

    styleTag.textContent = cssRules;

    if (script) script();
}

function upsertCssRule(sheet, selector, cssText) {
    for (let i = 0; i < sheet.cssRules.length; i++) {
        const rule = sheet.cssRules[i];
        if (rule.selectorText === selector) {
            rule.style.cssText = cssText;
            return;
        }
    }
    sheet.insertRule(`${selector}{${cssText}}`, sheet.cssRules.length);
}

async function updateAppPosNoRemove(script = function () {}, screen = currentAppScreen) {
    const phone = document.getElementById("allAppIconScreen");
    const phoneRect = phone.getBoundingClientRect();

    const scaleX = phoneRect.width / phone.offsetWidth || 1;
    const scaleY = phoneRect.height / phone.offsetHeight || 1;
    const innerW = phone.offsetWidth;
    const innerH = phone.offsetHeight;
    const centerX = innerW / 2;

    const styleTag =
        document.getElementById("dynamicAppPos") ||
        (() => {
            const tag = document.createElement("style");
            tag.id = "dynamicAppPos";
            document.head.appendChild(tag);
            return tag;
        })();
    const sheet = styleTag.sheet;

    const allIcons = [...screen.querySelectorAll(".iconApp"), ...favApp.querySelectorAll(".iconApp")];

    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            allIcons.forEach((icon) => {
                const appId = icon.dataset.app;
                const r = icon.getBoundingClientRect();

                const relLeft = (r.left - phoneRect.left) / scaleX;
                const relTop = (r.top - phoneRect.top) / scaleY;
                const iconW = r.width / scaleX;
                const iconH = r.height / scaleY;

                const isLeft = relLeft + iconW / 2 < centerX;
                const posX = isLeft ? "left" : "right";
                const offsetX = isLeft ? relLeft : innerW - (relLeft + iconW);

                const offsetY = innerH - (relTop + iconH);

                upsertCssRule(
                    sheet,
                    `#${appId}`,
                    `${posX}:${offsetX}px; bottom:${offsetY}px; width:${iconW}px; height:${iconH}px;`
                );

                upsertCssRule(
                    sheet,
                    `#${appId}.open`,
                    `${posX}:0%; bottom:50%; translate:0 50%; height: 100%; width: 100%;`
                );
            });

            if (script) script();

            resolve();
        });
    });
}

function updateCurrentAppScreen() {
    const screens = scrollAppScreen.querySelectorAll(".appScreen");
    const containerRect = scrollAppScreen.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closest = null;
    let minDistance = Infinity;
    let closestIndex = -1;

    screens.forEach((screen, index) => {
        const rect = screen.getBoundingClientRect();
        const screenCenter = rect.left + rect.width / 2;
        const distance = Math.abs(containerCenter - screenCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closest = screen;
            closestIndex = index;
        }
    });

    currentAppScreen = closest;

    const dots = document.querySelectorAll("#pager .dot");
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === closestIndex);
    });
}

let scrollTimeout = document.getElementById("appScreen1");
let ticking = false;
scrollAppScreen.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateCurrentAppScreen();
            ticking = false;
        });
        ticking = true;
    }
    document.querySelectorAll(".iconApp").forEach((icon) => {
        icon.style.pointerEvents = "none";
    });

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateAppPosNoRemove();
        document.querySelectorAll(".iconApp").forEach((icon) => {
            icon.style.pointerEvents = "";
        });
    }, 200);
});

const pager = document.getElementById("pager");

function buildDots() {
    pager.innerHTML = "";
    const screens = scrollAppScreen.querySelectorAll(".appScreen");

    screens.forEach(() => {
        const dot = document.createElement("div");
        dot.className = "dot";
        pager.appendChild(dot);
    });

    const dots = pager.querySelectorAll(".dot");

    let activeIndex = 0;
    if (typeof currentAppScreen !== "undefined" && currentAppScreen) {
        activeIndex = Array.from(screens).indexOf(currentAppScreen);
        if (activeIndex < 0) activeIndex = 0;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
    });
}

function moverIconApp(icon) {
    const maxMove = 10;

    const handleMove = (e) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;

        icon.style.translate = `${moveX}px ${moveY}px`;
        icon.classList.add("hover");
    };

    const handleLeave = () => {
        icon.style.translate = "0 0";
        icon.removeEventListener("mousemove", handleMove);
        icon.classList.remove("hover");
    };

    icon.addEventListener("mouseenter", () => {
        icon.addEventListener("mousemove", handleMove);
    });

    icon.addEventListener("mouseleave", handleLeave);
}

