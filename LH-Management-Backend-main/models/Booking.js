const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // gsecId: {
    //      type: mongoose.Schema.Types.ObjectId, 
    //      ref: 'User', 
    //      required: true 
    //     },
    ltNumber: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    startTime:{
        type: String,
        required: true,
    },
    endTime:{
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },

    clubName: {
        type: String,
        required: true,
    }, 
    bookedBy: {
        type: String,
        required: true
    },
    avSupport: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
    },
    pdf:{
        type:String,
    },
    facultyStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    systemAdministratorStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    assistantRegistrarStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    facultyMentorEmail: {
        type: String,
        required: true,
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;