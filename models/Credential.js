const { Schema } = require('mongoose');

const credentialSchema = new Schema({
    phoneNumber: {
        type: Number,
        match: /\d{3}-\d{3,4}-\d{4}/
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        required: true,
    }
},{
    timestamps: true,
});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = { Credential };