var mongoose = require('mongoose');
var config = require('./config');

var restSchema = mongoose.Schema({
  name: String,
  description: String,
  img_url: String,
  location: Object,
  category: String,
  stampId: String,
  stampText: String,
  aveRating: Number,
  numberOfRates: Number
});

var POI = mongoose.model('POI', restSchema);

mongoose.connect(config.MONGODB_ATLAS_URI);

POI.collection.remove();