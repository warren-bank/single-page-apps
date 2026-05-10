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
    const lang_select = document.getElementById("language");
    loadLanguages(systemLang, lang_select);
    lang_select.addEventListener("change", () => {
        const selectedLang = lang_select.value;
        window.language = selectedLang;
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
    const lang_select = document.getElementById("language");
    const langHelp = document.getElementById("languageHelp");
    if (version === "custom" || version === "latest" || version === "nightly" || version > "4.2.2") {
        console.log("Language Support: Enabled");
        lang_select.disabled=false;
        lang_select.style.width = "auto";
        langHelp.innerHTML = "";
    } else {
        console.log("Language Support: Disabled");
        lang_select.disabled=true;
        lang_select.style.width = "140px";
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
