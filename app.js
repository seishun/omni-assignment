var app = require('express')();
var bodyParser = require('body-parser');
var pg = require('pg');

var pool = new pg.Pool();

app.use(bodyParser.json());

app.get('/config/:client/:version', function(req, res, next) {
  var etag = /^(?:W\/)?"(\d+)"/.exec(req.get('If-None-Match'));
  var offset = etag ? +etag[1] : 0;
  
  pool.query('SELECT ID, key, value FROM configs WHERE ID > $1 AND client = $2 AND version = $3', [
    offset,
    req.params.client,
    req.params.version
  ], function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }
    
    var fields = {};
    result.rows.forEach(function(row) {
      fields[row.key] = row.value;
    });
    
    if (Object.keys(fields).length > 0) {
      var lastETag = result.rows.pop().id;
      res.set('ETag', 'w/"' + lastETag + '"');
      res.json(fields);
    } else {
      res.status(304).end();
    }
  });
});

app.post('/config', function(req, res, next) {
  pool.query('INSERT INTO configs (client, version, key, value) values ($1, $2, $3, $4)', [
    req.body.client,
    req.body.version,
    req.body.key,
    req.body.value
  ], function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }
    res.status(201).end();
  });
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});