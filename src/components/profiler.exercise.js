// this is for extra credit
import React from 'react'
import { client } from 'utils/api-client'

let queue = []

setInterval(sendProfileQueue, 5000);

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve({success: true}) // there's nothing left in the queue, we won't bother calling the backend
  }
  // otherwise call the backend
  const queueToSend = [...queue]
  queue = []
  return client('profile', {data: queueToSend})

}

const Profiler = ({phases, metadata, ...props}) => {
  function reportProfile(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or update (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization which will give us an idea how our optimizations are performing
    startTime, // initial time when React begin rendering the update from the initial mount of our application.
    commitTime, // when React committed this update
    interactions, // the Set of interactions (set not array)
  )  {

  if (!phases || phases.includes(phase)) { // if phases hasn't been specified or already included in phase
    queue.push({
      metadata,
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions: [...interactions], // this is a set not an array, so we are converting it to an array.
    })
  }
  }

  return <React.Profiler {...props} onRender={reportProfile}/>
}

export {unstable_trace as trace, unstable_wrap as wrap} from 'scheduler/tracing'
export {Profiler}