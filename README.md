# Yelp Import Tool

The purpose of this script is to load Fake POI data into a MongoDB Atlas database using the Yelp Fusion API.  This code requires NODE to be installed.

Getting Started:

  1. Clone/download repository.
  2. Run "NPM Install" at the command prompt.
  3. Copy the config.js file (that can be gotten from github@zaske.com) into the root directory (where package.json is located)
  4. Run command `node index.js`

The script adds POIs to the POIS collection in the SeaPass database using the Yelp Fusion API.

In order to delete the collection, please run the following command:

`node clearRestCollection.js`