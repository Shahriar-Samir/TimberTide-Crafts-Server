const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 5000
const app = express()

// middlewares 
app.use(app.json())
app.use(cors())


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})