const fs = require('fs')
const path = require('path')
const H = require('highland')
const R = require('ramda')
const request = require('request')
const turf = {
  union: require('@turf/union')
}

const url = 'http://brick-by-brick.herokuapp.com/tasks/trace-maps/submissions/all.ndjson'
const filename = 'brick-by-brick-submissions.ndjson'
const year = 1900

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
    // TODO: log if submissions without data or geojson are encountered!
    .filter((submission) => submission && submission.data && submission.data.geojson)
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
