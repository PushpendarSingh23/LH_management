const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({

    facultyMentorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
  clubName: {
    type: String,
    required: true
  }

});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;