const express = require('express')
const flightRouter = require('./services/flight/FlightRoutes')

const app = express()

app.use(express.json())
app.use(flightRouter)

module.exports = app