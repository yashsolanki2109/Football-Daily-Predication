# ChatGPT UI Clone

A modern, responsive ChatGPT-like interface built with Next.js, TypeScript, and styled-components.

## Features

- 🎨 **ChatGPT-like Design**: Authentic dark theme with proper styling
- 💬 **Real-time Chat**: Interactive chat interface with message history
- 💾 **Local Storage**: Automatically saves last 5 minutes of chat history
- 📱 **Responsive Layout**: Works on desktop and mobile devices
- 🔄 **Conversation Management**: Create new conversations and switch between them
- 🗑️ **Clear Chat**: One-click option to clear chat history
- ⚡ **TypeScript**: Full type safety throughout the application
- 🎯 **Styled Components**: Modern CSS-in-JS styling approach
- 🚀 **Next.js 14**: Built with the latest Next.js App Router

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: styled-components
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Football-Predication
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chat interface
│   │   ├── Message.tsx          # Individual message component
│   │   ├── InputArea.tsx        # Message input area
│   │   └── Sidebar.tsx          # Conversation sidebar
│   ├── lib/
│   │   └── registry.tsx         # Styled-components registry
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
```

## Features in Detail

### Chat Interface

- Clean, modern design matching ChatGPT's aesthetic
- Message bubbles with different colors for user and assistant
- Timestamps for each message
- Auto-scroll to latest message

### Sidebar

- Conversation history
- Create new conversations
- Switch between conversations
- Responsive design with toggle functionality

### Input Area

- Expandable textarea
- Send button with keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Character count display
- Placeholder text

### Local Storage

- Automatically saves the last 5 minutes of chat messages
- Messages are restored when you return to the chat
- Automatic cleanup of expired messages (older than 5 minutes)
- Visual indicator when messages are loaded from storage
- Clear chat button to remove all stored messages

### Mock AI Responses

- Simulated AI responses with random delays
- Multiple response templates for variety
- Realistic typing simulation

## Customization

### Colors

The application uses a dark theme with the following color palette:

- Background: `#343541`
- Sidebar: `#202123`
- Assistant messages: `#444654`
- Primary green: `#10a37f`
- Text: `#ececf1`
- Secondary text: `#8e8ea0`

### Styling

All styling is done with styled-components, making it easy to customize:

- Modify component styles in their respective files
- Update global styles in `globals.css`
- Add new themes by extending the styled components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

1. **New Components**: Create them in `src/app/components/`
2. **Styling**: Use styled-components for component-specific styles
3. **State Management**: Currently using React useState, can be extended with Context or Redux
4. **API Integration**: Replace mock responses with real API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by ChatGPT's user interface
- Built with modern React and Next.js best practices
- Styled with styled-components for maintainable CSS-in-JS
