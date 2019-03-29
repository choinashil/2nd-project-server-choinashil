const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema ({
  by: {type: String, required: true},
  userName: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  distance: {type: Number, required: true},
  coordinates: {type: Array, required: true},
  locker: {type: String},
  restroom: {type: String},
  gourmet: {type: String},
  createdAt: {type: String, required: true},
  likeIds: {type: Array, required: true}
});

module.exports = mongoose.model('Course', CourseSchema);
