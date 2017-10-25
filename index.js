const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const smartcast = require("vizio-smart-cast");
const moment = require("moment-timezone")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


let data = require("./data.json")
data.state = "sleep"

let tv = (data.vizioAuthToken) ? new smartcast(data.vizioTVIP, data.vizioAuthToken) : new smartcast(data.vizioTVIP)

app.use("/", express.static("static"))
app.use("/node_modules", express.static("node_modules"))
app.use("/sounds", express.static("sounds"))

app.get("/alarm", function(req, res) {
  let now = moment.tz(data.timezone)
  let alarm = moment(now.format("YYYY-MM-DDT") + data.alarm + now.format("Z"))
  res.send({
    alarm: alarm.valueOf(),
    state: data.state,
    sound: data.sound,
    timezone: data.timezone
  })
})

app.post("/alarm", function(req, res) {
  data.alarm = req.body.alarm
  data.timezone = req.body.timezone
  saveData(data, function(err){
    if(err) {
      res.send("error")
    } else {
      res.send("ok")
    }
  })
})

app.get("/tv", function(req, res) {
  res.send({
    tvip: data.vizioTVIP,
    isPaired: !!tv
  })
})

app.post("/tv", function(req, res) {
  data.vizioTVIP = req.body.tvip;
  saveData(data,function(err){
    if(err) {
      res.send("error")
    } else {
      res.send("ok")
    }
  })
})

app.get("/pair", function(req, res) {
  tv.pairing.initiate()
    .then((response) => {
      res.send("ok")
    })
    .catch(() => {
      res.send("fail")
    })
})

app.post("/pair", function(req, res) {
  tv.pairing.pair(req.body.pin).then((response) => {
    let authToken = response.ITEM.AUTH_TOKEN;
    tv.pairing.useAuthToken(authToken)
    data.vizioAuthToken = authToken;
    saveData(data, function(){
      res.send("ok")
    })
  })
  .catch(() => {
    res.send("fail")
  })
})

app.listen(3000, function () {
  console.log("Vizio TV Alarm Clock listening on port 3000!")
})

const saveData = (data, callback) => {
  fs.writeFile("data.json", JSON.stringify(data, null, 4), "utf8", callback)
}

function turnOnTv() {
  tv.control.power.on().then(() => tv.input.set("HDMI-" + data.hdmi))
}

function loop() {
  let now = moment.tz(data.timezone)
  let alarm = moment(now.format("YYYY-MM-DDT") + data.alarm + now.format("Z"))
  let n = now.valueOf()
  let a = alarm.valueOf()
  if(data.state === "sleep") {
    var lead = data.leadTimeSeconds * 1000
    if(n < a && n > a - lead) {
      data.state = "preAlarm"
      turnOnTv()
    }
  } else if (data.state === "preAlarm") {
    if(n >= a) {
      data.state = "alarm"
      turnOnTv()
    }
  } else if (data.state === "alarm") {
    var duration = data.durationSeconds * 1000
    if(n > a + duration) {
      data.state = "sleep"
    }
  }
  setTimeout(loop, 1000)
}
loop(data)