const Course = require('../../../models/Course');
const { NotFoundError } = require('../../../lib/errors');

/*
  GET /api/courses
*/

exports.searchCourses = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.query;
    let results;

    if (distance === 'short') {
      results = await Course.find({ distance: { $lt: 5 }, coordinates: { $elemMatch: { $geoWithin: { $center: [[lng, lat], 0.01] }}}});

    } else if (distance === 'mid') {
      results = await Course.find({ distance: { $gte: 5, $lt: 10 }, coordinates: { $elemMatch: { $geoWithin: { $center: [[lng, lat], 0.01] }}}});

    } else if (distance === 'long') {
      results = await Course.find({ distance: { $gte: 10 }, coordinates: { $elemMatch: { $geoWithin: { $center: [[lng, lat], 0.01] }}}});

    } else {
      results = await Course.find({ coordinates: { $elemMatch: { $geoWithin: { $center: [[lng, lat], 0.01] }}}});
    }

    res.json({ results });

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
};


/*
  GET /api/courses/:course_id/details
*/

exports.details = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const courseInfo = await Course.findById(course_id).exec();

    res.json({ courseInfo });

  } catch(err) {
    const { name, message } = err;
    next(new NotFoundError(name, message));
  }
};
