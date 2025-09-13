import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = ({ apiKey, currentProvider, uploadedDocument, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Debug logging
  console.log('ChatInterface props:', { apiKey: apiKey ? 'Set' : 'Not Set', currentProvider, uploadedDocument });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add system message about uploaded document
    if (uploadedDocument) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `Document "${uploadedDocument.name}" (${uploadedDocument.pages} pages) has been uploaded and is ready for analysis. Content preview: ${uploadedDocument.content.substring(0, 200)}...`
      }]);
    }
  }, [uploadedDocument]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      let response;
      
        // Anthropic API call
        let systemPrompt = "You are a helpful AI assistant. Please provide clear, accurate, and helpful responses.";
        
        if (uploadedDocument) {
          systemPrompt += `\n\nA document named "${uploadedDocument.name}" (${uploadedDocument.pages} pages) has been uploaded. Here is the full content of the document:\n\n${uploadedDocument.content}\n\nWhen the user asks about documents or files, they are referring to this document. Please analyze and respond based on the document content when relevant.`;
        }

        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            system: systemPrompt,
            messages: [
              ...messages.filter(msg => msg.type === 'user' || msg.type === 'assistant').map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
              })),
              {
                role: 'user',
                content: userMessage.content
              }
            ]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to get response from Anthropic API');
        }

        const data = await response.json();
        
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.content[0].text
        };

        setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const suggestedPrompts = [
    "What are the advantages of using Next.js?",
    "Write code to demonstrate Dijkstra's algorithm",
    "Help me write an essay about Silicon Valley",
    "What is the weather in San Francisco?"
  ];

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="chat-interface">
      {messages.length === 0 ? (
        <div className="grok-welcome">

          <div className="grok-greeting">
            <h1>Hello there!</h1>
            <p>How can I help you today?</p>
          </div>

          <div className="suggested-prompts">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-card"
                onClick={() => handleSuggestedPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="grok-input-area">
            <div className="grok-input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                disabled={isLoading}
                rows={1}
              />
              <div className="grok-controls-bottom">
                <div className="right-controls">
                  <button 
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22,2 12,12 2,2"></polyline>
                        <polyline points="12,2 12,22"></polyline>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="chat-header">
            <h3>Chat with Claude</h3>
            <div className="chat-actions">
              {uploadedDocument && (
                <div className="document-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                  {uploadedDocument.name} ({uploadedDocument.pages} pages)
                </div>
              )}
              <button 
                className="btn btn-clear"
                onClick={clearChat}
                disabled={messages.length === 0}
              >
                Clear Chat
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <div className="input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                disabled={isLoading}
                rows={1}
              />
              <button 
                className="btn btn-send"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
