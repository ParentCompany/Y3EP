'use strict';
// This class is the initiator for the Firebase to run and direct to the HTML page which is the index.html 
function Movies() {

    var that = this;
    firebase.firestore().enablePersistence()
        .then(function () {
            return firebase.auth().signInAnonymously();
        })
        .then(function () {
            that.initTemplates();
            that.initRouter();
            that.initModalDialog();
            that.initSearchFilterDialog();
            
        }).catch(function (err) {
            console.log(err);
        });
}

// this is a task router or a path finder function for the firebase to get the view / html page

Movies.prototype.initRouter = function () {
    this.router = new Navigo();

    var that = this;
    this.router
        .on({
            '/': function () {
                that.viewList();
                that.getAllStats();
            }
        })
        .resolve();
};

// this will make the path user-friendly rather than some numbers and letters cause that's what firebase does to encode the URL path.

Movies.prototype.getCleanPath = function (dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
        return dirtyPath.split('/').slice(1).join('/');
    } else {
        return dirtyPath;
    }
};

// Loding the function above as soon as the page is loaded.

window.onload = function () {
    window.app = new Movies();
};