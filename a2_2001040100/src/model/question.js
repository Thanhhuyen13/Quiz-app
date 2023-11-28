const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    answers:[String],
    text : String,
    correctAnswer: Number
})
module.exports = mongoose.model('questions', schema)