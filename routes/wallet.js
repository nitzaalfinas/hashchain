var express = require('express');
var router = express.Router();

var ursa     = require('ursa');
var fs       = require('fs');
var appRoot  = require('app-root-path');

router.get('/create', function(req, res, next) {
    res.render('wallet/create', {
        flash_msg: req.query.flash_msg
    });
});

/**
Creating wallet

---
Process
1. Generate key
2. Generate RSA private key
3. Generate public key from the private key
4. Store the private key in the file
5. Store the public key in the file with .pub extension
*/
router.post('/create_post', function(req, res, next) {

    var fileName   = req.body.filename;
    var passphrase = req.body.passphrase;

    // 1.
    var key = ursa.generatePrivateKey(1024, 65537);

    // 2.
    var privkeypem = key.toPrivatePem();

    // 3.
    var pubkeypem = key.toPublicPem();

    var keychainFile = appRoot + '/thedata/key/' + fileName;

    var returnFail = function(msg) {
        res.redirect('/wallet/create?flash_msg=' + encodeURI(msg));
    }

    fs.open(keychainFile + '.pri.pem', 'wx', function(err){
        if(err) {
            if(err.code === 'EEXIST') {
                returnFail('File exists');
                return;
            }
            throw err;
        }
        else {
            // 4.
            fs.writeFile(keychainFile + '.pri.pem', privkeypem, function(errB){
                if(errB) {
                    returnFail(errB);
                }
                else {
                    // 5.
                    fs.writeFile(keychainFile + '.pub.pem', pubkeypem, function(errC){
                        if(errC) {
                            returnFail(errC);
                        }
                        else {
                            res.redirect('/wallet/create?flash_msg=Cool');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
