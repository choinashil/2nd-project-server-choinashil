const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { NotFoundError } = require('../../../lib/errors');

/*
  POST /api/auth/check
*/

exports.check = async (req, res, next) => {
  try {
    const { facebookId } = req.body;
    const user = await User.findOneByFacebookId(facebookId);

    if (user) {
      res.json({
        message: 'Existing user',
        userId: user._id
      });
    } else {
      res.json({
        message: 'No user Information',
        userId: null
      });
    }
  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
}


/*
  POST /api/auth/sign-up
*/

exports.signUp = async (req, res, next) => {
  try {
    const { facebookId, userName, photoUrl } = req.body;
    const secret = req.app.get('jwt-secret');

    const register = () => {
      const newUser = new User({
        facebookId,
        userName,
        nickName: userName,
        photoUrl,
        favorites: []
      });
      return newUser.save();
    };

    const getToken = userData => {
      const { _id, facebookId, userName } = userData;
      return new Promise((resolve, reject) => {
        jwt.sign(
          {
            _id,
            facebookId,
            userName
          },
          secret,
          {
            expiresIn: '7d',
            issuer: 'choinashil',
            subject: 'userInfo'
          }, (err, token) => {
            const result = { token, _id };
            err ? reject(err) : resolve(result);
          }
        );
      });
    };

    const respond = result => {
      const { token, _id } = result;
      res.json({
        message: 'logged in successfully',
        access_token: token,
        userId: _id
      });
    };

    const userData = await register();
    const result = await getToken(userData);
    respond(result);

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
};


/*
  POST /api/auth/login
*/

exports.login = async (req, res, next) => {
  try {
    const { facebookId, userName, userId } = req.body;
    const secret = req.app.get('jwt-secret');

    const getToken = () => {
      return new Promise((resolve, reject) => {
        jwt.sign(
          {
            _id: userId,
            facebookId,
            userName
          },
          secret,
          {
            expiresIn: '7d',
            issuer: 'choinashil',
            subject: 'userInfo'
          }, (err, token) => {
            const result = { token, userId };
            err ? reject(err) : resolve(result);
          }
        );
      });
    };

    const respond = result => {
      const { token, userId } = result;
      res.json({
        message: 'logged in successfully',
        access_token: token,
        userId
      });
    };

    const result = await getToken();
    respond(result);

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
};


/*
  GET /api/auth/verify
*/

exports.verify = async (req, res) => {
  const { _id, userName } = res.locals.userData;

  res.json({
    success: true,
    userId: _id,
    userName
  });
};
