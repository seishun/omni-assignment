var express = require('express');
var router = express.Router();

var knex = require('../db/knex');

/* GET changed configs */
router.get('/config/:client/:version', function(req, res, next) {
  var etag = /^(?:W\/)?"(\d+)"/.exec(req.get('If-None-Match'));
  var offset = etag ? +etag[1] : 0;
  
  knex('configs')
  .where('id', '>', offset)
  .andWhere({
    client: req.params.client,
    version: req.params.version
  })
  .select('id', 'key', 'value')
  .then(function(configs) {
    var fields = {};
    configs.forEach(function(row) {
      fields[row.key] = row.value;
    });
    
    if (Object.keys(fields).length > 0) {
      var lastETag = configs.pop().id;
      res.set('ETag', 'w/"' + lastETag + '"');
      res.json(fields);
    } else {
      res.status(304).end();
    }
  })
  .catch(function(error) {
    next(error);
  });
});

/* add config */
router.post('/config', function(req, res, next) {
  if (!['client', 'version', 'key', 'value'].every(function(key) {
    return key in req.body;
  })) {
    return res.status(400).end();
  }
  
  knex('configs')
  .insert({
    client: req.body.client,
    version: req.body.version,
    key: req.body.key,
    value: req.body.value
  })
  .then(function() {
    res.status(201).end();
  })
  .catch(function(error) {
    next(error);
  });
});

module.exports = router;
