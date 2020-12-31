// abstract generic API client
function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`,config)
    .then(async response => {
      const data = await response.json() // this is an async call
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export {client}

/*






























💰 spoiler alert below...



























































const config = {
    method: 'GET',
    ...customConfig,
  }
*/
