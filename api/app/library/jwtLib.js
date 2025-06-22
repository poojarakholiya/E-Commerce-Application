const jwt = require('jsonwebtoken');

exports.jwtSign = async(obj,expiresIn) => {
    try {
      const jwtExpire = process.env.JWT_EXPIRE
      const jwtSecret = process.env.JWT_SECRET

      const options = {}

      if(!expiresIn || expiresIn !== false){
        options.expiresIn = jwtExpire
      }

      return jwt.sign(obj, jwtSecret, options);
    } catch (error) {
      throw error;
    }
};