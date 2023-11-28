const introduction = document.querySelector('#introduction')
const attemptQuiz = document.querySelector('#attempt-quiz')
const reviewQuiz = document.querySelector('#review-quiz')
const btnStart = document.querySelector('#btn-start')
const btnSubmit = document.querySelector('#btn-submit')
const btnTryAgain = document.querySelector('#btn-try-again')
const attempt = document.querySelector('#attempt')
const review = document.querySelector('#review')
const score = document.querySelector('#box-result h3')
const percentage = document.querySelector('.percentage')
const comment = document.querySelector('.comment')
const escapeHtml = (string) => {
    return string.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

let id = ''
let answers = {}

btnStart.addEventListener('click', function () {
    introduction.classList.add('hide')
    attemptQuiz.classList.remove('hide')
    scroll(0, 0)
    attempt.innerHTML = ''
    fetch('http://localhost:3000/attempts', {
        method: 'POST'
    }).then(function (respone) {
        return respone.json()
    }).then(function (data) {
        id = data._id
        answers = {}
        for (let i in data.questions) {
            attempt.innerHTML += `
            <div class="attempt-quiz-question">
                <h2 class="question-index">Question ${parseInt(i) + 1} of 10</h2>
                <p class="question-text">${escapeHtml(data.questions[i].text)}</p>
                <form>
                    ${data.questions[i].answers.map(function (answer) {
                return `
                        <label class="option">
                            <input type="radio" name="${data.questions[i]._id}">
                            <span>${escapeHtml(answer)}</span>
                        </label>
                    `
            }).join('')}
                </form>
            </div>
            `
        }
        clearDataAndListenClick()
    })
})

// btnStart.dispatchEvent(new Event('click'))

btnSubmit.addEventListener('click', function () {
    if (confirm('Do you want to submit?') === false)
        return
    attemptQuiz.classList.add('hide')
    reviewQuiz.classList.remove('hide')
    scroll(0, 0)
    review.innerHTML = ''
    fetch(`http://localhost:3000/attempts/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
            userAnswers: answers
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (respone) {
        return respone.json()
    }).then(function (data) {
        console.log(data);
        function setClass(id, correctAnswer, currentOption) {
            if (answers[id] === correctAnswer && correctAnswer === currentOption)
                return 'correct-answer'
            if (answers[id] !== correctAnswer && currentOption === answers[id])
                return 'wrong-answer'
            if (answers[id] !== correctAnswer && currentOption === correctAnswer)
                return 'option-correct'
            return ''
        }
        for (let i in data.questions) {
            review.innerHTML += `
            <div class="attempt-quiz-question">
                <h2 class="question-index">Question ${parseInt(i) + 1} of 10</h2>
                <p class="question-text"> ${escapeHtml(data.questions[i].text)}</p>
                <form>
                    ${data.questions[i].answers.map(function (answer, index) {
                return `
                        <label class="option ${setClass(data.questions[i]._id, data.correctAnswers[data.questions[i]._id], index)}">
							<input type="radio" name="${data.questions[i]._id}" disabled ${setClass(data.questions[i]._id, data.correctAnswers[data.questions[i]._id], index) === 'correct-answer' ||
                        setClass(data.questions[i]._id, data.correctAnswers[data.questions[i]._id], index) === 'wrong-answer'
                        ? 'checked' : ''}>
							<span>${escapeHtml(answer)}</span>
						</label>
                        `
            }).join('')}
                </form>

            </div>
            `
        }

        score.innerHTML = `${data.score}/10`
        percentage.innerHTML = `${data.score * 10}%`
        comment.innerHTML = data.scoreText

    })
})
btnTryAgain.addEventListener('click', function () {
    reviewQuiz.classList.add('hide')
    introduction.classList.remove('hide')
    scroll(0, 0)
})



function clearDataAndListenClick() {
    for (let question of attempt.children) {
        const options = question.querySelectorAll('.option')
        for (let index = 0; index < options.length; index++) {
            options[parseInt(index)].classList.remove('option-selected')
            options[parseInt(index)].querySelector('input').checked = false
            options[parseInt(index)].addEventListener('click', function (e) {
                for (let optionClick of options) {
                    optionClick.classList.remove('option-selected')
                }
                options[parseInt(index)].classList.add('option-selected')
                options[parseInt(index)].querySelector('input').checked = true
                answers[options[parseInt(index)].children[0].name] = index

            })
        }
    }
}