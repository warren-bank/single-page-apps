async function loadGame(url, filename) {
    if (!url) return

    const parts = filename ? filename.split(".") : [];
    while (parts.length < 2) parts.push('')

    const core = await (async (ext) => {
        if (["gb", "gba", "n64", "nds", "nes", "ngp", "pce", "ws"].includes(ext))
            return ext

        if (["z64"].includes(ext))
            return "n64"

        if (["fds", "unf", "unif"].includes(ext))
            return "nes"

        if (["ngc"].includes(ext))
            return "ngp"

        if (["bsx", "dx2", "fig", "gd3", "gd7", "sfc", "smc", "swc"].includes(ext))
            return "snes"

        if (["wsc"].includes(ext))
            return "ws"

        if (["a26"].includes(ext))
            return "atari2600"

        if (["a78"].includes(ext))
            return "atari7800"

        if (["lnx"].includes(ext))
            return "lynx"

        if (["col", "cv"].includes(ext))
            return "coleco"

        if (["d64"].includes(ext))
            return "vice_x64"

        if (["32x"].includes(ext))
            return "sega32x"

        if (["gg"].includes(ext))
            return "segaGG"

        if (["sms"].includes(ext))
            return "segaMS"

        return await new Promise(resolve => {
            const cores = {
                "Atari 2600": "atari2600",
                "Atari 7800": "atari7800",
                "Atari Jaguar": "jaguar",
                "Atari Lynx": "lynx",
                "Bandai WonderSwan (Color)": "ws",
                "ColecoVision": "coleco",
                "Commodore 128": "vice_x128",
                "Commodore 64": "vice_x64",
                "Commodore PET": "vice_xpet",
                "Commodore Plus/4": "vice_xplus4",
                "Commodore VIC20": "vice_xvic",
                "DOS": "dosbox_pure",
                "NEC PC-FX": "pcfx",
                "NEC TurboGrafx-16/SuperGrafx/PC Engine": "pce",
                "Nintendo 64": "n64",
                "Nintendo DS": "nds",
                "Nintendo Entertainment System": "nes",
                "Nintendo Game Boy Advance": "gba",
                "Nintendo Game Boy": "gb",
                "PlayStation Portable": "psp",
                "PlayStation": "psx",
                "SNK NeoGeo Pocket (Color)": "ngp",
                "Sega 32X": "sega32x",
                "Sega CD": "segaCD",
                "Sega Game Gear": "segaGG",
                "Sega Master System": "segaMS",
                "Sega Mega Drive": "segaMD",
                "Sega Saturn": "segaSaturn",
                "Super Nintendo Entertainment System": "snes",
                "Virtual Boy": "vb"
            }

            const button = document.createElement("button")
            const select = document.createElement("select")

            for (const type in cores) {
                const option = document.createElement("option")

                option.value = cores[type]
                option.textContent = type
                select.appendChild(option)
            }

            button.onclick = () => resolve(select[select.selectedIndex].value)
            button.textContent = "Load game"
            box.innerHTML = ""

            box.appendChild(select)
            box.appendChild(button)
        })
    })(parts.pop())

    const div = document.createElement("div")
    const sub = document.createElement("div")
    const script = document.createElement("script")

    sub.id = "game"
    div.id = "display"

    for (const id of ["top", "url", "version", "box"])
      document.getElementById(id).remove();

    div.appendChild(sub)
    document.body.appendChild(div)

    const cdn = window.cdn || "https://cdn.emulatorjs.org/stable/data/"

    window.EJS_player = "#game";
    window.EJS_gameName = parts.shift();
    window.EJS_biosUrl = "";
    window.EJS_gameUrl = url;
    window.EJS_core = core;
    window.EJS_pathtodata = cdn;
    window.EJS_startOnLoaded = true;
    //window.EJS_AdUrl = "ads.html";
    window.EJS_DEBUG_XX = window.debug;
    if (language.value !== "auto") {
        window.EJS_language = language.value;
    }
    if (core === "psp" || core === "dosbox_pure") {
        window.EJS_threads = true;
    }
    if (document.getElementById("use_netplay_server").checked) {
        const netplayServerUrl = document.getElementById("netplay_server_url").value;
        const netplayGameId = parseInt(document.getElementById("netplay_server_game_id").value, 10);

        if (netplayServerUrl && Number.isInteger(netplayGameId)) {
            window.EJS_netplayServer = netplayServerUrl;
            window.EJS_gameID = netplayGameId;
        }
    }
    window.EJS_ready = function() {
        //detectAdBlock("data:text/html;base64,DQo8aHRtbD48c3R5bGU+I2FkYmxvY2t7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC44KTtwb3NpdGlvbjpmaXhlZDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3RvcDowO2xlZnQ6MDt6LWluZGV4OjEwMDA7dGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6I2ZmZn1ib2R5LGh0bWx7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH1hIHtjb2xvcjogIzAwYWZlNDt9PC9zdHlsZT48Ym9keSBzdHlsZT0ibWFyZ2luOjAiPjxkaXYgaWQ9ImFkYmxvY2siPjxoMT5IaSBBZGJsb2NrIFVzZXIhPC9oMT48cD5BZHMgb24gdGhpcyBwYWdlIG1heSBjb21lIGFuZCBnbyBkZXBlbmRpbmcgb24gaG93IG1hbnkgcGVvcGxlIGFyZSBmdW5kaW5nIHRoaXMgcHJvamVjdC48YnI+WW91IGNhbiBoZWxwIGZ1bmQgdGhpcyBwcm9qZWN0IG9uIDxhIHRhcmdldD0iX2Fib3V0IiBocmVmPSJodHRwczovL3BhdHJlb24uY29tL0VtdWxhdG9ySlMiPnBhdHJlb248L2E+PC9wPjwvZGl2PjwvYm9keT48L2h0bWw+");
    }
    
    script.src = cdn + "loader.js";
    document.body.appendChild(script);
}

