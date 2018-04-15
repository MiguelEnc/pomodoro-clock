var sessionLength = $("#session-length"),
    digitalClock  = $("#digital-clock"),    
    breakLength   = $("#break-length"),
    timeLabel     = $("#time-label"),
    hand          = $("#hand");
  
var clockRunning = false,
    currentlyWorking = true,
    paused = false;

var clockTime = {
  time: 0,
  total: 0,
  // Stage can be session or break time
  set: function(stage) {
    this.time = parseInt(stage) * 60;
    this.total = parseInt(stage) * 60;
  },
  recalculate: function() {
    if(this.time - 1 > 0){
      this.time = this.time - 1;
    } else {
      changeStage();
    }
  },
  minutes: function() {
    return parseInt(this.time / 60);
  },
  seconds: function() {
    return this.time % 60;
  },
  get: function() {
    return this.time;
  },
  totalTime: function() {
    return this.total;
  }
}

var timer = {
  timer: new moment.duration(1, "seconds")
      .timer({loop: true, start: false}, timerCallBack),
  start: function() {
    if(!paused) {
      var stage = currentlyWorking ? sessionLength.text() : breakLength.text();
      clockTime.set(stage);
    }
    this.timer.start();
  },
  stop: function() {
    this.timer.stop();
  }
}

function timerCallBack() {
  clockTime.recalculate();
  var formatedSeconds = clockTime.seconds();
  formatedSeconds = formatedSeconds < 10 ? "0" + formatedSeconds : formatedSeconds;

  digitalClock.text(clockTime.minutes() + ":" + formatedSeconds);

  var degress = ((clockTime.totalTime() - clockTime.get()) / clockTime.totalTime()) * 360;
  hand.css("transform", "rotate("+ degress +"deg)");
}

function changeStage() {
  var stage = "";
  if(currentlyWorking) {
    stage = breakLength.text();
    currentlyWorking = false;
    timeLabel.text("Break Time!");
  } else {
    stage = sessionLength.text();
    currentlyWorking = true;
    timeLabel.text("Work Time!");
  }
  clockTime.set(stage);
}

$("#start-stop").click(function() {
  timeLabel.css("visibility", "visible");
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
    timeLabel.css("visibility", "hidden");
    clockTime.set(sessionLength.text());
    currentlyWorking = true;
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
      paused = false;
      breakLength.text(length-1);
      digitalClock.text((length-1)+":00");
      hand.css("transform", "rotate(0deg)");
    }
  }
});

$("#break-increase").click(function() {
  if(!clockRunning){
    var length = parseInt(breakLength.text());
    paused = false;
    breakLength.text(length+1);
    digitalClock.text((length-1)+":00");
    hand.css("transform", "rotate(0deg)");
  }
});
