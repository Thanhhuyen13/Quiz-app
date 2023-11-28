const attempt = require('./controller/attempt')

function router(app) {
    app.post("/attempts",attempt.createAttempt)
    app.post("/attempts/:id/submit",attempt.submit)

}

module.exports = router
