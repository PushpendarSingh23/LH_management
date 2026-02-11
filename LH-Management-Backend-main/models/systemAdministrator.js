const mongoose = require('mongoose');

const systemAdministratorSchema = new mongoose.Schema({

    systemAdministratorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
});

const SystemAdministrator = mongoose.model('SystemAdministrator', systemAdministratorSchema);

module.exports = SystemAdministrator;