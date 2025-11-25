import { createContext, useState } from "react";
import main from "../config/gemini";

export const Context = createContext();

// Helper function to convert basic Markdown to HTML
const formatResponse = (response) => {
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

    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
        setResultData("")
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
        
        const rawResponse = await main(sentPrompt)
        
        // Process the raw Markdown response into HTML format
        const formattedResponse = formatResponse(rawResponse);
        
        let newResponseArray = formattedResponse.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
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
        newChat
    }

    return(
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider