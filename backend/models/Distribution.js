const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    leads: [{
        firstName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            default: ''
        }
    }],
    distributionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Distribution', distributionSchema);
