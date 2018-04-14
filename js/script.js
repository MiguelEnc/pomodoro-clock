var sessionLength = $("#session-length"),
    digitalClock  = $("#digital-clock"),    
    breakLength   = $("#break-length"),
    timeLabel     = $("#time-label"),
    hand          = $("#hand");
  
var clockRunning = false,
    currentlyWorking = true,
    paused = false;

var minutes = 0, 
    seconds = 0, 
    timeForDigitalClock = 0,
    timeForHandDegrees = 0;

var timer = {
  timer: new moment.duration(1, "seconds")
      .timer({loop: true, start: false}, timerCallBack),
  start: function() {
    if(!paused) {
      timeForDigitalClock = parseInt(sessionLength.text()) * 60;
      timeForHandDegrees = parseInt(sessionLength.text()) * 60;
    }
    this.timer.start();
  },
  stop: function() {
    this.timer.stop();
  }
}

function timerCallBack() {
  timeForDigitalClock = timeForDigitalClock-1;
  minutes = parseInt(timeForDigitalClock/60);
  seconds = timeForDigitalClock%60;
  digitalClock.text(minutes + ":" + (seconds < 10 ? "0"+seconds : seconds));

  var degress = ((60 - seconds) / timeForHandDegrees) * 360;
  hand.css("transform", "rotate("+ degress +"deg)");
}

$("#start-stop").click(function() {
  if(!clockRunning){
    timer.start();
    clockRunning = true;
    changeWorkingPausedStyles(true);
  } else {
    timer.stop();
    paused = true;
    clockRunning = false;
    changeWorkingPausedStyles(false);
  }
});

$("#reset").click(function() {
  if(!clockRunning) {
    timeForDigitalClock = parseInt(sessionLength.text()) * 60;
    timeForHandDegrees = parseInt(sessionLength.text()) * 60;
    paused = false;
    digitalClock.text(sessionLength.text() + ":00");
    hand.css("transform", "rotate(0deg)");
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
      paused = false;
      hand.css("transform", "rotate(0deg)");
    }
  }
});

$("#session-increase").click(function() {
  if(!clockRunning){
    var length = parseInt(sessionLength.text());
    sessionLength.text(length+1);
    digitalClock.text((length+1)+":00");
    paused = false;
    hand.css("transform", "rotate(0deg)");
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
