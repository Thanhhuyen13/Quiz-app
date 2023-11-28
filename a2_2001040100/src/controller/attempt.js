const getRandomItemsFromArray = require('../utils/array')
const AttemptDB = require('../model/attempt')
const QuestionDB = require('../model/question')
class Attempt {
    async createAttempt(req, res) {
        try {
            const questionInDb = await QuestionDB.find({})
            const questions = getRandomItemsFromArray(questionInDb, 10)

            const attempt = new AttemptDB({
                completed: false,
                questions,
            })
            const result = await attempt.save()

            return res.status(201).json({
                _id: result._id,
                startedAt: result.createdAt,
                questions: result.questions.map(function (question) {
                    return {
                        _id: question._id,
                        text: question.text,
                        answers: question.answers,
                    }
                }),
                completed: result.completed
            })
        } catch (error) {
            res.status(400).send(error.message)

        }
    }

    async submit(req, res) {
        try {
            const idOfAttempt = req.params.id
            const userAnswers = req.body.userAnswers

            var attempt = await AttemptDB.findById(idOfAttempt)
            if (!attempt) {
                throw new Error('can not found attempt ' + idOfAttempt)
            }

            const correctAnswers = {

            }

            attempt.questions.map(function (question) {
                return correctAnswers[question._id.toString()] = question.correctAnswer
            })

            var score = 0

            for (const correctAnswer of Object.entries(correctAnswers))
                if(userAnswers[correctAnswer[0]] == correctAnswer[1]) {
                    score = score + 1
                }

            var scoreText = ''

            if(score < 5) {
                scoreText = 'Practice more to improve it :D'
            }
            if (5 <= score && score < 7) {
                scoreText = 'Good, keep up!'
            }
            if (7 <= score && score < 9) {
                scoreText = 'Well done!'
            }
            if (9 <= score && score == 10) {
                scoreText = 'Perfect!!'
            }

            if(attempt.completed === false) {
                attempt.scoreText = scoreText
                attempt.completed = true
                attempt.score = score
                attempt.userAnswers = userAnswers
            }
            
            await attempt.save()
            res.status(200).json({
                userAnswers: attempt.userAnswers,
                questions: attempt.questions,
                _id: attempt._id,
                startedAt: attempt.createdAt,
                correctAnswers,
                scoreText: attempt.scoreText,
                score: attempt.score,
                completed: attempt.completed,
            })

        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)

        }
    }
}

module.exports = new Attempt()