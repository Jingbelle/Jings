var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

var secretOrKey = process.env.UNIQUE_KEY;
if(secretOrKey=='mysecretkeythatshouldnotnestoredhere')
{
    console.log(process.env);
}
var router = express.Router();

testob={"username":"jjj","password": "passjj"};
router.route('/delete')
    .delete(authController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
        var user=req.body.username;
        if(!user)
        {res.json('no user');
        }
        else{
            if(testob.username==user)
                res.json('success delete: '+user);
            else
                res.json('delete false: '+user);

            }

        }
    );


router.get('/get/:username',function(req,res){
    var user=req.params.username;
    if(!user) {
        res.send('  un valid ');
    }
        else {
        if (user == testob.username)
            res.send('get request matches successfully :' + user);
        else res.send('get request does not match:' + user);
    }
});

router.put('/put',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    if(!username||!password){
        res.status(202).send('un valid');
    }
    else {
        testob.username=username;
        testob.password=password;
        res.json("put request updates:"+username+' + '+password);
    }
});

router.post('/post', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };


        res.json('new user :'+' username: '+newUser.username+' password: '+newUser.password);
    }
});

router.patch('/patch',function(req,res){
    res.send('Reject this method');
});
router.copy('/copy',function(req,res){
    res.send('Reject this method');
});
router.head('/head',function(req,res){
    res.send('Reject this method');
});
router.options('/options',function(req,res){
    res.send('Reject this method');
});
router.link('/link',function(req,res){
    res.send('Reject this method');
});
router.unlink('/unlink',function(req,res){
    res.send('Reject this method');
});
router.purge('/purge',function(req,res){
    res.send('Reject this method');
});
router.lock('/lock',function(req,res){
    res.send('Reject this method');
});
router.unlock('/unlock',function(req,res){
    res.send('Reject this method');
});
router.propfind('/profind',function(req,res){
    res.send('Reject this method');
});







app.use('/', router);
app.listen(process.env.PORT || 5000);
