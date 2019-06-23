const mongoose = require('mongoose');

const notifictionSchema = mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

notifictionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.deleted;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Notification', notifictionSchema);