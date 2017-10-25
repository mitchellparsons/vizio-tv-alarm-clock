var alarm = $("#timepicker").timepicker({ timeFormat: "H:i:s", step: 15 });

alarm.on("change", function() {
  var a = $(this).val();
  console.log("changed time to: ", a);
  updateAlarm(a);
});

$.get("/alarm", function( data ) {
  var now = new Date();
  alarm.val(data.alarm);
});

function updateAlarm(time) {
  $.ajax({
    method: "POST",
    url: "/alarm",
    dataType: "json",
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      alarm: time,
      timezone: $("#timezone").val()
    })
  })
}

// tv
var tvip = $("#tvip").on("change", function() {
  var a = $(this).val();
  console.log("changed ip to: ", a);
  updateTVIP(a);
})

function updateTVIP(tvip) {
  $.ajax({
    method: "POST",
    url: "/tv",
    dataType: "json",
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      tvip: tvip
    })
  })
  .done(function( msg ) {
    alert( "Data Saved: " + msg );
  });
}

$.get("/tv", function(data) {
  tvip.val(data.tvip);
  if(data.isPaired) {
    // do something
  } else {
    // do something else
  }
});

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