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
The public key and the private key are stored in thedata/key folder
*/
router.post('/create_post', function(req, res, next) {

    var returnFail = function(msg) {
        res.redirect('/wallet/create?flash_msg=' + encodeURI(msg));
    }

    var fileName   = req.body.filename;
    var passphrase = req.body.passphrase;

    var rsaKeyPrivate = cryptico.generateRSAKey(passphrase, 512);
    console.log('rsaKeyPrivate', JSON.stringify(rsaKeyPrivate));

    var rsaKeyPublic = cryptico.publicKeyString(rsaKeyPrivate);
    //console.log('rsaKeyPublic', rsaKeyPublic)

    var keychainFile = appRoot + '/thedata/key/' + fileName;

    fs.open(keychainFile, 'wx', function(err){
        if(err) {
            if(err.code === 'EEXIST') {
                returnFail('File exists');
                return;
            }
            throw err;
        }
        else {
            fs.writeFile(keychainFile, JSON.stringify(rsaKeyPrivate), function(errB){
                if(errB) {
                    returnFail(errB);
                }
                else {
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
