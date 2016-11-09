'use strict';

// CONFIG
var TIMERESPONSE = 2000; // Number of milliseconds that the bot needs to write its message
var TIMEBETWEENRESPONSES = 500; // Number of milliseconds between 2 bot messages
 
var currentAction = null;


// Start the conversation with the bot
$(function() {
    var parameters = { currentAction: null }; // Ping the bot with empty request to start the conversation
    sendToBot(parameters, function(res) {
        displayGreetings(res);// Display greetings
        currentAction = res.nextAction;
    });
});


$("#btn").click(sendMessage);

$("#userInput").keypress(function(e) {
    if (e.which == 13) {
        sendMessage();
    }
});


function sendMessage() {
    displayUserMessage($("#userInput").val());

    var parameters = { currentAction: currentAction, userInput: $("#userInput").val() };
    sendToBot(parameters, function(res) {
        displayBotResponse(res);
    });

    // Clear textarea
    $("#userInput").val('');
    return true;
}


function displayGreetings(res) {
    var i = 0;
    var interval = setInterval(function() {

        // If all the item in the greetings array are not yet displayed, display the next one
        if (i !== res.currentAction.greetings.length) {
            displayBotMessage(res.currentAction.greetings[i]);
            i += 1;
        }

        // Else, display the next question
        else {
            clearInterval(interval);

            // Display first question
            displayBotMessage(res.nextAction.question);
        }

    }, TIMERESPONSE + TIMEBETWEENRESPONSES);
}


function displayBotResponse(res) {
    setTimeout(function() {
        // Display answer of the current entity
        displayBotMessage(res.currentAction.resp);

        // If this is the last entity of the flow, show the bye message and close conversation
        if (res.nextAction.byeMessage) {
            setTimeout(function() {
                displayBotMessage(res.nextAction.byeMessage);
            }, TIMERESPONSE + TIMEBETWEENRESPONSES);

            currentAction = -1;
        }

        // Else, display the next question
        else {
            setTimeout(function() {
                displayBotMessage(res.nextAction.question);
            }, TIMERESPONSE + TIMEBETWEENRESPONSES);

            currentAction = res.nextAction;
        }
    }, TIMEBETWEENRESPONSES);
}


function sendToBot(parameters, callback) {
    $.ajax({
        url: 'https://unfxpfonfk.execute-api.ap-southeast-1.amazonaws.com/test/next',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(parameters),
        success: function(res) {
            callback(res);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}


function displayBotMessage(message) {
    if (!message) return false;

    var waiter = $('<div class="left"><div class="bye"><span>.</span><span>.</span><span>.</span></div></div>').appendTo($('#messagesWindow'));
    $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);

    setTimeout(function() {
        waiter.remove();

        $('#messagesWindow').append('<div class="left"><p>' + message + "</p></div>");
        $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight); // Refresh scroll (in case of the height of the paragraphe is higher than the height of the waiter)
    }, TIMERESPONSE);

    return true;
}


function displayUserMessage(message) {
    if (!message) return false;

    $('#messagesWindow').append('<div class="right">' + message + "</div>");
    $('#messagesWindow').scrollTop($('#messagesWindow').get(-1).scrollHeight);
    return true;
}
