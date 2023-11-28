const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./router')
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))
async function connectToDatabase() {
    try{
        await mongoose.connect('mongodb://localhost:27017', {
            dbName: 'wpr-quiz'
            
        })
    } catch(error) {
        console.log(error)
    }
}
connectToDatabase()
router(app)
app.listen(3000, function(){
})
