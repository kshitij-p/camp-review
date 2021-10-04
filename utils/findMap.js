const path = require('path');

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({path: path.join(__dirname, '../.env')});
}

const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');

const geoCodingClient = mbxClient({accessToken: process.env.MAPBOX_TOKEN});

const findMap = async function(location) {
    try {
        const searchMap = await geoCodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const coords = searchMap.body.features[0].geometry;
        return coords;
    } catch (e) {
        const coords = { type: 'Point', coordinates: [ 0, 0] };
        console.log(e);
        return coords;
    }
}

module.exports = findMap;