function loadJSON(url, callback) {
    if (typeof fetch === 'function') {
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return null;
                }
            })
            .then(data => callback(data))
            .catch(() => callback(null));
    } else {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4) {
                if (xobj.status === 200) {
                    callback(xobj.responseText);
                } else {
                    callback(null);
                }
            }
        };
        xobj.send();
    }
}

function loadVersions(response) {
    const version_select = document.getElementById("version-select");
    var versions = JSON.parse(response);
    version_select.innerHTML = "";
    addOptions(version_select, versions.releases, versions.default, versions.github);
    addOptions(version_select, { "custom": "" }, versions.default);
    addOptions(version_select, versions.versions, versions.default);
    version_select.addEventListener("change", () => {
        versionChange();
    });
}

function versionChange(key, value) {
    if (key && value) {
        localStorage.setItem("version", value);
        setCDNPath(key);
        checkSettings(value);
    } else {
        const version_select = document.getElementById("version-select");
        localStorage.setItem("version", version_select[version_select.selectedIndex].textContent);
        setCDNPath(version_select[version_select.selectedIndex].value);
        checkSettings(version_select[version_select.selectedIndex].textContent);
    }
}

function setCDNPath(option) {
    console.log("CDN Path: " + option);
    if (option === "custom/") {
        console.log("Using custom path");
        window.cdn = localStorage.getItem("custom_cdn");
    } else {
        window.cdn = "https://cdn.emulatorjs.org/" + option + "data/";
    }
}

function detectAdBlock(url) {
    let adBlockEnabled = false;
    try {
        const adframe = document.querySelector('iframe[src="' + window.EJS_AdUrl + '"]');
        var adpage = adframe.contentWindow.document;
        window.EJS_AdUrl = adframe.src;
        if (!adpage) {
            adBlockEnabled = true;
        }
    } catch (e) {
        adBlockEnabled = true;
    }
    if (adBlockEnabled) {
        window.EJS_adBlocked(url);
    }
}

function addOptions(select, options, default_option, github) {
    for (const version in options) {
        const option = document.createElement("option");
        option.value = options[version];
        if (version == "stable") {
            option.textContent = "stable (" + github + ")";
        } else {
            option.textContent = version;
        }
        const saveVersion = localStorage.getItem("version");
        if (version === "custom") {
            option.id = "custom-version";
            if (localStorage.getItem("custom_cdn")) {
                option.value = "custom/";
            } else {
                option.disabled = true;
            }
        }
        if ((saveVersion && saveVersion === version) || (!saveVersion && version === default_option.split("/")[0]) || saveVersion.includes(version)) {
            option.selected = true;
            versionChange(option.value, option.textContent);
        }
        select.appendChild(option);
    }
}

