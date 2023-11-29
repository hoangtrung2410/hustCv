const express = require('express')
const cors = require('cors')


const app = express()
//port
const PORT =8888
// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())



const recruitmentPostRouter = require('./src/routers/recruitmentPost.router.js')



app.use('/api/recruitmentPosts', recruitmentPostRouter)
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})