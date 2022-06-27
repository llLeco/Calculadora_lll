require('dotenv').config();
const express = require('express');
const app = express();

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


const routes = require('./routes');
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'src' ,'views'));
app.set('view engine', 'ejs');

app.use(routes);

app.on('connected', () => {

  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });

});