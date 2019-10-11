const express= require('express')
const bodyParser= require('body-parser')
const searchRoute= require('./routes/search')

const app= express()

app.use(bodyParser.json())

app.use(searchRoute)






app.listen(3000,()=>{
    console.log("running at 3000")
})

