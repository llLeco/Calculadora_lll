// dotenv
require('dotenv').config(); 

// express
const express = require('express'); 
const app = express();

// mongoose
const mongoose = require('mongoose'); 
mongoose.connect(process.env.CONNECTIOSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
  app.emit('connected');
})
.catch(err => {
  console.log('Error connecting to MongoDB: ', err.message);
  app.emit('error', err);
});


const session = require('express-session'); //  identifica uma session do usuario
const MongoStore = require('connect-mongo'); //  armazena a session no mongodb
const flash = require('connect-flash'); //  mostra mensagens de erro
const routes = require('./routes'); //  importa o arquivo routes.js que contem as rotas da aplicacao 
const path = require('path'); //  importa o arquivo path.js que contem as funcoes de manipulacao de caminhos
const helmet = require('helmet'); //  importa o arquivo helmet.js que contem as funcoes de seguranca
const csrf = require('csurf'); //  importa o arquivo csurf.js que contem as funcoes de seguranca

const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware'); //importa o arquivo middleware.js

app.use(helmet()); // usa o arquivo helmet.js para configurar as funcoes de seguranca
app.use(express.urlencoded({ extended: true })); //  configura o express para receber dados do formulario
app.use(express.json()); //  configura o express para receber dados do formulario
app.use(express.static(path.resolve(__dirname, 'public'))); //  configura o express para usar o diretorio public

//  configura as opcoes da session
const sessionOptions = session({  
  secret: 'Frase secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIOSTRING})
});

app.use(sessionOptions); //  usa o arquivo sessionOptions.js para configurar as opcoes da session
app.use(flash()); //  usa o arquivo flash.js para configurar as funcoes de mensagens de erro

app.set('views', path.resolve(__dirname, 'src' ,'views')); //  configura o express para usar o diretorio views
app.set('view engine', 'ejs'); //  configura o express para usar o motor de views ejs
 
app.use(csrf());
app.use(middlewareGlobal); 
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('connected', () => {
  
//  configura o express para ouvir a porta 3000
  app.listen(3000, () => { 
    console.log('App listening on port 3000!');
  });

});