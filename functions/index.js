const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const cors = require("cors")({
  origin: [
    "https://buy-it-shop.netlify.app",
  ],
});

setGlobalOptions({maxInstances: 10});

exports.health = onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).json({ok: true});
  });
});
