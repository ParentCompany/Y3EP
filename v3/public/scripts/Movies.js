'use strict';

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

Movies.prototype.getCleanPath = function (dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
        return dirtyPath.split('/').slice(1).join('/');
    } else {
        return dirtyPath;
    }
};


window.onload = function () {
    window.app = new Movies();
};