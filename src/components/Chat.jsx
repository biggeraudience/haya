import { useEffect, useState } from 'react'; 
import '../styles/chat.scss'; // Import the SCSS file

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Track if the chat box is open

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    socket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && message) {
      ws.send(message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage('');
    }
  };

  return (
    <div>
      {/* Chat Widget Button (SVG Icon) */}
      <button className="chat-button" onClick={() => setIsOpen((prev) => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z"/>
        </svg>
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="chat-box">
          <h3>How can we help?</h3>
          <div className="message-container">
            {messages.map((msg, index) => (
              <div key={index} className="message">{msg}</div>
            ))}
          </div>

          {/* Input and Send Button */}
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button className="send-button" onClick={sendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
