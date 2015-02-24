var Hapi = require('hapi'),
    Path = require('path'),
    reviews = require('./middleware/reviews');

var server = new Hapi.Server();
var port = Number(process.env.PORT || process.argv[2] || 3000);
server.connection({port: port});

server.views({
    engines: { jade: require('jade') },
    path: Path.join(__dirname, 'views')
});

console.log("Path is: " + Path.join(__dirname, 'views'));

server.route([
    {
        method: 'GET',
        path: '/css/{p*}',
        handler: {
            directory: {
                path: "views/css",
                listing: false,
                index: false
            }
        }
    },

    {
        method: 'GET',
        path: '/img/{p*}',
        handler: {
            directory: {
                path: "views/img",
                listing: false,
                index: false
            }
        }
    },

    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            log(request);

            reviews.getAllReviews(function (err, reviewList) {
                    if (err) {
                        reply(err).code(500);
                        return;
                    }

                    reply.view('index', { reviews: reviewList });
                }
            );

        }
    },

    {
        method: 'POST',
        path: '/reviews',
        handler: function (request, reply) {
            log(request);

            var review = request.payload;
            reviews.createPictureReview(review, function (err, data) {
                if (err) {
                    console.error("Got an error from mongo: " + err);
                    return;
                }

                reply(data);
            });
        }
    },

    {
        method: 'GET',
        path: '/reviews',
        handler: function (request, reply) {
            reviews.getAllReviews(function (err, doc) {
                    if (err) {
                        reply(err).code(500);
                        return;
                    }

                    reply(doc);
                }
            );
        }
    }
]);

server.start(function () {
    console.log('Server running at: ', server.info.uri);
});

function log(request) {
    console.log(new Date().toString() + ": Got a request from " + request.info.remoteAddress +
    " - requesting path: " + request.path);
    if (request.payload) {
        console.log(request.payload);
    }
}