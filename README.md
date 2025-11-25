
🚀 Gemini Clone - Context-Aware Chat Application
A full-stack, context-aware chat application that mimics the core features of the Gemini interface, including conversation history, new chat functionality, and the ability to maintain context across multiple prompts in a single session.




✨ Features
Contextual Conversations: Utilizes the Gemini API to maintain the context of the conversation, allowing for coherent and natural follow-up questions.

Persistent Chat History: Saves and loads past chat sessions to/from local storage, visible in the sidebar.

New Chat Functionality: Allows users to start a fresh conversation, archiving the previous session.

Interactive UI: A modern, clean, and responsive user interface built with React.

Markdown Rendering: Formats the AI's response (Markdown like **bold**, *list*, ## headings) for better readability.

Loading Animation: Provides a visual indicator (<hr> bars) while waiting for the AI response.

Prompt Suggestions: Displays quick-start prompt cards on the main screen.




🛠️ Tech Stack
This project is built using the MERN-like stack, specifically focusing on the frontend and a simple Node.js backend to handle API calls.

Frontend
React (Vite): JavaScript library for building the user interface.

Context API: For global state management (prompts, results, history).

CSS: For styling (used in .css files).

Backend/Config
Node.js/Express: For the simple server that acts as a proxy to the Gemini API (though the provided code suggests the main function might be a direct frontend-to-API call if using a browser environment/config).

Gemini API: The core service for generating responses and handling context.




📂 Project Structure
The file structure follows a typical React application layout:

gemini-clone/
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js      <-- Node/Express backend (API Proxy)
├── src/
│   ├── assets/
│   │   └── assets.js  <-- (Presumably) Contains all image paths/icons
│   ├── components/
│   │   ├── Main/
│   │   │   ├── Main.css
│   │   │   └── Main.jsx  <-- Main chat interface and result display
│   │   └── Sidebar/
│   │       ├── Sidebar.css
│   │       └── Sidebar.jsx <-- Navigation, New Chat, and Recent History
│   ├── context/
│   │   └── Context.jsx  <-- Context Provider for state and API logic
│   ├── config/
│   │   └── gemini.js    <-- API call function (connecting to backend/API)
│   ├── App.css
│   ├── App.jsx          <-- Root component
│   ├── index.css
│   └── main.jsx         <-- Entry point
└── vite.config.js




⚙️ Setup and Installation
Prerequisites
Node.js (LTS recommended)

A Gemini API Key

Installation Steps
Clone the Repository:

Bash
git clone <repository-url>
cd gemini-clone
Install Dependencies:

Bash
# Install frontend dependencies (assuming you are in the project root)
npm install 
# Or, install dependencies in both front-end and back-end
npm install && cd backend && npm install && cd ..
Configure API Key (Backend - server.js): The backend uses a proxy to handle the API calls. You must set up your environment variable.

Create a file named .env in the backend directory.

Add your API key:

Code snippet
GEMINI_API_KEY="YOUR_API_KEY_HERE"
Run the Application:

Start the Backend (API Proxy):

Bash
cd backend
npm start # or node server.js
# Typically runs on http://localhost:3000
Start the Frontend (React App):

Bash
cd .. # Back to the project root
npm run dev
# Typically runs on http://localhost:5173






💡 How Context and History Work
The application manages conversation state using the following logic within src/context/Context.jsx:

conversationHistory: An array of objects ({ role: "user" | "model", parts: [{ text: "..." }] }) that is updated after every message sent and received.

onSent Function:

Takes the current user prompt.

Appends the user's prompt to the existing conversationHistory.

Sends the entire, updated history (including the new user prompt) to the main function (API). This is crucial for contextual chat.

Receives the AI response.

Appends the model's response to the conversationHistory.

newChat Function:

Saves the current conversationHistory and prevPrompts into a new session in the chatSessions state.

Clears conversationHistory, prevPrompts, and the main chat result to start fresh.

chatSessions: Stores saved conversations in Local Storage for persistence, which populates the "Recent" list in the sidebar. The loadChatSession function restores the history from a saved session.







🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.