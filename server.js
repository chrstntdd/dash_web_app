var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expValidator = require('express-validator');
var flash = require('connect-flash');
var messages = require('express-messages');
var mongoose = require('mongoose');
process.env.NODE_ENV = 'production'
if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_d41xhhbh:8noui905v24of65nfletr5eu5s@ds129469.mlab.com:29469/heroku_d41xhhbh',function(error){
  if (error){
    console.log('error attempting remote connection')
    console.log('connecting to local server')
    mongoose.connect('mongodb://localhost/pogo');
  }

});
}else{
      console.log('env is '+ process.env.NODE_ENV + ' connecting locally')
     mongoose.connect('mongodb://localhost/pogo');
}




//Define Routes
var index = require('./routes/index');
var sites = require('./routes/sites');
var users = require('./routes/users');
var admin = require('./routes/admin');
var site_rates = require('./routes/site_rates');
var app = express();
    app.set('port', (process.env.PORT || 5000));
    console.log(process.env.NODE_ENV);
    app.set('views',path.join(__dirname,'views/layouts'));
    app.engine('handlebars',handlebars({
      defaultLayout:'layout'
    }));
    app.set('view engine','handlebars');
    app.use('/images',express.static(path.join(__dirname,'/public/images')));
    app.use('/styles',express.static(path.join(__dirname,'/public/styles')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(cookieParser('Secret'));
    //app.use(methodOverride('_method'));
    app.use(session({
        secret: 'Secret',
        resave: 'false',
        saveUninitialized: 'false'
    }));


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
    }
  }
}));

app.use('/',index);
app.use('/admin',admin);
app.use('/api/sites',sites);
app.use('/api/users',users);
app.use('/api/rates',site_rates);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});