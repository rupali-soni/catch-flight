var path = require('path')
const md5 = require ('md5')
const dataSource1 = require( './providers/DataSource1' )
const dataSource2 = require( './providers/DataSource2' )
const logger    = require('../../utils/logger')

/**
 * Function to get flights data
 * @param req
 * @param res
 * @returns {Promise<Array|{}>}
 */
const getFlightData = async ( req, res ) => {
    //Get the data
    try {
        const [flightResults1, flightResults2] = await Promise.all([dataSource1.getFlightData, dataSource2.getFlightData])
        //Parse and keep unique records
        let flightCollections = getDistinctFlights([...flightResults1, ...flightResults2 ] )
        //get the required sorting done
        let sort = req.query.sort ? req.query.sort : ''
        flightCollections = getSortedFlights( flightCollections, sort )

        return flightCollections
    } catch (e) {
        logger.error( path.dirname(__filename) + 'Error while calling getFlightData ' + e.toString() );
       return [];
    }
}

/**
 *
 * @param flights
 * This function removes duplicate data
 */
const getDistinctFlights = ( flights = [] ) => {
    if( 0 === flights.length ) {
        return [];
    }
    let flightCollections = {};
    flights.forEach( ( flightObj ) => {
        let flightsUniqueId = '';
        flightObj.slices.forEach( ( slice ) => {
            slice.segments.forEach( ( valueObject, index ) => {
                flightsUniqueId += valueObject.number + '-' + valueObject.departure_date_time.utc + '-' + valueObject.arrival_date_time.utc
            })
        })
        flightObj.id = md5( flightsUniqueId )
    })
    return Array.from( new Map(flights.map(item => [item.id, item])).values() )
}

const getSortedFlights = ( flights = [], sortParameter = '' ) => {
    if( 0 === flights.length ) {
        return [];
    }
    let flightCollections;

    const collectDuration = (collectedDuration, newDuration) => collectedDuration + newDuration;
    switch ( sortParameter ) {
        case "price":
            flightCollections = flights.sort((a, b) => a.price < b.price ? -1 : 1)
            break;
        case "duration":
            flightCollections = flights.sort((a, b) => a.slices.map ( slice => slice.duration ).reduce(collectDuration) < b.slices.map ( slice => slice.duration ).reduce(collectDuration) ? -1 : 1)
            break;
        case "stops":
            flightCollections = flights.sort((a, b) => a.slices.length < b.slices.length ? -1 : 1)
            break;
        default:
            //Implement all the sorting: less stops, cheaper, takes shorter
            flightCollections = flights.sort((a, b) => {
                if(
                    ( a.slices.length < b.slices.length ) ||
                    ( a.price < b.price ) ||
                    ( a.slices.map ( slice => slice.duration ).reduce(collectDuration) < b.slices.map ( slice => slice.duration ).reduce(collectDuration) )
                ) {
                    return 1
                } else {
                    return -1
                }
            })
            break;
    }
    return flightCollections;
}


module.exports = {
    getFlightData,
    getDistinctFlights,
    getSortedFlights
}