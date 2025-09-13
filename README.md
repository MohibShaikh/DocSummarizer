# AI Desktop Client

A simple, secure desktop application that connects directly to AI APIs (Anthropic Claude & Google Gemini) with document upload capabilities. Your API keys are stored locally and encrypted using your OS keychain - no data ever goes through third-party servers.

## Features

- 🔒 **Secure API Key Storage**: Your API keys are encrypted and stored in your OS keychain
- 🚫 **No Third-Party Servers**: Direct connection to AI APIs
- 🤖 **Multiple AI Providers**: Support for Anthropic Claude and Google Gemini
- 📄 **Document Upload**: Upload and analyze documents (PDF, TXT, DOC, DOCX, MD)
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux
- 📱 **Responsive Design**: Optimized for both laptop and iPad use
- 🎨 **Modern UI**: Clean, intuitive interface with dark mode support

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run electron-dev
   ```

### Building for Production

1. Build the React app:
   ```bash
   npm run build
   ```

2. Package the Electron app:
   ```bash
   npm run electron-pack
   ```

The built application will be in the `dist` folder.

## Usage

1. **First Launch**: Enter your Anthropic API key when prompted
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - Your key is securely stored in your OS keychain

2. **Upload Documents**: Click "Select File" to upload documents for analysis
   - Supported formats: PDF, TXT, DOC, DOCX, MD

3. **Chat with Claude**: Start a conversation with Claude
   - Your messages and Claude's responses are sent directly to Anthropic's API
   - No data is stored or transmitted through third-party servers

## Security & Privacy

- **Local Storage**: Your API key is encrypted and stored locally using your OS keychain
- **Direct API Access**: All communication goes directly to Anthropic's servers
- **No Data Collection**: The app doesn't collect, store, or transmit any personal data
- **Open Source**: Full source code is available for review

## Technology Stack

- **Frontend**: React 18 with modern CSS
- **Desktop Framework**: Electron
- **API Integration**: Direct Anthropic API calls
- **Security**: OS keychain integration via keytar
- **File Handling**: Native file system access

## Development

### Project Structure

```
src/
├── components/
│   ├── ApiKeyManager.js      # API key setup and management
│   ├── ChatInterface.js      # Main chat interface
│   └── DocumentUpload.js     # File upload functionality
├── App.js                    # Main application component
└── index.js                  # Application entry point

public/
├── electron.js               # Main Electron process
├── preload.js               # Secure IPC bridge
└── index.html               # HTML template
```

### Available Scripts

- `npm start` - Start React development server
- `npm run electron-dev` - Start Electron in development mode
- `npm run build` - Build React app for production
- `npm run electron-pack` - Package Electron app for distribution

## Troubleshooting

### API Key Issues
- Ensure your API key starts with "sk-ant-"
- Check that you have sufficient API credits
- Verify your API key is valid at [Anthropic Console](https://console.anthropic.com/)

### File Upload Issues
- Ensure the file format is supported (PDF, TXT, DOC, DOCX, MD)
- Check file permissions and accessibility
- Try with a smaller file size

### Performance
- The app uses Electron, which may have higher memory usage than native apps
- For better performance, consider closing other applications
- Large documents may take longer to process

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.
