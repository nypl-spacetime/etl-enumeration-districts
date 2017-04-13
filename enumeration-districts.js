const fs = require('fs')
const path = require('path')
const H = require('highland')
const R = require('ramda')
const request = require('request')
const turf = {
  union: require('@turf/union')
}

// const topojson = require('topojson')
// const topojsonSimplify = require('topojson-simplify')
// const topojsonClient = require('topojson-client')
// const turf = {
//   midpoint: require('turf-midpoint'),
//   distance: require('turf-distance')
// }

const url = 'http://brick-by-brick.herokuapp.com/tasks/trace-maps/submissions/all.ndjson'
const filename = 'brick-by-brick-submissions.ndjson'
const year = 1900

// const UNITS = 'meters'
// const MAX_LINESTRING_DISTANCE = 10

// function geojsonPoint (coordinates) {
//   return {
//     type: 'Point',
//     coordinates
//   }
// }

// function geojsonPolygon (coordinates) {
//   return {
//     type: 'Polygon',
//     coordinates: [
//       coordinates
//     ]
//   }
// }

// function midpoint (a, b) {
//   return turf.midpoint(geojsonPoint(a), geojsonPoint(b)).geometry.coordinates
// }

// function addMidpoints(a, b) {
//   const distance = turf.distance(geojsonPoint(a), geojsonPoint(b), UNITS)
//   if (distance < MAX_LINESTRING_DISTANCE) {
//     return [a]
//   } else {
//     const m = midpoint(a, b)
//     return R.unnest([
//       addMidpoints(a, m),
//       addMidpoints(m, b)
//     ])
//   }
// }

// function splitLineStrings (coordinate, index, coordinates) {
//   if (index < coordinates.length - 1) {
//     return addMidpoints(coordinate, coordinates[index + 1])
//   } else {
//     return [coordinate]
//   }
// }

// function splitCoordinates (coordinates) {
//   return R.unnest(coordinates.map(splitLineStrings))
// }

// function splitFeatureCoordinates (feature) {
//   var coordinates = feature.geometry.coordinates[0]
//   return Object.assign(feature, {
//     geometry: geojsonPolygon(splitCoordinates(coordinates))
//   })
// }

function featuresFromGroup (obj) {
  return R.toPairs(obj)
    .map((pair) => ({
      number: pair[0],
      features: pair[1]
    }))
}

function union (features) {
  if (features.length > 1) {
    return turf.union.apply(this, features)
  } else {
    return features[0]
  }
}

function download (config, dirs, tools, callback) {
  request(url)
    .pipe(fs.createWriteStream(path.join(dirs.current, filename)))
    .on('finish', callback)
}

function transform (config, dirs, tools, callback) {
  H(fs.createReadStream(path.join(dirs.download, filename)))
    .split()
    .compact()
    .map(JSON.parse)
    .map((submission) => submission.data.geojson.features)
    .flatten()
    .compact()
    .filter((feature) => feature && feature.properties && feature.properties.fields.number)
    .group((feature) => feature.properties.fields.number)
    .map(featuresFromGroup)
    .flatten()
    .map((data) => ({
      type: 'object',
      obj: {
        id: `${year}.${data.number}`,
        type: 'st:EnumerationDistrict',
        name: data.number,
        validSince: year,
        validUntil: year,
        data: {
          number: data.number
        },
        geometry: union(data.features).geometry
      }
    }))
    .map(H.curry(tools.writer.writeObject))
    .nfcall([])
    .series()
    .stopOnError(callback)
    .done(callback)
}

// ==================================== API ====================================

module.exports.steps = [
  download,
  transform
]
