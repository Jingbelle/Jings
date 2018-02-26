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
    .post(authController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
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
router.get('/movies/:id', function(req,res){

    var user=db.find(req.body.id);
    if(!user)
    {
        res.status(202).send({success:false, msg: 'Movie not found. '}+user);
    }
    else res.send(user);
})
router.get('/movies/:name',function(req,res){
    var user=db.findOne(req.body.username);
    if(!user){
        res.status(202).send({success:false, msg: 'Movie not found. '}+user);}
        else
        {
         res.send(user);
        }


})
router.put('/movies/:id',function(req,res){
    var update=req.body;
    var id=db.find(req.body.id);
    if(!id){
        res.status(202).send({success:false, msg: 'No movie'});
    }
    else {
        console.log('Update successfully');
        res.send(db.update(id,update)  );
    }


})
router.delete('/movies/:id/:username/:password',function(req,res){
    var id=db.find(req.body.id);
        if(!id)
        {
            res.status(202).send({success: false, msg: 'Movie not found' });

        }
        else{
            var user=db.findOne(req.body.username);
            if(!user)
            {
                res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            }
            else {
                // check if password matches
                if (req.body.password == user.password)  {
                    var userToken = { id : user.id, username: user.username };
                    var token = jwt.sign(userToken, process.env.SECRET_KEY);
                    res.json({success: true, token: 'JWT ' + token});
                    if(db.remove(user.id)==1)
                        res.status(200);
                    else
                        res.status(201);
                }
                else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            };
        }
})
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


app.use('/', router);
app.listen(process.env.PORT || 5555);