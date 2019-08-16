// Configure server and dependencies
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	request = require('request'),
	admin = require("firebase-admin");

// Configure Firebase connection
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// Start server
server.listen(process.env.PORT || 9090, function () {
	console.log('Listening on port ' + server.address().port);
});




// Configure printer status handling
var printerConfigs = [];
var printerStatuses = [];

let fleetDoc = db.collection('reference').doc('fleet');
let observer = fleetDoc.onSnapshot(docSnapshot => {
	console.log('Update detected in printer configs, adjusting...')
	if (docSnapshot.data() && docSnapshot.data().printers) {
		printerConfigs = docSnapshot.data().printers;
		printerStatuses = [];
	}
}, err => {
	console.log('Error in retrieving printer setup from Firebase:', error);
});



// API
app.get('getConfigs', function(req, res, next) {
	resp.send(printerStatuses);
});

// Invalid URL
app.use(function (req, res, next) {
	res.status(404);

	res.send({
		error: 'Invalid request URL'
	});

	return;
});