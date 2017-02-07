var http = require('http');
var config = require('../config')

module.exports = function(app) {
  var PORT = 8082

  //Queries your shairport for metadata
  app.get('/shairport/metadata', function(req, res) {
    config.pis.forEach(function(pi) {
      if (pi.shairport) {
        http.get("http://" + pi.ip + ":" + PORT, function(response) {
          var body = "";
          response.on('data', function(chunk) {
            body += chunk;
          });
          response.on('end', function() {
            res.send(body);
          });
        })
        .on('error', function(err) {
          if (err.code == 'ECONNREFUSED' | err.code == 'EHOSTUNREACH') {
            res.send(err.code);
          } else throw err;
        });
      }
    })
  })

  /* TEST IF SHAIRPORT (HARDWARE) MODULE IS ACTUALLY SET UP */
  if (config.pis.length > 0) {
    var test = http.get('http://' + config.pis[0].ip + ":" + PORT)
    test.on("error", function(err) {
      if (err.code == 'ECONNREFUSED' | err.code == 'EHOSTUNREACH') {
        //console.log("Shairport is NOT running.");
      }
    })
    test.on("response", function(data) {
      console.log("Shairport IS running...");
    }) 
  }
}