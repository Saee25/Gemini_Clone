async function main(prompt, conversationHistory = []) {
  try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, conversationHistory }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend error: ${res.status}`);
    }

    const data = await res.json();
    
    // Handle both cases: if data is already a string or if it has a text property
    if (typeof data === 'string') {
      return data;
    }
    
    return data.text || data || ''; // clean AI output
  } catch (error) {
    console.error("Error fetching response:", error);
    throw error;
  }
}

export default main;
