const express = require("express")
const alarm = require("./alarm.js")
const tv = require("./tv.js")
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", express.static("static"))
app.use("/node_modules", express.static("node_modules"))
app.use("/sounds", express.static("sounds"))

app.get("/health", function (req, res) {
  res.send("ok")
})

app.get("/alarm", function(req, res) {
  res.send({
    alarm: alarm.getAlarmTime(),
    state: alarm.getState(),
    sound: alarm.getSound()
  })
})

app.post("/alarm", function(req, res) {
  console.log("payload: ", req.body)
  alarm.setAlarm(req.body.alarm, req.body.timezone, function(err){
    if(err) {
      res.send("error")
    } else {
      res.send("ok")
    }
  })
})

app.get("/tv", function(req, res) {
  res.send({
    tvip: tv.getTVIP(),
    isPaired: tv.isPaired()
  })
})

app.use(express.static("static"))

app.listen(3000, function () {
  console.log("Vizio TV Alarm Clock listening on port 3000!")
})

