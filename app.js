var app = require('express')();
var bodyParser = require('body-parser');

// TODO use db
var configs = [];

app.use(bodyParser.json());

app.get('/config/:client/:version', function(req, res, next) {
  var etag = /^(?:W\/)?"(\d+)"/.exec(req.get('If-None-Match'));
  var offset = etag ? +etag[1] : 0;
  
  var fields = {};
  configs.slice(offset).filter((c) => c.client == req.params.client && c.version == req.params.version).forEach((c) => {
    fields[c.key] = c.value;
  });
  
  if (Object.keys(fields).length != 0) {
    res.set('ETag', 'w/"' + configs.length + '"');
    res.json(fields);
  } else {
    res.status(304).end();
  }
});

app.post('/config', function(req, res, next) {
  configs.push(req.body);
  res.status(201).end();
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});
