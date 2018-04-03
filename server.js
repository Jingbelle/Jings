const crypto = require("crypto");
var rp = require('request-promise');
var express = require('express'),
    app = express(),

    mongoose = require('mongoose'),

    Movie = require('./moviemodule'),
    users=require('./usermodule');
require('./userct.js');
Review=require('./review.js');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admintest:admintest@ds163418.mlab.com:63418/webdb');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
require('dotenv').config();
var authJwtController = require('./auth_jwt');

var jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
var rou=require('./userou.js');
rou(app);
var router = express.Router();
var movie=mongoose.model('Movie'),
    Review=mongoose.model('Review');
var con=require('./moviect.js');
router.route('/movies/:Title')
    .get(authJwtController.isAuthenticated,function(req,res){
        con.read_a_task(req,res);
    });
router.route('/movies')
    .get(authJwtController.isAuthenticated,function (req, res) {
        con.list_all_tasks(req,res);

    });

router.route('/movies/:Title/reviews?:rei')
    .get(authJwtController.isAuthenticated,function(req,res){
        if(req.query.rei!='true')
            res.send("No review ");
        else
            Movie.aggregate([
                {
                    $match:{"Title": req.params.Title}
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: "Title",
                        foreignField: "Title",
                        as: "Reviews"
                    }
                }

            ], function (err, comments) {
                if (err)

                    res.send(err);
                res.json(comments);
            });
    });
router.route('/reviews')
    .post(authJwtController.isAuthenticated,function(req,res){
        var new_task =new Review();
        new_task.RVName=process.env.USERNAME;
        new_task.Title = req.body.Title;
        new_task.Quote=req.body.Quote;
        new_task.Rating=req.body.Rating;
        new_task.save(function(err, task) {
            if (err)
                res.send(err);
            res.json(task);
        });

    });
router.route('/movies')
    .post(authJwtController.isAuthenticated,function (req, res) {
        con.create_a_task(req,res);

    });
router.route('/movies/:taskId')
    .get(authJwtController.isAuthenticated,function (req, res) {
        con.read_a_task(req,res);

    });
router.route('/movies/:taskId')
    .put(authJwtController.isAuthenticated,function (req, res) {
        con.update_a_task(req,res);

    });
router.route('/movies/:taskId')
    .delete(authJwtController.isAuthenticated,function (req, res) {
        con.delete_a_task(req,res);

    });
const GA_TRACKING_ID = process.env.GA_KEY;

function trackDimension(category, action, label, value, dimension, metric) {

    var options = { method: 'GET',
        url: 'https://www.google-analytics.com/collect',
        qs:
            {   // API Version.
                v: '1',
                // Tracking ID / Property ID.
                tid: GA_TRACKING_ID,
                // Random Client Identifier. Ideally, this should be a UUID that
                // is associated with particular user, device, or browser instance.
                cid: crypto.randomBytes(16).toString("hex"),
                // Event hit type.
                t: 'event',
                // Event category.
                ec: category,
                // Event action.
                ea: action,
                // Event label.
                el: label,
                // Event value.
                ev: value,
                // Custom Dimension
                cd1: dimension,
                // Custom Metric
                cm1: metric
            },
        headers:
            {  'Cache-Control': 'no-cache' } };

    return rp(options);
}


router.route('/test')
    .get(function (req,res) {

        // Event value must be numeric.
        trackDimension('Feedback', 'Rating', 'Feedback for Movie', '3', 'Guardian\'s of the Galaxy', '1')
            .then(function (response) {
                console.log(response.body);
                res.status(200).send('Event tracked.').end();
            })
    });


app.use('/', router);


app.listen(process.env.PORT || 4000);

console.log('todo list RESTful API server started on: ' +'4000' );

