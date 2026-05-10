const CACHE_NAME = "offline-demo";
const OFFLINE_FILES = [
    "./main.js",
    "../index.html",
    "../404.html",
    "../manifest.json",
    "../css/main.css",
    "../img/favicon.ico",
    "../img/icon.png",
    "../img/logo.png",
    "../img/logo-light.png",
    "../img/screenshot.png",
    "../img/mobile_screenshot.png",
    "https://cdn.emulatorjs.org/versions.json",

    // Only cache stable assets offline...?
    "https://cdn.emulatorjs.org/stable/data/loader.js",
    "https://cdn.emulatorjs.org/stable/data/emulator.min.js",
    "https://cdn.emulatorjs.org/stable/data/emulator.min.css",
    "https://cdn.emulatorjs.org/stable/data/compression/extract7z.js",
    "https://cdn.emulatorjs.org/stable/data/compression/extractzip.js",
    "https://cdn.emulatorjs.org/stable/data/compression/libunrar.js",
    "https://cdn.emulatorjs.org/stable/data/compression/libunrar.wasm"
];
let STABLE_EJS_VER = "4.2.3"; // Fallback version if the request fails

importScripts('./main.js');

try {
    loadJSON("https://cdn.emulatorjs.org/versions.json", (response) => {
        if (response) {
            STABLE_EJS_VER = JSON.parse(response).github;
        }
        console.log("Stable EmulatorJS version:", STABLE_EJS_VER);
    });
} catch (e) {
    console.warn("Failed to get Stable EmulatorJS version:", e, "Using fallback version:", STABLE_EJS_VER);
}


self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(OFFLINE_FILES);
        })()
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.clients.claim();
});

function getCacheUrl(url) {
    if (url === "/") {
        return "../index.html";
    } else if (url === "/versions.json") {
        return "https://cdn.emulatorjs.org/versions.json";
    } else if (url.startsWith("/")) {
        return '..' + url;
    }
    return url.replace(STABLE_EJS_VER, "stable");
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            const requestURL = new URL(event.request.url);
            let url = (requestURL.hostname === "cdn.emulatorjs.org") ? event.request.url : requestURL.pathname;
            const cache = await caches.open(CACHE_NAME);
            if (requestURL.hostname === "cdn.emulatorjs.org" && !OFFLINE_FILES.includes(event.request.url.replace(STABLE_EJS_VER, "stable")) && !event.request.url.includes("reports/")) {
                return await fetch(event.request);
            }
            try {
                const req = (url === "/versions.json") ? "https://cdn.emulatorjs.org/versions.json" : event.request;
                const res = await fetch(req);
                if (!res.ok && res.status !== 0) {
                    throw new Error('status code not ok');
                }
                cache.put(getCacheUrl(url), res.clone());
                return res;
            } catch(e) {
                console.log("error:", e);
                url = getCacheUrl(url);
                let rv = await cache.match(url);
                if (rv === undefined) {
                    rv = await cache.match("404.html");
                }
                return rv;
            }
        })()
    );
});
