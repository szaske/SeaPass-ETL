var axios = require("axios");
var flatten = require("lodash.flatten");
var mongoose = require("mongoose");
var config = require("./config");

axios.defaults.headers.common["Authorization"] = config.YELP_AUTH_TOKEN;

// category assigned one after the other
const assignedCategory = [
  "History",
  "Art",
  "Film",
  "Wacky"
];

function createPOI(data, i) {
  return {
    name: data.name,
    description: data.location.display_address,
    img_url: data.image_url,
    category: assignedCategory[i % 4],
    location: {
      type: "Point",
      coordinates: [data.coordinates.longitude, data.coordinates.latitude]
    },
    stampId: i,
    stampText: data.id,
    averating: data.rating,
    numberOfRates: data.review_count
  };
}

function getData(offset) {
  return axios.get(`${config.YELP_RESTAURANTS_REQ}&offset=${offset}`);
}

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

restSchema.index({ location: '2dsphere' });

var offset = 0;
var promises = [];

while (offset < 500) {
  promises.push(getData(offset));
  offset += 50;
}

Promise.all(promises)
  .then(response => {
    const pois =
      flatten(response.map(item => item.data.businesses))
      .map(createPOI)
      .filter(item => Array.isArray(item.location.coordinates) &&
        item.location.coordinates.length === 2 &&
        !!item.location.coordinates[0] && !!item.location.coordinates[1]);

    mongoose.connect(config.MONGODB_ATLAS_URI);
    var db = mongoose.connection;
    db.once("open", () => {
      var Poi = mongoose.model("Poi", restSchema);
      Poi.insertMany(pois.map(r => new Poi(r)))
        .then(() => db.close())
        .catch(err => console.error(err));
    });
  })
  .catch(err => console.error(err));