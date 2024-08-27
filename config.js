module.exports.port = 8000;
module.exports.secret_key = "MY_SECRET_KEY_HASH";
module.exports.secret_cookie = "COOKIE";
module.exports.url_database =
  process.env.URL_DATABASE || "mongodb://localhost:27017";
