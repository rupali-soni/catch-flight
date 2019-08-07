var path = require('path')
const request = require('requestretry')
const FlightDataProviderInterface = require( './FlightDataProviderInterface')
const logger    = require('../../../utils/logger')

class DataSource1 extends FlightDataProviderInterface {

    constructor() {
        super();
    }

    get getFlightData() {
        return new Promise( ( resolve, reject ) => {
            const url = process.env.DISCOVERY_STUB_URL + '/source1'
            const username = process.env.DISCOVERY_STUB_USERNAME
            const password = process.env.DISCOVERY_STUB_PASSWORD
            request({
                url,
                json:true,
                auth: {
                    username, password
                },
                maxAttempts: 5,   // try 5 times
                retryDelay: 2000,  // wait for 2s before trying again
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError
            }, ( error, res, body ) => {
                if(error) {
                    reject( [] )
                } else {
                    ( res.statusCode === 200 ) ? resolve( body.flights ) : resolve( [] )
                }
            })
        }).catch( ( error )=> {
            //log error
            logger.error( path.dirname(__filename) + ' Error while calling API end point '  + error.toString() );
        });

    }
}

module.exports = new DataSource1()