import { createContext, useState, useRef, useEffect } from "react";
import main from "../config/gemini";

export const Context = createContext();

// Helper function to convert basic Markdown to HTML
const formatResponse = (response) => {
    // Handle undefined or null response
    if (!response || typeof response !== 'string') {
        return 'No response received';
    }
    
    // 1. Replace **...** with <b>...</b>
    let formattedText = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    // 2. Replace ###... with <h3>...</h3> (Handle specific heading levels)
    formattedText = formattedText.replace(/###\s*(.*)/g, '<h3>$1</h3>');
    
    // 3. Replace ##... with <h2>...</h2>
    formattedText = formattedText.replace(/##\s*(.*)/g, '<h2>$1</h2>');

    // 4. Replace *... with <li>...</li> (Basic bullet point handling)
    formattedText = formattedText.replace(/^\*\s*(.*)/gm, '<li>$1</li>');
    
    // 5. Replace raw newlines (\n) with HTML line breaks (<br>)
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
}

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");
    const [conversationHistory,setConversationHistory] = useState([]);
    // Store all chat sessions in sidebar
    const [chatSessions,setChatSessions] = useState([]);
    // Use ref to always have the latest conversation history synchronously
    const conversationHistoryRef = useRef([]);

    // Load chat sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('gemini_chat_sessions');
        if (savedSessions) {
            try {
                const sessions = JSON.parse(savedSessions);
                setChatSessions(sessions);
            } catch (e) {
                console.error("Error loading chat sessions:", e);
            }
        }
    }, []);

    // Save chat sessions to localStorage whenever they change
    useEffect(() => {
        if (chatSessions.length > 0) {
            localStorage.setItem('gemini_chat_sessions', JSON.stringify(chatSessions));
        }
    }, [chatSessions]);

    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        // Save current conversation to sessions before clearing
        if (conversationHistory.length > 0 || prevPrompts.length > 0) {
            const currentSession = {
                id: Date.now(),
                title: prevPrompts[0] || "New Chat",
                prompts: [...prevPrompts],
                history: [...conversationHistory],
                timestamp: new Date().toISOString()
            };
            setChatSessions(prev => [currentSession, ...prev]);
        }
        
        setLoading(false)
        setShowResult(false)
        setResultData("")
        setConversationHistory([])
        conversationHistoryRef.current = []
        setPrevPrompts([])
        setRecentPrompt("")
    }
    
    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        
        // Use either the passed prompt or the current input state
        const sentPrompt = prompt || input;
        
        setRecentPrompt(sentPrompt)
        setPrevPrompts(prev=>[...prev, sentPrompt])
        setInput("")
        
        // Get current conversation history from ref (always up-to-date)
        const currentHistory = conversationHistoryRef.current;
        
        // Add user message to conversation history
        const updatedHistory = [...currentHistory, { role: "user", parts: [{ text: sentPrompt }] }];
        console.log("Current history length:", currentHistory.length);
        console.log("Sending conversation history with", updatedHistory.length, "messages");
        console.log("History preview:", updatedHistory.map(msg => `${msg.role}: ${msg.parts[0].text.substring(0, 50)}...`));
        
        let rawResponse;
        try {
            // Pass conversation history to maintain context
            rawResponse = await main(sentPrompt, updatedHistory);
        } catch (error) {
            console.error("Error getting response:", error);
            rawResponse = "Sorry, I encountered an error. Please try again.";
        }
        
        // Add AI response to conversation history
        const finalHistory = [...updatedHistory, { role: "model", parts: [{ text: rawResponse }] }];
        setConversationHistory(finalHistory);
        conversationHistoryRef.current = finalHistory; // Update ref synchronously
        console.log("Updated conversation history with", finalHistory.length, "messages");
        
        // Process the raw Markdown response into HTML format
        const formattedResponse = formatResponse(rawResponse || '');
        
        let newResponseArray = formattedResponse.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
    }

    const loadChatSession = (session) => {
        setConversationHistory(session.history || []);
        conversationHistoryRef.current = session.history || [];
        setPrevPrompts(session.prompts || []);
        if (session.prompts && session.prompts.length > 0) {
            setRecentPrompt(session.prompts[session.prompts.length - 1]);
            setShowResult(true);
            // Restore the last response if available
            if (session.history && session.history.length > 0) {
                const lastMessage = session.history[session.history.length - 1];
                if (lastMessage.role === 'model') {
                    const lastResponse = lastMessage.parts[0]?.text || '';
                    const formattedResponse = formatResponse(lastResponse);
                    setResultData(formattedResponse);
                }
            }
        }
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        chatSessions,
        loadChatSession
    }

    return(
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider