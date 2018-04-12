var sessionLength = $("#session-length"),
    digitalClock  = $("#digital-clock"),    
    breakLength   = $("#break-length"),
    timeLabel     = $("#time-label");
  
var clockRunning = false,
    currentlyWorking = true;

var minutes = 0, seconds = 0, time = 0;

var timer = {
  timer: new moment.duration(1, "seconds")
      .timer({loop: true, start: false}, timerCallBack),
  start: function() {
    if(time == 0) {
      time = parseInt(sessionLength.text()) * 60;
    }
    this.timer.start();
  },
  stop: function() {
    this.timer.stop();
  }
}

function timerCallBack() {

  time = time-1;
  minutes = parseInt(time/60);
  seconds = time%60;
  digitalClock.text(minutes + ":" + (seconds < 10 ? "0"+seconds : seconds));
}

$("#start-stop").click(function() {
  if(!clockRunning){
    timer.start();
    clockRunning = true;
    changeWorkingPausedStyles(true);
  } else {
    timer.stop();
    clockRunning = false;
    changeWorkingPausedStyles(false);
  }
});

$("#reset").click(function() {
  if(!clockRunning) {
    time = parseInt(sessionLength.text()) * 60;
    digitalClock.text(sessionLength.text() + ":00");
  }
});

function changeWorkingPausedStyles(running) {
  if(running) {
    $("#start-stop").addClass("started");
    $("#start-stop").text("STOP");
    $("#reset").css("cursor", "not-allowed");
    $("#reset").prop("disabled", true);
    $("#session-increase").css("cursor", "not-allowed");
    $("#session-decrease").css("cursor", "not-allowed");
    $("#break-increase").css("cursor", "not-allowed");
    $("#break-decrease").css("cursor", "not-allowed");
  } else {
    $("#start-stop").removeClass("started");
    $("#start-stop").text("START");
    $("#reset").css("cursor", "pointer");
    $("#reset").prop("disabled", false);
    $("#session-increase").css("cursor", "pointer");
    $("#session-decrease").css("cursor", "pointer");
    $("#break-increase").css("cursor", "pointer");
    $("#break-decrease").css("cursor", "pointer");
  }
}

$("#session-decrease").click(function() {
  if(!clockRunning){
    var length = parseInt(sessionLength.text());
    if(length > 1) {
      sessionLength.text(length-1);
      digitalClock.text((length-1)+":00");
    }
  }
});

$("#session-increase").click(function() {
  if(!clockRunning){
    var length = parseInt(sessionLength.text());
    sessionLength.text(length+1);
    digitalClock.text((length+1)+":00");
  }
});

$("#break-decrease").click(function() {
  if(!clockRunning){
    var length = parseInt(breakLength.text());
    if(length > 1){
      breakLength.text(length-1);
    }
  }
});

$("#break-increase").click(function() {
  if(!clockRunning){
    var length = parseInt(breakLength.text());
    breakLength.text(length+1);
  }
});
