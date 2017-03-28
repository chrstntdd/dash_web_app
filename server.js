var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expValidator = require('express-validator');
var flash = require('connect-flash');
var messages = require('express-messages');
var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/pogo');
//Define Models
Sites = require('./models/site');
User = require('./models/user');
//Define Routes
var index = require('./routes/index');
var sites = require('./routes/site');


var app = express();
    app.set('port', (process.env.PORT || 5000));
    app.set('views',path.join(__dirname,'views/layouts'));
    app.engine('handlebars',handlebars({defaultLayout:'layout'}));
    app.set('view engine','handlebars');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(cookieParser());
    // app.use('/images',express.static(path.join(__dirname,'/public/images')));
    // app.use('/models',express.static(path.join(__dirname,'/models')));
    // app.use('/styles',express.static(path.join(__dirname,'/public/styles')));


app.use(expValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// app.use(flash());

// app.use(function(req,res,next){
//     res.locals.success_msg = flash.success_msg;
//     res.locals.error_msg = flash.error_msg;
//     res.locals.error = flash.error;
//     res.locals.user = req.user || null;
//     next();
// });



app.use('/',index);
app.use('/site',sites);



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});