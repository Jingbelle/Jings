var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //global hack
var jwt = require('jsonwebtoken');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

var router = express.Router();

router.route('/post')
    .delete(authController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
        var id=req.body.id;
        if(!id)
        {res.status(202).send({success: false, msg: 'Movie not found' });
        }
        else{
            if(db.remove(id)==1)
                res.send({success: true});
            else
                res.send({success: false});

            }

        }
    );
router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.get('/movies/:username',function(req,res){
    var user=db.findOne(req.params.username);
    if(!user) {
        res.send('  No such movie ');
    }
        else
    res.send('Success movie id is :'+user.id);

});
router.post('/',function(req,res){
    var user=db.find(req.body.id);
    res.send(user);
    if(!user) {
        res.send('  No such movie ');
    }
    else
        res.send('Success movie id is :'+user);

});
router.put('/moviesupdate',function(req,res){
   // var update=req.body;
    var id=db.find(req.body.id);
    if(!id){
        res.status(202).send({success:false, msg: 'No movie'});
    }
    else {
        var ret=db.update(req.body.id,req.body);
       if(ret==1)
           res.send('success true');
       else
           if(ret==0)
           res.send('success false');
    }


});

router.post('/movies', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };
        // save the user
        db.save(newUser); //no duplicate checking
        res.json({success: true, msg: 'Successful created new user.'});
    }
});
router.post('/signin',function(req,res)
{
    var user=db.findOne(req.body.username);
    if(!user){
        res.status(401).send({success: false, msg: 'Authentication failed'});
        }
    else {
        if(req.body.password==user.password){
          var userToken={id:user.id, username: user.username};
          var token=jwt.sign(userToken,authJwtController.secret);
          res.json({success: true, token: 'JWT' +token});
        }
        else {
            res.status(401).send({success:false, msg: 'Authentication failed'});
        }

    }
})
router.patch('/',function(req,res){
    res.send('Reject this method');
});
router.copy('/',function(req,res){
    res.send('Reject this method');
});
router.head('/',function(req,res){
    res.send('Reject this method');
});
router.options('/',function(req,res){
    res.send('Reject this method');
});
router.link('/',function(req,res){
    res.send('Reject this method');
});
router.unlink('/',function(req,res){
    res.send('Reject this method');
});
router.purge('/',function(req,res){
    res.send('Reject this method');
});
router.lock('/',function(req,res){
    res.send('Reject this method');
});
router.unlock('/',function(req,res){
    res.send('Reject this method');
});
router.propfind('/',function(req,res){
    res.send('Reject this method');
});







app.use('/', router);
app.listen(process.env.PORT || 5000);
