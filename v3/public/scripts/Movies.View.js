'use strict';

// This section is responsible for formatting and updating the html with right data from user or from server.

Movies.ID_CONSTANT = 'fir-';
var selectedID = '';

Movies.prototype.initTemplates = function () {
    this.templates = {};

    var that = this;
    document.querySelectorAll('.template').forEach(function (el) {
        that.templates[el.getAttribute('id')] = el;
    });

};

// this calls the all movies function to retrive all the data from firestore

Movies.prototype.viewHome = function () {
    this.getAllMovies();
};

// 

Movies.prototype.viewList = function (nameFilter) {
    var tableBody = this.renderTemplate('table-body');
    var renderedTableBody = document.querySelector('#table-body');
    var that = this;

    // incase the data is 0 so it wont shows rows of empty table on html
    var renderResults = function (doc) {

        if (!doc) {
            renderedTableBody.innerHTML = '';
            document.querySelector('#total-movies').innerHTML = '0';
            return;
        }

// creating table rows to populate the data inside them

        var data = doc.data();
        data['.id'] = doc.id;

        let rowID = '#' + Movies.ID_CONSTANT + doc.id;
        var existingMovieCardEl = document.querySelector(rowID);
        var el = existingMovieCardEl || that.renderTemplate('table-row', data);

        if (!existingMovieCardEl) {
            renderedTableBody.append(el);
        } else {
            that.render(existingMovieCardEl, data);
        }
    };

    renderedTableBody.innerHTML = '';

    if (nameFilter) {
        this.getFilteredMovies(nameFilter, renderResults);

    } else {
        this.getAllMovies(renderResults);
    }
};


Movies.prototype.viewSetup = function () {
    //In case we need some initial config later
};

// initiating all the modals for data collection from the user 

Movies.prototype.initModalDialog = function () {

    let addDialog = document.querySelector('#modal-form-add');
    let editDialog = document.querySelector('#modal-form-edit');
    let deleteDialog = document.querySelector('#modal-form-delete');
    var that = this;

    addDialog.querySelector('#add-action').addEventListener('click', function () {
        var data = {};

        var validated = true
        addDialog.querySelectorAll('input').forEach(inputElement => {
            if (inputElement.value == '') { validated = false }
            data[inputElement.id] = inputElement.value;
            inputElement.value = '';
        });
// sending the data to firestore and alerting the user that it has been successful. the application will save the data even if you are offline.
        if (validated) {
            that.addMovie(data);
            document.querySelector("#add-dismiss").click();
            setTimeout(function(){ swal("Way to go!", "You have successfully added a new movie!", "success"); }, 800);
        }
    });

    editDialog.querySelector('#edit-action').addEventListener('click', function () {

        var data = {};
        var validated = true
        
        editDialog.querySelectorAll('input').forEach(inputElement => {
            if (inputElement.value == '') { validated = false }
            data[inputElement.id] = inputElement.value;
        });

        if (validated) {
            that.updateMovie(that.selectedID, data);
            document.querySelector("#edit-dismiss").click();
            setTimeout(function(){ swal("Looks way better now!", "You have successfully edited a movie!", "success"); }, 800);
        }
    });


    deleteDialog.querySelector('#delete-action').addEventListener('click', function () {
        that.deleteMovie(that.selectedID);
        document.querySelector("#delete-dismiss").click();
        setTimeout(function(){ swal("On its way to the bin!", "You have successfully deleted a movie!", "success"); }, 800);
    });
};

// this is for the search action section 

Movies.prototype.initSearchFilterDialog = function () {

    let searchInput = document.querySelector('#search-input');
    let searchButton = document.querySelector('#search-action');
    var that = this;

    searchButton.addEventListener('click', function () {
        that.viewList(searchInput.value);
    });
// when you delete it it will clear the value

    searchInput.addEventListener('keyup', function () {
        if (searchInput.value == '') {
            that.viewList();
        }
    })

    searchInput.addEventListener('keypress', function (event) {
        let key = event.which || event.keyCode;
        if (key === 13) {
            that.viewList(searchInput.value);
        }
    })
};



Movies.prototype.renderTemplate = function (id, data) {
    var template = this.templates[id];
    template.removeAttribute('hidden');


    var el = template.cloneNode(true);
    el.removeAttribute('hidden');
    this.render(el, data);

    if (data && data['.id']) {
        el.id = Movies.ID_CONSTANT + data['.id'];
    }

    return el;
};

// this is just for the data to be shown on the HTML for all sections so i will not be commenting as its very easy to undrestand due to the variable name used

Movies.prototype.render = function (el, data) {

    if (!data) {
        return;
    }

    var that = this;
    var modifiers = {
        'data-fir-content': function (tel) {
            var field = tel.getAttribute('data-fir-content');
            tel.innerText = that.getDeepItem(data, field);
        },

        'data-fir-review': function (tel) {
            var field = tel.getAttribute('data-fir-review');

            let review = that.getDeepItem(data, field);
            let reviewPercentage = review + '%';
            tel.querySelector('span').innerText = reviewPercentage;
            tel.querySelector('#review-progress').setAttribute('style', 'width: ' + reviewPercentage);
        },

        'data-fir-click': function (tel) {
            tel.addEventListener('click', function () {
                let field = tel.getAttribute('data-fir-click');
                this.selectedID = data['.id'];

                var editDialog = document.querySelector('#modal-form-edit');
                that.selectedID = data['.id'];

                if (field == 'edit') {
                    editDialog.querySelectorAll('input').forEach(input => {
                        input.value = data[input.id];
                    });
                }

            });
        }
    };

    Object.keys(modifiers).forEach(function (selector) {
        var modifier = modifiers[selector];
        that.useModifier(el, selector, modifier);
    });
};


Movies.prototype.useModifier = function (el, selector, modifier) {
    el.querySelectorAll('[' + selector + ']').forEach(modifier);
};

Movies.prototype.getDeepItem = function (obj, path) {

    var that = this;
    path.split('/').forEach(function (chunk) {
        obj = obj[chunk];
    });

    if (path == 'budget') {
        return that.renderBudget(obj);
    }
    return obj;
};

Movies.prototype.replaceElement = function (parent, content) {
    parent.innerHTML = '';
    parent.append(content);
};

// This is the delete process that will first sync the data with the firebase firestore then it updates the View or the HTML

Movies.prototype.deleteElement = function (doc) {
    var data = doc.data();
    data['.id'] = doc.id;

    let rowID = '#' + Movies.ID_CONSTANT + data['.id'];
    let rowElement = document.querySelector(rowID);
    rowElement.parentElement.removeChild(rowElement);
};

// This is the navigator or the task router that requires a time stamp in order to verfiy

Movies.prototype.rerender = function () {
    this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};

// the budget showed as a full integer so I had to add a dollar sign before the integer

Movies.prototype.renderBudget = function (price) {
    return '$' + price;
};

// This part will try to get the data from the firbase and mask the data on the element on HTML 

Movies.prototype.renderStats = function (statState, value) {
    let labelElement = document.querySelector('#' + statState + '-movies');
    labelElement.innerText = value;
};
