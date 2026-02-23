import React from "react";

const ChatNavBar = () => {
  return (
    <nav className="navbar-chat">
      <div className="navbar-brand">
        <p className="navbar-item is-size-5 has-text-weight-bold">
          GraphQL Chat
        </p>
      </div>
      {/* <div className="navbar-end">
        <div className="navbar-item">
          <button className="button is-link">Logout</button>
        </div>
      </div> */}
    </nav>
  );
};

export default ChatNavBar;
