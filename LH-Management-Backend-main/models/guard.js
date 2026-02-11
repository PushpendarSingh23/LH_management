const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({

    guardId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
});

const Guard = mongoose.model('Guard', guardSchema);

module.exports = Guard;