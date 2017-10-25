var SUNRISE_HEX = "#FD7D01";
var SUN_HEX = "#FDB813";
var state = "nothing";
var alarmSound;
var timezone = "America/Chicago";



// var fakeMidnight = now + (30 * 1000);
// var untilMidnight = (fakeMidnight - now);

function startPreAlarm(alarmTime) {
  var now = (new Date()).getTime();
  console.log("starting pre alarm color changing");
  $("body").css("background-color", SUNRISE_HEX)
  $("body").animate({'background-color': SUN_HEX}, (alarmTime - now), 'linear', function(){
    console.log("Done prealarming colors");
  });
}

function startAlarm(soundFile) {
  console.log("start alarm");
  alarmSound = new Audio("/sounds/" + soundFile);
  alarmSound.loop = true;
  alarmSound.play();
}

function stopAlarm() {
  console.log("stop alarm");
  $("body").stop();
  if (!!alarmSound) {
    alarmSound.pause();
  }
}

function getAlarmData() {
  $.get( "/alarm", function( data ) {
    console.log( "Load was performed.", data );
    timezone = data.timezone
    if(data.state !== state) {
      state = data.state;
      switch (state) {
        case "sleep": 
          console.log("State to sleep");
          stopAlarm();
          break;
        case "preAlarm":
          console.log("State to preAlarm");
          startPreAlarm(data.alarm);
          break;
        case "alarm":
          console.log("State to alarm");
          startAlarm(data.sound);
          break;
      }
    }
    setTimeout(getAlarmData, 5000);
  });
}
getAlarmData();


// DISPLAY TIME
function startTime() {
  var today = moment.tz(timezone);
  var h = today.hours() % 12;
  var m = today.minutes();
  var s = today.seconds();
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
  t = setTimeout(function() {
    startTime()
  }, 500);
}
startTime();