function loadSettings() {
    const settingsButton = document.getElementById("settings");
    const settingsClose = document.getElementById("settings-close");
    settingsButton.addEventListener("click", () => {
        document.getElementById("popup-settings").classList.add("show");
        if (localStorage.getItem("pwa") == "false") {
            checkinstall();
        }
    });
    settingsClose.addEventListener("click", () => {
        document.getElementById("popup-settings").classList.remove("show");
    });

    const netplayCheckbox = document.getElementById("use_netplay_server");
    const netplayServerUrlInput = document.getElementById("netplay_server_url");
    const netplayGameIdInput = document.getElementById("netplay_server_game_id");
    netplayCheckbox.addEventListener("change", () => {
        enableNetplay = netplayCheckbox.checked;
        if (enableNetplay) {
            localStorage.setItem("use_netplay_server", "true");
            netplayServerUrlInput.parentElement.classList.remove("hide");
            netplayGameIdInput.parentElement.classList.remove("hide");
        } else {
            localStorage.removeItem("use_netplay_server");
            netplayServerUrlInput.parentElement.classList.add("hide");
            netplayGameIdInput.parentElement.classList.add("hide");
        }
    });
    netplayServerUrlInput.addEventListener("change", () => {
        const netplayServerUrl = netplayServerUrlInput.value.trim();
        if (netplayServerUrl) {
            localStorage.setItem("netplay_server_url", netplayServerUrl);
        } else {
            localStorage.removeItem("netplay_server_url");
        }
    });
    netplayGameIdInput.addEventListener("change", () => {
        const netplayGameId = netplayGameIdInput.value.trim();
        if (netplayGameId) {
            localStorage.setItem("netplay_server_game_id", netplayGameId);
        } else {
            localStorage.removeItem("netplay_server_game_id");
        }
    });
    netplayCheckbox.checked = localStorage.getItem("use_netplay_server") === "true";
    netplayServerUrlInput.value = localStorage.getItem("netplay_server_url") || '';
    netplayGameIdInput.value = localStorage.getItem("netplay_server_game_id") || '';
    netplayCheckbox.dispatchEvent(new Event('change', {bubbles: true}));

    window.debug = false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const debugCheckbox = document.getElementById("debug");
    if (parseInt(urlParams.get('debug')) === 1 || urlParams.get('debug') === "true") {
        debug = true;
        console.log("Debug is enabled");
        debugCheckbox.checked = true;
    } else {
        console.log("Debug is disabled");
        debugCheckbox.checked = false;
    }

    debugCheckbox.addEventListener("change", () => {
        enableDebug = debugCheckbox.checked;
        console.log("Debug is now " + (enableDebug ? "enabled" : "disabled"));
        if (enableDebug) {
            history.replaceState(null, '', '?debug=1');
        } else {
            history.replaceState(null, '', window.location.pathname);
        }
    });

    let systemLang;
    try {
        systemLang = Intl.DateTimeFormat().resolvedOptions().locale;
    } catch(e) {}
    console.log("System language: " + systemLang);
    loadLanguages(systemLang, language);
    language.addEventListener("change", () => {
        const selectedLang = language.value;
        localStorage.setItem("language", selectedLang);
        console.log("Language changed to: " + selectedLang);
    });

    const customPathInput = document.getElementById("customPath");
    const customPathValid = document.getElementById("customPathValid");
    const savedPath = localStorage.getItem("custom_cdn");
    const urlRegex = /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/.*)?\/$/;
    if (savedPath && urlRegex.test(savedPath)) {
        customPathInput.value = savedPath;
        customPathValid.textContent = "Valid URL";
        customPathValid.style.color = "green";
    } else {
        localStorage.removeItem("custom_cdn");
    }
    let pathValid = false;
    customPathInput.addEventListener("input", () => {
        const customPath = customPathInput.value.trim();
        
        if (urlRegex.test(customPath)) {
            customPathValid.textContent = "Valid URL";
            customPathValid.style.color = "green";
            pathValid = true;
        } else if(customPath === "") {
            customPathValid.textContent = "";
            customPathValid.style.color = "";
            pathValid = false;
        } else {
            customPathValid.textContent = "Invalid URL";
            customPathValid.style.color = "red";
            pathValid = false;
        }
    });
    customPathInput.addEventListener("change", () => {
        const customOption = document.getElementById("custom-version");
        const versionSelect = document.getElementById("version-select");
        const customPath = customPathInput.value.trim();
        if (pathValid) {
            customOption.disabled = false;
            versionSelect.selectedIndex = 3;
            localStorage.setItem("custom_cdn", customPath);
        } else {
            customOption.disabled = true;
            versionSelect.selectedIndex = 0;
            localStorage.removeItem("custom_cdn");
        }
        versionChange();
    });

    const cacheButton = document.getElementById("cache");
    cacheButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the cache? This will remove all saved data.")) {
            localStorage.clear();
            console.log("Cleared localStorage");
            indexedDB.databases().then(dbs => {
                dbs.forEach(db => {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                    console.log(`Deleted IndexedDB: ${db.name}`);
                }
                });
            });
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(name => {
                        console.log(`Deleting cache: ${name}`);
                        return caches.delete(name);
                    })
                );
            });
        }
    });
}

