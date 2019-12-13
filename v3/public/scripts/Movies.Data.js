'use strict';

Movies.prototype.getAllStats = function () {
    var that = this;

    const query = firebase.firestore()
        .collection('Stats').get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                that.renderStats(doc.id, doc.data()['value']);
            });
        });
};

Movies.prototype.increaseStats = function (docName) {
    
    const collection = firebase.firestore().collection('Stats');
    let docRef = collection.doc(docName);

    var newValue = 0
    var that = this;
    docRef.get().then((doc) => {
        if (doc.exists) {
            let dbTotal = doc.data()['value']
            newValue = dbTotal + 1;
            docRef.set({
                'value': newValue
            })
            that.renderStats(docName, newValue)
        }

    }).catch((error) => {
        console.log("Error getting document:", error);
    });
};

Movies.prototype.addMovie = function (data) {
    const collection = firebase.firestore().collection('Movies');
    var that = this;
    return collection.add(data).then(function (docRef) {
        that.increaseStats('added')
    });
};

Movies.prototype.updateMovie = function (movieID, data) {
    const collection = firebase.firestore().collection('Movies');
    var that = this;
    return collection.doc(movieID).update(data).then(function (docRef) {
        that.increaseStats('edited')
    });
}

Movies.prototype.deleteMovie = function (movieID) {
    const collection = firebase.firestore().collection('Movies');
    var that = this;
    return collection.doc(movieID).delete().then(function (docRef) {
        that.increaseStats('deleted')
    });
};


Movies.prototype.getAllMovies = function (render) {
    const query = firebase.firestore()
        .collection('Movies')
        .orderBy('name')

    this.getDocumentsInQuery(query, render);
};


Movies.prototype.getDocumentsInQuery = function (query, render, nameFilter) {
    query.onSnapshot((snapshot) => {

        if (!snapshot.size) {
            return render();
        }

        this.renderStats('total', snapshot.size)
        var docChanges = snapshot.docChanges();

        if (nameFilter) {

            var filteredDocChanges = [];
            docChanges.forEach(change => {

                let lowercasedName = nameFilter.toLowerCase();
                let lowercasedDocName = change.doc.data()['name'].toLowerCase()

                if (lowercasedDocName.includes(lowercasedName)) {
                    filteredDocChanges.push(change)
                }
            });

            docChanges = filteredDocChanges;
        }

        docChanges.forEach((change) => {

            if (change.type === 'added' || change.type === 'modified') {
                render(change.doc);
            } else if (change.type === 'removed') {
                this.deleteElement(change.doc);
            }
        });
    });
};

Movies.prototype.getFilteredMovies = function (nameFilter, render) {
    let query = firebase.firestore().collection('Movies');

    this.getDocumentsInQuery(query, render, nameFilter);
};