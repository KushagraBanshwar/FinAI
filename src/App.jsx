import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const FinAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);
  
  // Update nav links color based on scroll
  useEffect(() => {
    const updateNavLinksColor = () => {
      const navLinks = document.querySelectorAll('.nav-links a');
      const scrollPosition = window.scrollY;
      
      navLinks.forEach(link => {
        link.style.color = scrollPosition > 50 ? 'white' : 'black';
      });
    };

    window.addEventListener('scroll', updateNavLinksColor);
    updateNavLinksColor();
    
    return () => window.removeEventListener('scroll', updateNavLinksColor);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
      };
      scrollToBottom();
    }
  }, [messages.length, isTyping]); // Only trigger on new messages or typing status changes

  // Simulate typing effect
  const typeMessage = (text, setDisplayText, onComplete) => {
    let index = 0;
    const speed = 30;

    const typing = setInterval(() => {
      setDisplayText(text.substring(0, index));
      index++;
      if (index > text.length) {
        clearInterval(typing);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typing);
  };

  // Simulate bot response
  const simulateBotResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = 'This is a sample response from Finerd AI.';
      addMessage(response, 'bot');
    }, 1000);
  };

  // Add message to chat
  const addMessage = (text, type) => {
    const newMessage = {
      text,
      type,
      id: Date.now(),
      isLatest: true,
      hasAnimated: type === 'user' // User messages don't need animation
    };
    
    setMessages(prev => prev.map(msg => ({
      ...msg,
      isLatest: false,
      hasAnimated: true // Mark all previous messages as animated
    })).concat(newMessage));
  };

  // Handle send message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage.trim(), 'user');
      setInputMessage('');
      simulateBotResponse();
    }
  };

  // Handle tab click
  const handleTabClick = (tabName) => {
    addMessage(`Selected: ${tabName}`, 'user');
    simulateBotResponse();
  };

  // Message component
  const Message = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [hasAnimated, setHasAnimated] = useState(message.hasAnimated);
    const isBot = message.type === 'bot';

    useEffect(() => {
      if (isBot && message.isLatest && !hasAnimated) {
        const cleanup = typeMessage(message.text, setDisplayText, () => {
          setHasAnimated(true);
        });
        return cleanup;
      } else {
        setDisplayText(message.text);
      }
    }, [message.text, isBot, message.isLatest, hasAnimated]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    return (
      <div className={`message-container ${message.type === 'bot' ? '' : 'ml-auto'}`}>
        <div className={`message ${message.type}-message`}>
          <div className={isBot && message.isLatest && !hasAnimated ? 'typewriter-text' : ''}>
            {displayText}
          </div>
          {isBot && (
            <button
              className="copy-button"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav>
        <div className="logo-section">
          <img src="/api/placeholder/120/40" alt="Finerd Logo" className="logo" />
          <span className="finerd-text">FINERD</span>
        </div>
        <div className="nav-links">
          <a href="#">Home Page</a>
          <a href="#">Button2</a>
          <a href="#">Button3</a>
          <a href="#">Button4</a>
          <a href="#">Button5</a>
        </div>
      </nav>

      <div className="container">
        <div className="chat-container">
          <div 
            className="chat-messages" 
            ref={messagesContainerRef}
          >
            <div className="messages-wrapper">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="typing-indicator active" />
              )}
            </div>
          </div>

          <div className="input-section">
            <div className="tabs">
              {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
                <button
                  key={index}
                  className="tab"
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinAI;