import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";
import ComposeBox from "./ComposeBox";
import "../styles/composebox.scss";

const ChatHead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatHeadRef = useRef(null);

  // Store input values even when minimized
  const [subject, setSubject] = useState("");
  const [label, setLabel] = useState("");
  const [body, setBody] = useState("");

  // Position State & Dragging
  const positionRef = useRef({ x: 20, y: 20 });
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Start dragging
  const startDragging = (e) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  // Drag movement
  const onDrag = (e) => {
    if (draggingRef.current) {
      positionRef.current = {
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      };
      chatHeadRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  };

  // Stop dragging
  const stopDragging = (e) => {
    draggingRef.current = false;
  };

  // Attach event listeners
  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  return (
    <div>
      {!isOpen ? (
        <div
          className="chat-head"
          ref={chatHeadRef}
          style={{
            position: "fixed",
            transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
            width: "50px",
            height: "50px",
            borderRadius: "50%", // Make it round
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
            userSelect: "none",
          }}
          onMouseDown={startDragging}
          onClick={(e) => {
            if (!draggingRef.current) setIsOpen(true);
          }}
        >
          <FiMessageCircle size={24} />
        </div>
      ) : (
        <ComposeBox
          onClose={() => setIsOpen(false)}
          onMinimize={() => setIsOpen(false)}
          subject={subject}
          setSubject={setSubject}
          label={label}
          setLabel={setLabel}
          body={body}
          setBody={setBody}
        />
      )}
    </div>
  );
};

export default ChatHead;
