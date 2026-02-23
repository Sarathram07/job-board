import React from "react";
import { useNavigate } from "react-router-dom";
import ChatNavBar from "./ChatNavBar";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useMessages, useAddMessage } from "../lib/graphql/hooks/hook";

import "../navbar.css";

const Chat = ({ user }) => {
  const navigate = useNavigate();
  const { messages } = useMessages();
  const { addMessage } = useAddMessage();

  const handleSend = async (text) => {
    const message = await addMessage(text);
    console.log("Message added:", message);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // or any default page
    }
  };

  return (
    <>
      <ChatNavBar />
      <section className="section">
        <div className="container">
          <h1 className="title is-4">{`Chatting as ${user.name}`}</h1>
          <MessageList user={user} messages={messages} />
          <MessageInput onSend={handleSend} />
          <button
            className="button is-link button-centered"
            onClick={() => handleBack()}
          >
            ← Back
          </button>
        </div>
      </section>
    </>
  );
};

export default Chat;
