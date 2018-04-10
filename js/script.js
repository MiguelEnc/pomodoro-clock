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
    time = parseInt(sessionLength.text()) * 60;
    timer.start();
    clockRunning = true;
    changeResetStyle(false);
    changeStartStopButtonStyle(true);
  } else {
    timer.stop();
    clockRunning = false;
    changeResetStyle(true);
    changeStartStopButtonStyle(false);
  }
});

$("#reset").click(function() {
  
});

function changeStartStopButtonStyle(started) {
  if(started) {
    $("#start-stop").addClass("started");
    $("#start-stop").text("STOP");
  } else {
    $("#start-stop").removeClass("started");
    $("#start-stop").text("START");
  }
}

function changeResetStyle(active) {
  $("#reset").css("cursor", active ? "pointer" : "not-allowed");
  $("#reset").prop("disabled", !active);
}

$("#session-decrease").click(function() {
  if(!clockRunning){
    var length = parseInt(sessionLength.text());
    if(length > 1) {
      sessionLength.text(length-1);
    }
  }
});

$("#session-increase").click(function() {
  if(!clockRunning){
    var length = parseInt(sessionLength.text());
    sessionLength.text(length+1);
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
