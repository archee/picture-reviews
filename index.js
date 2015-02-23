var Hapi = require('hapi'),
    reviews = require('./middleware/reviews');

var server = new Hapi.Server();
var port = Number(process.env.PORT || process.argv[2] || 3000);

server.connection({port: port});

server.route([
    {
        method: '*',
        path: '/{p*}',
        handler: function (request, reply) {
            log(request);

            reply("Path or method not supported.").code(400);
        }
    },

    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            log(request);

            reply('Welcome to the Picture Reviews back end!');
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