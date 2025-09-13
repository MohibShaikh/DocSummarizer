# AI Desktop Client

A modern, secure desktop application that connects directly to Anthropic's Claude API with document upload capabilities. Your API key is stored locally and encrypted using your OS keychain - no data ever goes through third-party servers.

## ✨ Features

- 🔒 **Secure API Key Storage**: Your API key is encrypted and stored in your OS keychain
- 🚫 **No Third-Party Servers**: Direct connection to Anthropic's API
- 🤖 **Anthropic Claude Integration**: Powered by Claude 3 Sonnet
- 📄 **Document Upload**: Upload and analyze documents (PDF, TXT, MD)
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux
- 📱 **iOS/Mobile Optimized**: Touch-friendly design for iPad and mobile devices
- 🎨 **Modern Grok-Style UI**: Beautiful interface with dark/light themes
- ⚡ **Real-time Chat**: Instant responses with typing indicators
- 🔍 **Document Analysis**: AI can read and analyze your uploaded documents

<img width="1335" height="853" alt="image" src="https://github.com/user-attachments/assets/9edd2001-8bcb-4517-8611-f38cf6a7b6e7" />

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd upworwerk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm run electron-dev
   ```

### 📦 Building for Production

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Package the Electron app:**
   ```bash
   npm run electron-pack
   ```

The built application will be in the `dist` folder.

### 🪟 Windows Users

For Windows users, you can also use the provided batch file:
```bash
install.bat
```

## 📖 How to Use

### 1. **First Launch**
- Enter your Anthropic API key when prompted
- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- Your key is securely stored in your OS keychain (Windows Credential Manager, macOS Keychain, or Linux Secret Service)

### 2. **Upload Documents**
- Click "Select File" to upload documents for analysis
- **Supported formats**: PDF, TXT, MD
- The AI can read and analyze the full content of your documents

### 3. **Chat with Claude**
- Start a conversation with Claude 3 Sonnet
- Your messages and Claude's responses are sent directly to Anthropic's API
- No data is stored or transmitted through third-party servers
- Use the suggested prompts or ask anything you want!

### 4. **Theme Toggle**
- Switch between light and dark modes using the sun/moon icon
- Your preference is saved locally

## 🔒 Security & Privacy

- **🔐 Local Storage**: Your API key is encrypted and stored locally using your OS keychain
- **🚫 No Third-Party Servers**: All communication goes directly to Anthropic's servers
- **📊 No Data Collection**: The app doesn't collect, store, or transmit any personal data
- **🔍 Open Source**: Full source code is available for review
- **🛡️ Secure IPC**: Electron's context isolation prevents unauthorized access

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern CSS and Inter font
- **Desktop Framework**: Electron 28
- **API Integration**: Direct Anthropic Claude API calls
- **Security**: OS keychain integration via keytar
- **File Handling**: Native file system access with pdf-parse
- **Styling**: CSS Grid, Flexbox, and modern gradients
- **Icons**: Custom SVG icons and summary.png

## 🏗️ Development

### Project Structure

```
upworwerk/
├── src/
│   ├── components/
│   │   ├── ApiKeyManager.js      # API key setup and management
│   │   ├── ApiKeyManager.css     # Grok-style welcome screen
│   │   ├── ChatInterface.js      # Main chat interface with Claude
│   │   ├── ChatInterface.css     # Modern chat UI styling
│   │   ├── DocumentUpload.js     # File upload functionality
│   │   └── DocumentUpload.css    # Upload component styling
│   ├── App.js                    # Main application component
│   ├── App.css                   # Global styles and theme
│   └── index.js                  # Application entry point
├── public/
│   ├── electron.js               # Main Electron process
│   ├── preload.js               # Secure IPC bridge
│   ├── index.html               # HTML template
│   └── summary.png              # App logo
├── package.json                  # Dependencies and scripts
└── .gitignore                   # Git ignore rules
```

### Available Scripts

- `npm start` - Start React development server (browser mode)
- `npm run electron-dev` - Start Electron in development mode
- `npm run build` - Build React app for production
- `npm run electron-pack` - Package Electron app for distribution

## 🐛 Troubleshooting

### API Key Issues
- ✅ Ensure your API key starts with "sk-ant-"
- ✅ Check that you have sufficient API credits
- ✅ Verify your API key is valid at [Anthropic Console](https://console.anthropic.com/)

### File Upload Issues
- ✅ Ensure the file format is supported (PDF, TXT, MD)
- ✅ Check file permissions and accessibility
- ✅ Try with a smaller file size

### Performance
- ✅ The app uses Electron, which may have higher memory usage than native apps
- ✅ For better performance, consider closing other applications
- ✅ Large documents may take longer to process

### Mobile/iOS Issues
- ✅ The app is optimized for iOS Safari and mobile devices
- ✅ Touch targets are minimum 44px for better usability
- ✅ Input fields prevent zoom on focus (16px font size)

## 📱 Mobile Support

This app is fully optimized for mobile devices and iPads:
- **Touch-friendly**: 44px minimum touch targets
- **iOS Safari**: Prevents zoom on input focus
- **Responsive**: Adapts to all screen sizes
- **Safe areas**: Supports notched devices

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit:
- 🐛 Bug reports
- ✨ Feature requests  
- 🔧 Pull requests
- 📖 Documentation improvements

## 🙏 Acknowledgments

- **Anthropic** for the Claude API
- **Electron** for the desktop framework
- **React** for the UI framework
- **Inter Font** for beautiful typography
