const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    answers:[String],
    text : String,
    correctAnswer: Number
})

const schema = new mongoose.Schema({
    questions : [questionSchema],
    completed : Boolean,
    score : Number,
    userAnswers: Object,
    scoreText: String,

}, {
    timestamps: true
})

module.exports = mongoose.model('attempts', schema)