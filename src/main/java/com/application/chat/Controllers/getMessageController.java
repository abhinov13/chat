package com.application.chat.Controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.application.chat.Model.CustomMessage;

@Controller
public class getMessageController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/chat")
    public CustomMessage sendToChat(@Payload CustomMessage message)
    {
        return message;
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/chat")
    public CustomMessage addUser(@Payload CustomMessage customMessage, SimpMessageHeaderAccessor headerAccessor)
    {
        headerAccessor.getSessionAttributes().put("username", customMessage.getSource());
        return customMessage;
    }
}