function checkSettings(version) {
    if (version.includes("stable")) {
        version = version.replace("stable (", "").replace(")", "");
    }
    const langHelp = document.getElementById("languageHelp");
    if (version === "custom" || version === "latest" || version === "nightly" || version > "4.2.2") {
        console.log("Language Support: Enabled");
        language.disabled=false;
        language.style.width = "auto";
        langHelp.innerHTML = "";
    } else {
        console.log("Language Support: Disabled");
        language.disabled=true;
        language.style.width = "140px";
        langHelp.innerHTML = "Language selection isn't available for versions 4.2.2 and below.";
    }
}

function checkinstall(overide) {
    console.log("Checking install");
    if (navigator.userAgent.includes("Firefox") || (navigator.userAgent.includes("OPR") && !navigator.userAgent.includes("Mobile"))) {
        installButton.style.display = "none";
        installBoxText.innerHTML = "PWA's are not supported on this browser.";
        return;
    }
    if (window.matchMedia('(display-mode: standalone)').matches || overide) {
        installButton.textContent = "Installed";
        installButton.disabled = true;
        installButton.style.display = "inline";
        installBoxText.innerHTML = "Install PWA: ";
    } else {
        installButton.style.display = "none";
        if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
            installBoxText.innerHTML = "PWA's are supported on this browser, but prompt is not supported.<br> Please install manually";
            return;
        }
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then((relatedApps) => {
                if (relatedApps.length > 0) {
                    checkinstall(true);
                    return;
                }
            });
        }
        installBoxText.innerHTML = "PWA is either already installed, or prompt is not supported on this browser.<br> Please install manually.<br>Note: PWA's are not supported in Incognito/Private mode.";
    }
}

function loadLanguages(sysLang, lang_select) {
    langs = {
        "auto": "Auto (" + sysLang + ")",
        "en": "English (US)",
        "pt": "Portuguese (Brazil)",
        "es": "Spanish (Latin America)",
        "el": "Greek (Modern Greek)",
        "ja": "Japanese (Japan)",
        "zh": "Chinese (Simplified)",
        "hi": "Hindi (India)",
        "ar": "Arabic (Saudi Arabia)",
        "jv": "Javanese (Indonesia)",
        "bn": "Bengali (Bangladesh)",
        "ru": "Russian (Russia)",
        "de": "German (Germany)",
        "ko": "Korean (South Korea)",
        "af": "French (France)",
        "it": "Italian (Italy)",
        "tr": "Turkish (Turkey)",
        "fa": "Persian (Afghanistan)",
        "ro": "Romanian (Romania)",
        "vi": "Vietnamese (Vietnam)"
    };
    for (const lang in langs) {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = langs[lang];
        lang_select.appendChild(option);
    }
    let selectedLang = localStorage.getItem("language");
    if (selectedLang) {
        lang_select.value = selectedLang;
    } else {
        localStorage.setItem("language", "auto");
    }
}
