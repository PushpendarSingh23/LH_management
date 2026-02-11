const mongoose = require('mongoose');

const gsecSchema = new mongoose.Schema({

  gsecId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  councilName: {
    type: String,
    required: true
  }
});

const Gsec = mongoose.model('Gsec', gsecSchema);

module.exports = Gsec;