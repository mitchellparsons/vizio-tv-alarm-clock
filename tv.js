const smartcast = require("vizio-smart-cast");
const fs = require("fs")
let data = require("./tv.json")

let tv;
if(data.vizioAuthToken && data.vizioTVIP) tv = new smartcast(data.vizioTVIP, data.vizioAuthToken)

const readData = () => {
  return require("./tv.json")
}

const saveData = (data, callback) => {
  fs.writeFile("tv.json", JSON.stringify(data, null, 4), "utf8", callback)
}

function setAlarm(alarm, timezone, callback) {
  data.alarm = alarm
  data.timezone = timezone
  saveData(data, callback)
}

function isTvOn() {
  if(!tv) return Promise.resolve(false)
  return new Promise((resolve, reject) => {
    return tv.power.currentMode().then((data) => {
      resolve(data.ITEMS[0].VALUE)
    })
  })
}


function alarm() {
  if(!tv) return Promise.reject("tv is not paired")
  return new Promise((resolve, reject) => {
    tv.control.power.on()
      .then(() => {
        return tv.input.set("HDMI-" + data.hdmi)
      })
  })
}

module.exports.getTVIP = () => data.vizioTVIP
module.exports.isPaired = () => data.vizioAuthToken ? true : false
modules.exports.alarm = alarm