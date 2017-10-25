var alarmHour = $("#alarm-hour");
var alarmMinute = $("#alarm-minute");
var alarmSecond = $("#alarm-second");
var tvip = $("#tvip");
var timezone = $("#timezone");

function setAlarm(alarm) {
  alarmHour.val(alarm.substring(0,2));
  alarmMinute.val(alarm.substring(3,5));
  alarmSecond.val(alarm.substring(6,8));
}

function getAlarm() {
  // return alarmHour.val() + ":" + alarmMinute.val() + ":" + alarmSecond.val();
  return ((alarmHour.val().length < 2) ? "0" + alarmHour.val() : alarmHour.val())
  + ":"
  + ((alarmMinute.val().length < 2) ? "0" + alarmMinute.val() : alarmMinute.val())
  + ":"
  + ((alarmSecond.val().length < 2) ? "0" + alarmSecond.val() : alarmSecond.val());
}

$.get("/data", function(data) {
  setAlarm(data.alarm);
  tvip.val(data.tvip);
  timezone.val(data.timezone);
});

$("#update").click(function() {
  $.ajax({
    method: "POST",
    url: "/update",
    dataType: "json",
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      tvip: $("#tvip").val(),
      alarm: getAlarm(),
      timezone: $("#timezone").val()
    })
  })
  .done(function( msg ) {
    alert( "Data Saved: " + msg );
  });
})

$("#pair-tv").click(function() {
  $.get("/pair", function( data ) {
    if(data === "ok"){
      pin = prompt("Enter the PIN:");
      $.ajax({
        method: "POST",
        url: "/pair",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          pin: pin
        })
      })
    }
  });
})