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
  return +(Math.round(value + 'e+2') + 'e-2')
}

export function getPercentage(value) {
  return getTwoDecimalPlaces(value * 100)
}

export function isHighDensity() {
  return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3))
}

export function getWordNumber(num) {
  let a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen ']
  let b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety']

  if ((num = num.toString()).length > 9) return 'overflow'

  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
  if (!n) return

  let str = ''
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
  return str
}

export function getBPM(seconds) {
  if (seconds) {
    return this.getTwoDecimalPlaces(1/seconds * 60)
  }

  return 0
}
