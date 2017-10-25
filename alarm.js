const fs = require("fs")
let data = require("./alarm.json")
data.state = "sleep"

const readData = () => {
  return require("./alarm.json")
}

const saveData = (data, callback) => {
  fs.writeFile('alarm.json', JSON.stringify(data, null, 4), 'utf8', callback)
}

function setAlarm(alarm, timezone, callback) {
  data.alarm = alarm
  data.timezone = timezone
  saveData(data, callback)
}

function loop() {
  var alarm = new Date(data.alarm).getTime()
  var now = new Date().getTime()
  if(data.state === "sleep") {
    var lead = data.leadTimeSeconds * 1000
    if(now < alarm && now > alarm - lead) {
      data.state = "preAlarm"
    }
  } else if (data.state === "preAlarm") {
    if(now >= alarm) {
      data.state = "alarm"
    }
  } else if (data.state === "alarm") {
    var duration = data.durationSeconds * 1000
    if(now > alarm + duration) {
      data.state = "sleep"
    }
  }
  setTimeout(loop, 1000)
}
loop()

module.exports.getState = () => data.state
module.exports.getAlarmTime = () => data.alarm
module.exports.getSound = () => data.sound
module.exports.getTimezone = () => data.timezone
module.exports.setAlarm = setAlarm