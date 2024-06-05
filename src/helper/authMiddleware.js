const JWT = require("jsonwebtoken");

const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = { generateToken };
