const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    name: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

