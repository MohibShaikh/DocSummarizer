import React, { useState, useEffect } from 'react';
import './App.css';
import ApiKeyManager from './components/ApiKeyManager';
import ChatInterface from './components/ChatInterface';
import DocumentUpload from './components/DocumentUpload';

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check current provider and API key on app load
    const initializeApp = async () => {
      try {
        if (window.electronAPI) {
          // Running in Electron
          const key = await window.electronAPI.getApiKey('anthropic');
          setApiKey(key);
        } else {
          // Running in browser
          setApiKey(null);
        }
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setCurrentProvider('anthropic');
        setApiKey(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleApiKeySet = (key) => {
    console.log('handleApiKeySet called with key:', key);
    setApiKey(key);
    console.log('API key state updated to:', key);
  };

  const handleApiKeyDelete = () => {
    setApiKey(null);
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>AI Desktop Client</h1>
            <p>Direct API access with secure local storage</p>
          </div>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!apiKey ? (
            <ApiKeyManager 
              onApiKeySet={handleApiKeySet} 
            />
        ) : (
          <div className="main-content">
            <div className="sidebar">
              <DocumentUpload onDocumentUpload={handleDocumentUpload} />
              <div className="api-key-info">
                <p>Provider: Anthropic Claude</p>
                <p>API Key: ••••••••••••••••</p>
                <button 
                  className="btn btn-secondary"
                  onClick={handleApiKeyDelete}
                >
                  Remove API Key
                </button>
              </div>
            </div>
            <div className="chat-area">
                <ChatInterface 
                  apiKey={apiKey} 
                  uploadedDocument={uploadedDocument} 
                  isDarkMode={isDarkMode} 
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
