var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
db = require('./db')(); //global hack
var jwt = require('jsonwebtoken');
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


router.get('/movies/:username',function(req,res){
    var user=db.findOne(req.params.username);
    if(!user) {
        res.send('  No such movie ');
    }
        else
    res.send('Success movie id is :'+user.id);

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
