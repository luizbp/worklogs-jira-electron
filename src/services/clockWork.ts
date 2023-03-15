import axios from "axios"

const baseUrlApi = 'https://api.clockwork.report/v1'
const token = ''

type ClockWorkParams = {
  issue_key: string
}

// const clockWork = clockWorkAPI({
//   issue_key: task?.value || ''
// })

// clockWork.stop()

export const clockWorkAPI = ({issue_key}: ClockWorkParams) => {
  const start = () => {
    axios.post(`${baseUrlApi}/start_timer`, {
      issue_key
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }

  const stop = () => {
    axios.post(`${baseUrlApi}/stop_timer`, {
      issue_key
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }

  return {
    start,
    stop
  }
}


