const mongoose = require('mongoose');

const review = {
    movieName: {
        required: true,
        type: String
    },
    score: {
        required: true,
        type: Number
    }
}

const UserReviews = new mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    reviews: {
        required: true,
        type: Array(review)
    }
});

module.exports = mongoose.model('UserReviews', UserReviews)