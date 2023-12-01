const express = require('express')
const cors = require('cors')

const app = express()
//port
const PORT =8989
// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


const recruitmentPostRouter = require('./src/routers/recruitmentPostRouter.js')
const businessRouter = require('./src/routers/businessRouter.js')

app.use('/api/recruitmentPosts', recruitmentPostRouter)
app.use('/api/business', businessRouter)
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
