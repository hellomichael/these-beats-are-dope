export function getSeconds(timecode) {
  let separator = timecode.split(':')
  let minutes = parseInt(separator[0])
  let seconds = parseInt(separator[1])
  let milliseconds = parseInt(separator[2])
  return getTwoDecimalPlaces((minutes * 60) + (seconds) + (milliseconds/30))
}

export function getTimecode(value) {
  let minutes = Math.floor(value / 60)
  let seconds =  Math.floor(value - minutes * 60)
  let milliseconds = Math.floor((value - Math.floor(value)) * 30)

  // Prefix w/ 0s
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (milliseconds < 10) {
    milliseconds = '0' + milliseconds
  }

  return minutes + ':' + seconds + ':' + milliseconds
}

export function getTwoDecimalPlaces(value) {
  return +(Math.round(value + "e+2")  + "e-2")
}

export function getPercentage(value) {
  return getTwoDecimalPlaces(value * 100)
}
