/// <reference types="jest" />
// 🐨 you'll need the test server
// 💰 the way that our tests are set up, you'll find this in `src/test/server/test-server.js`
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import {server, rest} from 'test/server'
// 🐨 grab the client
import {client} from '../api-client'

jest.mock('react-query') // turns all functions exposed in the module into jest functions
jest.mock('auth-provider')

const apiUrl = process.env.REACT_APP_API_URL
const authUrl = process.env.REACT_APP_AUTH_URL

// 🐨 flesh these out:

// test.todo('calls fetch at the endpoint with the arguments for GET requests')
test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}

  // setting up a new server handler and prepending it to the list of handlers in test-server.js
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )
  const result = await client(endpoint)
  expect(result).toEqual(mockResult)
})
// 🐨 add a server handler to handle a test request you'll be making
// 💰 because this is the first one, I'll give you the code for how to do that.
// const endpoint = 'test-endpoint'
// const mockResult = {mockValue: 'VALUE'}
// server.use(
//   rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
//     return res(ctx.json(mockResult))
//   }),
// )
//
// 🐨 call the client (don't forget that it's asynchronous)
// 🐨 assert that the resolved value from the client call is correct

// test.todo('adds auth token when a token is provided')
// 🐨 create a fake token (it can be set to any string you want)
// 🐨 create a "request" variable with let
// 🐨 create a server handler to handle a test request you'll be making
// 🐨 inside the server handler, assign "request" to "req" so we can use that
//     to assert things later.
//     💰 so, something like...
//       async (req, res, ctx) => {
//         request = req
//         ... etc...
//
// 🐨 call the client with the token (note that it's async)
// 🐨 verify that `request.headers.get('Authorization')` is correct (it should include the token)
test('adds auth token when a token is provided', async () => {
  const endpoint = 'test-endpoint'
  const token = 'auth_token'
  const mockResult = {mockValue: 'VALUE'}
  let request

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      // console.log('req1', req)
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  await client(endpoint, {token})
  expect(request.headers.get('authorization')).toBe(`Bearer ${token}`)
})

// test.todo('allows for config overrides')
// 🐨 do a very similar setup to the previous test
// 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
// 🐨 call the client with the endpoint and the custom config
// 🐨 verify the request had the correct properties
test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'Value'}
  // const headers = {
  //   'Content-Type': 'image/jpeg'
  // }

  let request
  server.use(
    rest.put(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req

      return res(ctx.json(mockResult))
    }),
  )

  const customConfig = {
    method: 'PUT',
    headers: {'Content-Type': 'image/jpeg'},
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
  }

  await client(endpoint, customConfig)
  expect(request.headers.get('content-type')).toBe(
    customConfig.headers['Content-Type'],
  )
  expect(request.method).toBe(customConfig.method)
  // ! For some reason other customconfig doesn't seem to be overridden
})

// test.todo(
//   'when data is provided, it is stringified and the method defaults to POST',
// )
// 🐨 create a mock data object
// 🐨 create a server handler very similar to the previous ones to handle the post request
//    💰 Use rest.post instead of rest.get like we've been doing so far
// 🐨 call client with an endpoint and an object with the data
//    💰 client(endpoint, {data})
// 🐨 verify the request.body is equal to the mock data object you passed
test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  const data = {
    fruit: 'apple',
  }

  server.use(
    rest.post(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.json(req))
    }),
  )

  const result = await client(endpoint, {data})
  expect(result.method).toBe('POST')
  expect(result.body).toEqual(data)
})

// Extra credit 1
test('Automatically logs the user out if the request status returns a 401', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {message: 'page not found'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(401))
    }),
  )

  const result = await client(endpoint).catch(err => err) // catching error and converting rejected to resolved
  expect(result.message).toMatchInlineSnapshot(`"Please re-authenticate."`)

  // test queryCache.clear and auth.logout are called
  expect(queryCache.clear).toHaveBeenCalledTimes(1) // no arguments passed otherwise we can make another assertion and check toHaveBeenCalledWith
  expect(auth.logout).toHaveBeenCalledTimes(1)
})

test('Correctly rejects the promise if there is an error', async () => {
  const endpoint = 'test-endpoint'
  const errorMessage = {message: 'page not found'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(errorMessage))
    }),
  )

  // const error = await client(endpoint).catch(err => err) // proimise does not reject in this case, we want to test that a promise rejection has happened when error status occurs instead of being resolved
  //Remember, you must include the await here, or you return the promise that comes back from expect when you use rejects or resolves because this assertion doesn't run until this promise rejects or resolves.
  await expect(client(endpoint)).rejects.toEqual(errorMessage)
  // or
  return expect(client(endpoint)).rejects.toEqual(errorMessage)
})
