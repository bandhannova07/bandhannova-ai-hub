# BandhanNova AI - System Prompt Implementation Guide

## 📁 File Location
`/prompts/system-prompt.md` - Main system prompt for all AI agents

## 🎯 Purpose
This comprehensive system prompt serves as the **root instruction set** for all AI agents in the BandhanNova AI Hub ecosystem.

## 📋 What's Included

### 1. 🏢 Company & Ecosystem Context
- BandhanNova company information
- Founder details (Bandhan Das)
- Multi-agent collaboration framework
- AI ecosystem awareness

### 2. 🧠 Language Intelligence (HIGHEST PRIORITY)
- Multilingual mastery (Bengali, Hindi, English + more)
- Auto language detection
- Code-switching support (Banglish, Hinglish)
- Native-level fluency standards
- Cultural context awareness

### 3. 🗣️ Human-Like Conversation
- Warm, friendly personality
- Natural language patterns
- Tone adaptation
- Emoji usage for expressiveness
- Empathetic responses

### 4. 🧩 Thinking & Answer Quality
- Multiple thinking modes (Quick, Normal, Deep)
- Structured response framework
- Accuracy and relevance standards
- Step-by-step reasoning

### 5. 📚 Learning from Data
- PDF, text, notes processing
- Knowledge integration
- Source citation
- Context application

### 6. 🧠 Conversational Memory
- User preference tracking
- Context retention
- Conversation flow awareness
- Personalization

### 7. 🚀 Excellence Goal
- World's best conversational AI
- Continuous improvement
- User-centric approach

### 8. 🙂 Emoji Guidelines
- When to use emojis
- How many to use
- Emoji selection guide
- Practical examples

## 🔧 How to Use

### For API Integration
```typescript
const systemPrompt = fs.readFileSync('./prompts/system-prompt.md', 'utf-8');

const response = await ai.chat({
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ]
});
```

### For Different AI Agents
Each specialized AI can extend this base prompt:

```typescript
// Conversational AI
const conversationalPrompt = systemPrompt + `
You are the Conversational AI specialist.
Focus on general assistance and friendly chat.
`;

// Code Assistant AI
const codeAssistantPrompt = systemPrompt + `
You are the Code Assistant AI specialist.
Focus on programming help, code generation, and debugging.
Use technical emojis: 💻 🔧 🐛 ⚡
`;

// Research AI
const researchPrompt = systemPrompt + `
You are the Research & Discovery AI specialist.
Focus on web research, fact-finding, and knowledge discovery.
Cite sources and provide comprehensive insights.
`;
```

## 📊 Key Features

### ✨ Multilingual Excellence
- **Auto-detects** user language
- **Responds** in same language
- **Switches** seamlessly
- **Understands** code-mixing

### 💬 Natural Conversations
- Sounds **human**, not robotic
- Uses **emojis** liberally
- Shows **personality**
- Adapts **tone**

### 🧠 Smart Thinking
- **Quick mode** for simple queries
- **Normal mode** for balanced responses
- **Thinking mode** for complex problems

### 📚 Learning Capability
- Reads **PDFs** and documents
- Extracts **key insights**
- Applies **knowledge** immediately
- **Remembers** context

## 🎯 Success Metrics

The AI should achieve:
- ✅ Perfect language fluency
- ✅ Natural conversation flow
- ✅ High user satisfaction
- ✅ Accurate information
- ✅ Contextual awareness
- ✅ Engaging personality

## 🚀 Next Steps

1. **Integrate** this prompt into your AI backend
2. **Test** with different languages
3. **Monitor** conversation quality
4. **Iterate** based on user feedback
5. **Extend** for specialized agents

## 💡 Tips

- **Always** include the system prompt first
- **Customize** for specific agent types
- **Test** multilingual capabilities
- **Monitor** emoji usage
- **Track** user satisfaction

---

**Created for BandhanNova AI Hub**
*Making AI accessible in every language 🌍*
