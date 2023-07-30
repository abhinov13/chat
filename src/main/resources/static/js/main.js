'use strict';

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#username-form");
var messageForm = document.querySelector("#message-form");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connecting = document.querySelector(".connecting");

var stompClient = null;
var username = null;
var colors = ['#00a8ff', '#fbc531', '#9c88ff', '#4cd137', '#487eb0', '#e84118', '#7f8fa6', '#273c75', '#353b48'];

function onMessageReceived(payload)
{
    var message = JSON.parse(payload.body);
    console.log('logging payload');
    console.log(payload);
    var messageElement = document.createElement('li');
    if(message.type === 'JOIN')
    {
        console.log("connecting debug message");
        messageElement.classList.add('event-message');
        message.message = message.source + ' joined!';
    }
    else if(message.type === 'LEAVE')
    {
        messageElement.classList.add('event-message');
        message.message = message.source + ' left!';        
    }
    else
    {
        messageElement.classList.add('chat-message');
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.source[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = '#dcdde1';
        messageElement.appendChild(avatarElement);
        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.source);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.message);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function onError()
{
    connecting.textContent = 'Could not connect to WS. Please refresh and retry connecting.';
    connecting.style.color = 'red';    
}

function onConnect()
{
    stompClient.subscribe('/topic/chat', onMessageReceived);
    stompClient.send('/app/addUser',{},JSON.stringify({source: username, type:  'JOIN'}));
    connecting.classList.add('hidden');
}

function connect(event)
{
    console.log("debug trying to connect");
    username = document.querySelector('#name').value.trim();
    if(username)
    {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnect, onError);
    }
    event.preventDefault();
}

function sendMessage(event)
{
    var messageContent = messageInput.value.trim();
    console.log(messageContent);
    if(messageContent && stompClient)
    {
        var chatMessage = {
            source: username,
            message: messageContent,
            type: 'CHAT'
        };
        stompClient.send(
            '/app/sendMessage',
            {},
            JSON.stringify(chatMessage)
        );
    }
    messageInput.value = '';
    event.preventDefault();
}

usernameForm.addEventListener(
    'submit', connect, true
);

messageForm.addEventListener(
    'submit',
    sendMessage,
    true
)
