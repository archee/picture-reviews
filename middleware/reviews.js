var mongojs = require("mongojs"),
    assert = require("assert");

var reviews = exports;

var db = mongojs('mongodb://192.168.1.115:27017/picturedb', ['reviews']);

db.on('error',function(err) {
    console.log('database error', err);
});

db.on('ready',function() {
    console.log('database connected');
});

reviews.createPictureReview = function(review, callback) {
    var pictureUrl = review['pictureUrl'];
    var rating = review['rating'];
    var comments = review['comments'];

    console.log('Updating DB with {p}, {r}, {c}'
        .replace('{p}', pictureUrl)
        .replace('{r}', rating))
        .replace('{c}', comments);

    db.reviews.find({url: pictureUrl}, function (err, doc) {
        if (!doc) {
            db.reviews.insert({
                url: pictureUrl,
                rating: rating || '',
                comments: comments || ''
            });
        } else {
            if (rating) {
                db.reviews.update({url: pictureUrl}, {
                    $set: {
                        rating: rating
                    }
                });
            }

            if (comments) {
                db.reviews.update({url: pictureUrl}, {
                    $set: {
                        comments: comments
                    }
                });
            }
        }
    });
};
