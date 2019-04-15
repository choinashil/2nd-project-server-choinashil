const Course = require('../../../models/Course');
const User = require('../../../models/User');
const { NotFoundError } = require('../../../lib/errors');

/*
  GET /api/users/:user-id/profile
*/

exports.profile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { _id } = res.locals.userData;

    if (user_id === _id.toString()) {
      const user = await User.findById(user_id).exec();
      const { nickName, photoUrl } = user;
      const userInfo = { nickName, photoUrl } ;
      res.json({ userInfo });
    } else {
      throw err('Invalid user');
    }

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
}


/*
  GET /api/users/:user-id/favorites
*/

exports.favorites = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { _id, favorites } = res.locals.userData;

    if (user_id === _id.toString()) {
      const favoriteCourses = await Course.find({ _id: { $in: favorites}});
      res.json({ favorites: favoriteCourses });
    } else {
      throw err('Invalid user');
    }

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
}


/*
  GET /api/users/:user_id/course/:course_id/favorites
*/

exports.like = async (req, res, next) => {
  try {
    const { user_id, course_id } = req.params;
    const { _id, favorites } = res.locals.userData;

    if (user_id === _id.toString()) {
      const addFavorites = async () => {
        const newUser = await User.findByIdAndUpdate(user_id, {$push: {favorites: course_id}}, {new: true});
        const newCourse = await Course.findByIdAndUpdate(course_id, {$push: {likeIds: user_id}}, {new: true});
        return [newUser, newCourse];
      };

      const removeFavorites = async () => {
        const newUser = await User.findByIdAndUpdate(user_id, {$pull: {favorites: course_id}}, {new: true});
        const newCourse = await Course.findByIdAndUpdate(course_id, {$pull: {likeIds: user_id}}, {new: true});
        return [newUser, newCourse];
      };

      let changedData;

      if (favorites.includes(course_id)) {
        changedData = await removeFavorites();
      } else {
        changedData = await addFavorites();
      }

      const changedUserFavorites = changedData[0].favorites;
      const changedCourseInfo = changedData[1];

      res.json({
        message: 'Success',
        changedUserFavorites,
        changedCourseInfo
      });

    } else {
      throw err('Invalid user');
    }

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
}


/*
  POST /api/users/:user-id/new-course
*/

exports.newCourse = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { userName, title, description, distance, coordinates, locker, restroom, gourmet, createdAt } = req.body;
    const { _id } = res.locals.userData;

    const saveNewCourse = () => {
      const newCourse = new Course({
        by: user_id,
        userName,
        title,
        description,
        distance,
        coordinates,
        locker,
        restroom,
        gourmet,
        createdAt,
        likeIds: []
      });

      return newCourse.save();
    }

    if (user_id === _id.toString()) {
      const courseInfo = await saveNewCourse();
      if (courseInfo) {
        res.json({ 
          courseId: courseInfo._id,
          message: 'Saved successfully'
        });
      }

    } else {
      throw err('Invalid user');
    }

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
}
