'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');
let file = 'crime';
let data = fs.readFileSync('./data/' + file + '.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let columnHeader = _.first(data);
let columnData = _.rest(data);

var objects = _.map(columnData, function(dataRow) {
  return _.zipObject(columnHeader, dataRow);
});

function groupIncidentsByAttribute(incidents, attribute, optional_filter) {
  if (optional_filter) {
    incidents = _.filter(incidents, function(incident){
      return incident['OFFENSE_CATEGORY_ID'] !== optional_filter
    });
  }
  return _.chain(incidents)
          .filter(function(incident) { return incident[attribute]; })
          .groupBy(function(incident) { return incident[attribute]; })
          .map(function(value, key) { return [key, value.length]; })
          .sortBy(function(countByAddress) { return -countByAddress[1]; })
          .slice(0, 5)
          .value();
}


console.timeEnd('entire process');

console.log(groupIncidentsByAttribute(objects, 'NEIGHBORHOOD_ID', 'traffic-accident'));