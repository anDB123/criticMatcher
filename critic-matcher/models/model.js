const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    movieName: {
        required: true,
        type: String
    },
    score: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Data', dataSchema)