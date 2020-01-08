const express = require ('express');
const morgan = require ('morgan');
const exphbs = require ('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session= require('express-session');
const MysqlStore= require('express-mysql-session');
const passport =require('passport');

const {database}= require('./keys');
//Inicializaciones

const app = express();
require('./lib/passport');

//Settings --Se colocan las configuraciones que necesita el servidor
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, "views"));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares -- Funciones que se ejecutan cada vez que una aplicacion cliente envia peticion
app.use(session({
    secret: 'emamysqlnode',
    resave:false,
    saveUninitialized: false,
    store:new MysqlStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global Variables
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
        next();
});


//Routes -- Se definen las URLS del servidor
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));


//Public -- Todo el codigo que el servior puede acceder
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server
app.listen(app.get('port'),() =>{
    console.log('Servidor en puerto', app.get('port'));
});
