const express = require('express')
const router = new express.Router('./services/flight/flightRoutes')
const flightController = require( './FlightController')


router.get('/flights', async (req, res) => {
    const results = await flightController.getFlightData( req, res );
    if ( results === [] ) {
        res.status( 500 ).send( results )
    } else {
        res.status( 200 ).send( results )
    }

})

module.exports = router