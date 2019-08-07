class FlightDataProviderInterface {
    constructor() {
        if(!this.getFlightData) {
            throw new Error("There should be an implementation of getFlightData function");
        }
    }
}
module.exports = FlightDataProviderInterface