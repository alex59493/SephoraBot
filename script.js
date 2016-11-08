'use strict';
var currentAction = null;

// Get the first action and display it
$(function() {
  var parameters = { currentAction: currentAction, userInput: "" };

  $.ajax({
    url: 'https://4ykhvsc5rb.execute-api.ap-southeast-1.amazonaws.com/test/next',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(parameters),
    success: function(res) {
      // Display first question
      $('#messagesWindow').append('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div><p>' + res.currentAction.question + "</p></div>");

      currentAction = res.currentAction;
    },
    error: function(xhr) {
      console.log(xhr);
    }
  });
});


$("#btn").click(function() {

  // Append user input to displayed messages
  $('#messagesWindow').append("<div class='right'>" + $("#userInput").val() + "</div>");

  var parameters = { currentAction: currentAction, userInput: $("#userInput").val() };
  $.ajax({
    url: 'https://4ykhvsc5rb.execute-api.ap-southeast-1.amazonaws.com/test/next',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(parameters),
    success: function(res) {
      // Display answer
      setTimeout(function() {
        $('#messagesWindow').append('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div><p>' + res.currentAction.resp + "</p></div>");
      }, 500);

      // Display next question
      setTimeout(function() {
        $('#messagesWindow').append('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div><p>' + res.nextAction.question + "</p></div>");
      }, 2500);

      currentAction = res.nextAction;
    },
    error: function(xhr) {
      console.log(xhr);
    }
  });

  // Clear textarea
  $("#userInput").val('');
  return true;
});