var express = require('express');
var router = express.Router();

router.get('/create', function(req, res, next) {
    res.render('wallet/create', {});
});

module.exports = router;
