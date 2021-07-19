// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {renderHook, act} from '@testing-library/react-hooks'
// 🐨 Here's the thing you'll be testing:
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error') // ensures that console error is mocked for every test
})

afterEach(() => {
  console.error.mockRestore() // ensures original value is restored after every test.
})

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

const defaultState = {
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    setData: expect.any(Function), // we don't care what it is as long it a Function (referring to the Function constructor)
    setError: expect.any(Function),
    error: null,
    status: 'idle',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  }

const pendingState = {
  ...defaultState,
  isIdle: false,
  isLoading: true,
  status: 'pending'
}

const resolvedState = {
  ...defaultState,
  isIdle: false,
  isSuccess: true,
  status: 'resolved'
}

const rejectedState = {
  ...defaultState,
  isIdle: false,
  isError: true,
  status: 'rejected'
}

test('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  // 🐨 use renderHook with useAsync to get the result
  // 🐨 assert the result.current is the correct default state
  const {promise, resolve} = deferred()
  const {result} = renderHook(useAsync)

  expect(result.current).toEqual(defaultState)

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  // 🐨 assert that result.current is the correct pending state
  let p
  act(() => {
    // store promise from run so that it can be awaited later
    p = result.current.run(promise)
  })

  // when running the promise, the object from useAsync should change
  expect(result.current).toEqual(pendingState)

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  // 🐨 assert the resolved state
  // when we resolve the promise, we need to wait for the async promiseSuccess.then() to finish setting data inside of useAsync and then return a new object otherwise we will get the error that act is needed eventhough we ARE using act to wrap the resolve method. To do that we need an async act()
  // We also need to wait for the previous run to finish resolving which is why we assign promise run to a variable p, and then we can make our assertion

  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue) // resolve the promise to not just any object but a unique Symbol
    await p
  })

  expect(result.current).toEqual({
    ...resolvedState,
    data: resolvedValue, // here we assert that the returned data is the exame same Symbol we resolved to, not just a copy
  })

  // 🐨 call `reset` (💰 this will update state, so...)
  // 🐨 assert the result.current has actually been reset
  act(() => {
    result.current.reset()
  })

  // result.current should be resetted to its initial state
  expect(result.current).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(useAsync)

  expect(result.current).toEqual(defaultState)

  let p
  act(() => {
    // store promise from run so that it can be awaited later
    p = result.current.run(promise)
  })

  // when running the promise, the object from useAsync should change
  expect(result.current).toEqual(pendingState)

  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue) // resolve the promise to not just any object but a unique Symbol
    await p.catch(() => {
      // ignore do nothing with error
    })
  })

  expect(result.current).toEqual({
    ...rejectedState,
    error: rejectedValue
  })
})
// 🐨 this will be very similar to the previous test, except you'll reject the
// promise instead and assert on the error state.
// 💰 to avoid the promise actually failing your test, you can catch
//    the promise returned from `run` with `.catch(() => {})`

test('can specify an initial state', () => {
  const mockData = Symbol('resolved value')
  const customInitialState = {
    status: 'resolved',
    data: mockData,
  }
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData
  })
})
// 💰 useAsync(customInitialState)

test('can set the data', () => {
  const mockData = Symbol('resolved value')
  const {result} = renderHook(() => useAsync())
  act(() => result.current.setData(mockData))

  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  })
})
// 💰 result.current.setData('whatever you want')

test('can set the error', () => {
  const mockError = Symbol('rejected value')
  const {result} = renderHook(() => useAsync())
  act(() => result.current.setError(mockError))

  expect(result.current).toEqual({
    ...rejectedState,
    error: mockError,
  })
})
// 💰 result.current.setError('whatever you want')

test('No state updates happen if the component is unmounted while pending', async () => {
  const mockData = Symbol('fake value')
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let p
  act(() => {
    p = result.current.run(promise)
  })

  // unmount useAsync and then resolve promise then test assertions
  unmount()
  await act(async () => {
    resolve()
    await p
  })

  // if we change safeSetState to setState in setData (hooks.js) we get a console error:
  // "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application..."
  //however tests are still passing. we need it to fail when console errors shows up
  expect(console.error).not.toHaveBeenCalled() // works with jest.spyOn(console, 'error') from earlier

  // console.error.mockRestore() // restore original console.error implementation and no longer spy on it however if an error is thrown before this, mockRestore will not be called. That's why we move it into beforeEach test and afterEach test instead.
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(useAsync)

  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
