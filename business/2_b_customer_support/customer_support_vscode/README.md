# Customer Support Chat System

A real-time customer support chat system built with Node.js, React, and Socket.IO. This system enables seamless communication between customers and support agents with features like real-time messaging, file sharing, typing indicators, and read receipts.

## Features

- Real-time chat between customers and support agents
- File and image sharing capabilities
- Typing indicators
- Read receipts
- Agent assignment system
- Responsive design for both web and mobile
- Customer chat widget for easy website integration
- Authentication system for agents
- Message history and persistence
- Real-time status updates

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- JWT for authentication

### Frontend
- React
- Redux Toolkit for state management
- Material-UI for components
- Socket.IO client
- date-fns for date formatting

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── store/         # Redux store and slices
│   │   └── App.js         # Main application component
│   └── package.json
│
├── src/
│   ├── server/            # Backend server code
│   │   ├── config/        # Configuration files
│   │   ├── models/        # Mongoose models
│   │   ├── socket/        # Socket.IO event handlers
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── README.md
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd customer-support-chat
```

2. Install dependencies:
```bash
# Install backend dependencies
cd src/server
npm install

# Install frontend dependencies
cd ../../client
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/customer-support
JWT_SECRET=your-jwt-secret
NODE_ENV=development

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
```

4. Start the development servers:
```bash
# Start backend server
cd src/server
npm run dev

# Start frontend server
cd ../../client
npm start
```

## Components Documentation

### CustomerChatWidget

A React component that can be embedded on any website to provide customer support chat functionality.

```jsx
import CustomerChatWidget from './components/CustomerChatWidget';

function App() {
  return <CustomerChatWidget />;
}
```

Features:
- Floating chat button
- Collapsible chat window
- Real-time messaging
- File and image sharing
- Typing indicators

### MessageList

Displays chat messages with support for different message types and real-time updates.

```jsx
import MessageList from './components/MessageList';

function ChatWindow() {
  return <MessageList chatId="chat123" />;
}
```

Features:
- Text, image, and file message support
- Message timestamps
- Automatic scrolling
- Loading states

### TypingIndicator

Shows when someone is typing in the chat.

```jsx
import TypingIndicator from './components/TypingIndicator';

function ChatWindow() {
  return <TypingIndicator users={['John', 'Jane']} />;
}
```

Features:
- Animated typing dots
- Multiple user support
- Responsive design

## Socket Events

### Customer Events
- `start_chat`: Initialize a new chat session
- `send_message`: Send a new message
- `typing_start`: Indicate user is typing
- `typing_stop`: Indicate user stopped typing

### Agent Events
- `join_chat`: Agent joins a chat
- `leave_chat`: Agent leaves a chat
- `transfer_chat`: Transfer chat to another agent
- `mark_read`: Mark messages as read

## Database Models

### User
- `id`: Unique identifier
- `email`: User's email
- `password`: Hashed password
- `role`: User role (agent/customer)
- `status`: Online/offline status

### Chat
- `id`: Unique identifier
- `customerId`: Customer's ID
- `agentId`: Assigned agent's ID
- `status`: Chat status (active/closed)
- `createdAt`: Chat creation timestamp

### Message
- `id`: Unique identifier
- `chatId`: Associated chat ID
- `senderId`: Sender's ID
- `content`: Message content
- `type`: Message type (text/image/file)
- `readBy`: Array of user IDs who read the message
- `timestamp`: Message timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository. 