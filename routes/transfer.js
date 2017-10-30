var express = require('express');
var router = express.Router();

var cryptico = require('cryptico');
var fs       = require('fs');
var appRoot  = require('app-root-path');

router.get('/', function(req, res, next) {
    res.render('transfer/index', {
        flash_msg: req.query.flash_msg
    });
});

router.post('/post', function(req, res, next) {

    var myPrivatekeyFile = appRoot + '/thedata/key/' + req.body.my_private_key;
    var publicKeyReceiver = req.body.public_key_receiver;
    var message = req.body.message;
    var passphrase = req.body.passphrase;

    var returnFail = function(msg) {
        res.redirect('/transfer?flash_msg=' + encodeURI(msg));
    }


    // the private key file must be exists
    var checkingFile = fs.existsSync(myPrivatekeyFile);
    if(checkingFile == true) {
        var privateKeyString = fs.readFileSync(myPrivatekeyFile).toString();
        console.log('privateKeyString', privateKeyString);

        var myPrivateKey = cryptico.RSAKey.parse(privateKeyString); // please read the cryptico source for this or you can read this https://stackoverflow.com/questions/27637516/save-rsa-key-object-from-cryptico-js
        console.log('myPrivateKey', myPrivateKey);

        var encryptionResult = cryptico.encrypt(message, publicKeyReceiver, myPrivateKey);
        console.log('encryptionResult', encryptionResult);

        res.redirect('/transfer?flash_msg=' + encodeURI(JSON.stringify(encryptionResult)));

    }
    else {
        returnFail('File doesn\'t exists');
    }

});

module.exports = router;
