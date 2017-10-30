var express = require('express');
var router = express.Router();

var cryptico = require('cryptico');
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
1. Generate RSA private key
2. Generate public key from the private key
3. Store the private key in the file
4. Store the public key in the file with .pub extension
*/
router.post('/create_post', function(req, res, next) {

    var fileName   = req.body.filename;
    var passphrase = req.body.passphrase;

    // 1.
    var rsaKeyPrivate = cryptico.generateRSAKey(passphrase, 512);
    console.log('rsaKeyPrivate', JSON.stringify(rsaKeyPrivate));

    // 2.
    var rsaKeyPublic = cryptico.publicKeyString(rsaKeyPrivate);
    //console.log('rsaKeyPublic', rsaKeyPublic)

    var keychainFile = appRoot + '/thedata/key/' + fileName;

    var returnFail = function(msg) {
        res.redirect('/wallet/create?flash_msg=' + encodeURI(msg));
    }

    fs.open(keychainFile, 'wx', function(err){
        if(err) {
            if(err.code === 'EEXIST') {
                returnFail('File exists');
                return;
            }
            throw err;
        }
        else {
            // 3.
            fs.writeFile(keychainFile, JSON.stringify(rsaKeyPrivate.toJSON()), function(errB){
                if(errB) {
                    returnFail(errB);
                }
                else {
                    // 4.
                    fs.writeFile(keychainFile + '.pub', rsaKeyPublic, function(errC){
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
