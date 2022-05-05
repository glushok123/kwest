
// global.js - shared variables storaged at local storage.

const basic = {}
basic.storage = {
    save(t, e) {
        window.localStorage.setItem(t, JSON.stringify(e))
    },
    load: t => JSON.parse(window.localStorage.getItem(t)),
    remove(t) {
        window.localStorage.removeItem(t)
    }
};
var storage = basic.storage;

var global = {}

global.appId = "kwest"

global.settings = {}

global.settings.user_name = 0
global.settings.user_pass = 0
global.settings.token_auth = 0
global.settings.token_auth_data = 0
global.settings.token_one = 0
global.settings.firstname = ""
global.settings.lastname = ""
global.settings.prov_auth = 0

var saveGlobal = function() {
    storage.save(global.appId + "-global-vars", global)
}

var loadGlobal = function() {
    global = storage.load(global.appId + "-global-vars") || global
}

var clearGlobal = function() {
    global.settings.user_name = 0
    global.settings.user_pass = 0
    global.settings.token_auth = 0
    global.settings.token_auth_data = 0
    global.settings.token_one = 0
    global.settings.firstname = ""
    global.settings.lastname = ""
    global.settings.prov_auth = 0
    saveGlobal();
}



/*

function setLocalStorage() {
   localStorage.setItem("Name", "John");
   localStorage.setItem("Job", "Developer");
   localStorage.setItem("Project", "Cordova Project");
}

function showLocalStorage() {
   console.log(localStorage.getItem("Name"));
   console.log(localStorage.getItem("Job"));
   console.log(localStorage.getItem("Project"));
}

function removeProjectFromLocalStorage() {
   localStorage.removeItem("Project");
}

function getLocalStorageByKey() {
   console.log(localStorage.key(0));
}





document.getElementById("setLocalStorage").addEventListener("click", setLocalStorage);
document.getElementById("showLocalStorage").addEventListener("click", showLocalStorage);
document.getElementById("removeProjectFromLocalStorage").addEventListener
   ("click", removeProjectFromLocalStorage);
document.getElementById("getLocalStorageByKey").addEventListener
   ("click", getLocalStorageByKey);
  */
