/*THE SHAIRPORT SERVER RUNS ON PORT 8081*/

var express = require('express');
function Shairport() {
	this.artist = "none";
	this.title = "nothing";
	this.album = "nada";
}
Shairport.prototype.getData = function(callback) {
	var fs = require('fs')
	fs.readFile("/tmp/metadata.txt", function(err, dataBuffer) {
		var data =  dataBuffer.toString('ascii');
		//Metadata
		data = data.substring(data.lastIndexOf('Album Name'));
		data = data.substring(data.indexOf('"')+1);
		this.album = data.substring(0, data.indexOf('"'));
		data = data.substring(data.indexOf('Artist'));
		data = data.substring(data.indexOf('"')+1)
		this.artist = data.substring(0, data.indexOf('"'));
		data = data.substring(data.indexOf('Title: "'));
		data = data.substring(data.indexOf('"') + 1);
		this.title = data.substring(0, data.indexOf('"'));
		callback();
	})
}
var shairport = new Shairport();
var app = express();

app.get('/metadata', function(req, res) {
	shairport.getData(function() {
		res.send({
			title: this.title,
			artist: this.artist,
			album: this.album
		})
	})
})
app.listen(8081, '0.0.0.0');