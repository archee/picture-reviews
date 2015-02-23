var express = require('express'),
    reviews = require('../middleware/reviews');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send("Hello, World!");
  res.render('index', { title: 'Express with ejs' });
});

router.post('/reviews', function (req, res, next) {
    reviews.createPictureReview(req.body);
});

module.exports = router;
