var express = require('express');
var request = require('request');
var mongoose = require('mongoose');


var cookieParser = require('cookie-parser');
const session = require('express-session');
const { stringify } = require('querystring');

var app = express();

var prodottoSchema = mongoose.Schema({
    descrizione: String,
    prezzo: Number,
    quantita: Number,
    img: String
});

var Prodotto = mongoose.model("Products", prodottoSchema, "Products");

app.use(express.static(__dirname + '/public'));


app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
var server = "http://localhost:8080/api/login";

app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
    mongoose.connect('mongodb://localhost:27017/CorsoEF');
    Prodotto.find({}, (err, result) =>
    {
        res.render('home.ejs', {product: result});

    })
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});


app.post('/login', function(req, res) {
    var json = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(json);

    request.post(
        server,
        {
            json: json,
        },
        (error, response, body) => {
            if (error) {
            console.error(error)
            return
            }
            console.log(body.messaggio);
            if(body.messaggio=="OK")
            {
                req.session.login= json.username;
                console.log(req.session);
            }
                
            res.render('index.ejs', { risposta: body.messaggio });
        }
        );
});

app.get('/pagina', function(req, res) {
    console.log(req.session);
    if(!req.session.login) {
        res.redirect('/');
    } else {
        res.render('pagina.ejs');
    }
    
});


app.get('/product',function(req, res) {
    res.render('product.ejs');
});

app.get('/shop',function(req, res) {
    res.render('shop.ejs');
});



app.listen(8081);
console.log("Client Login lanciato con successo!");