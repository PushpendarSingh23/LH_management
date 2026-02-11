const mongoose = require('mongoose');

const assistantRegistrarSchema = new mongoose.Schema({

  assistantRegistrarId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const AssistantRegistrar = mongoose.model('AssistantRegistrar', assistantRegistrarSchema);

module.exports = AssistantRegistrar;