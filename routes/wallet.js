var express = require('express');
var router = express.Router();

var cryptico = require('cryptico');

router.get('/create', function(req, res, next) {
    res.render('wallet/create', {});
});

/**
Creating wallet

---
Process
The public key and the private key are stored in thedata/key folder
*/
router.post('/create_post', function(req, res, next) {

    var rsaKeyPrivate = cryptico.generateRSAKey(req.body.passphrase, 512);

    var rsaKeyPublic = cryptico.publicKeyString(rsaKeyPrivate);

    
});

module.exports = router;
