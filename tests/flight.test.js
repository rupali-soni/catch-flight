const request = require('supertest')
const app = require('../src/app')
const flightController = require('../src/services/flight/FlightController')
const {flightsMock, flightsPriceSortMock, flightsStopsSortMock, flightsDurationSortMock } = require('./fixtures/data')

test('Get flight data', async () => {
    const response = await request(app).get('/flights').expect([])
})

test('Test distint flight data', async () => {
    const flights = flightController.getDistinctFlights(flightsMock)
    expect(flights.length).toBe(3)
})

test('Get flight data sorted by price', async () => {
    const flights = flightController.getDistinctFlights(flightsMock)
    const Sortedflights = flightController.getSortedFlights( flights, 'price')
    expect(Sortedflights).toEqual(flightsPriceSortMock)
    expect(Sortedflights.length).toBe(3)
})

test('Get flight data sorted by duration', async () => {
    const flights = flightController.getDistinctFlights(flightsMock)
    const Sortedflights = flightController.getSortedFlights( flights, 'duration')
    expect(Sortedflights).toEqual(flightsDurationSortMock)
    expect(Sortedflights.length).toBe(3)
})

test('Get flight data sorted by stops', async () => {
    const flights = flightController.getDistinctFlights(flightsMock)
    const Sortedflights = flightController.getSortedFlights( flights, 'stops')
    expect(Sortedflights).toEqual(flightsStopsSortMock)
    expect(Sortedflights.length).toBe(3)
})

test('Get flight data sorted by stops, price and duration', async () => {
    const flights = flightController.getDistinctFlights(flightsMock)
    const Sortedflights = flightController.getSortedFlights( flights, '')
    expect(Sortedflights).toEqual(flightsStopsSortMock)
    expect(Sortedflights.length).toBe(3)
})
