var mongojs = require("mongojs")

var reviews = exports;

var db = mongojs('mongodb://localhost:27017/picturedb', ['reviews']);

db.on('error',function(err) {
    console.log('database error', err);
});

db.on('ready',function() {
    console.log('database connected');
});

reviews.getAllReviews = function(callback) {
    db.reviews.find({}, function( err, doc ) {
        if (err) {
            return callback(err);
        }

        return callback(null, doc);
    });
};

reviews.createPictureReview = function(review, callback) {
    var pictureUrl = review['pictureUrl'];
    var rating = review['rating'];
    var comments = review['comments'];

    db.reviews.findOne({url: pictureUrl}, function (err, doc) {

        if (err) return callback(err);

        if (!doc) {
            db.reviews.save({
                url: pictureUrl,
                rating: rating || '',
                comments: comments || ''
            }, function(err, doc) {
                if (err) return callback(err);

                console.log("Created picture review document for URL: " + pictureUrl);
                console.log(JSON.stringify(doc));
            });
        } else {
            if (rating) {
                db.reviews.update({url: pictureUrl}, {
                    $set: {
                        rating: rating
                    }
                }, function(err, doc) {
                    if (err) return callback(err);

                    console.log("Updated picture review document for URL: " + pictureUrl);
                    console.log(JSON.stringify(doc));
                });
            }

            if (comments) {
                db.reviews.update({url: pictureUrl}, {
                    $set: {
                        comments: comments
                    }
                }, function(err, doc) {
                    if (err) return callback(err);

                    console.log("Updated picture review document for URL: " + pictureUrl);
                    console.log(JSON.stringify(doc));
                });
            }
        }

        callback();
    });
};