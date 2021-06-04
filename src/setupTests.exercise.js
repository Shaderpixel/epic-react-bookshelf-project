// the following code is moved out of the api-client.js test since all tests are likely going to benefit from the availability of the network calls.
// jest configured to automatically require the file src/setupTests.js. (Check the jest.config.js file and look at the setupFilesAfterEnv config). So all we need to do now is move that setup from the src/utils/__tests__/api-client.js to the src/setupTests.js file and then all of our tests will benefit from the same setup automatically.
import {server} from 'test/server'


// 🐨 add a beforeAll to start the server with `server.listen()`
beforeAll(() => {
  server.listen()
})
// 🐨 add an afterAll to stop the server when `server.close()`
afterAll(() => {
  server.close()
})
// 🐨 afterEach test, reset the server handlers to their original handlers
beforeEach(() => {
  server.resetHandlers()
})