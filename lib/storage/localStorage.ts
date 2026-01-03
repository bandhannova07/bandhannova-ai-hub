// Local Storage for Messages and Conversations
// Client-side persistence layer

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    agentType: string;
    responseMode: string;
    model: string;
}

export interface Conversation {
    id: string;
    title: string;
    agentType: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

// Storage keys
const CONVERSATIONS_KEY = 'bandhannova_conversations';
const ACTIVE_CONVERSATION_KEY = 'bandhannova_active_conversation';

// Helper to safely access localStorage
function getStorage(): Storage | null {
    if (typeof window !== 'undefined') {
        return window.localStorage;
    }
    return null;
}

// Get all conversations
export function getAllConversations(agentType?: string): Conversation[] {
    const storage = getStorage();
    if (!storage) return [];

    try {
        const data = storage.getItem(CONVERSATIONS_KEY);
        if (!data) return [];

        const conversations: Conversation[] = JSON.parse(data);

        if (agentType) {
            return conversations.filter(c => c.agentType === agentType);
        }

        return conversations;
    } catch (error) {
        console.error('Error reading conversations:', error);
        return [];
    }
}

// Get single conversation by ID
export function getConversation(id: string): Conversation | null {
    const conversations = getAllConversations();
    return conversations.find(c => c.id === id) || null;
}

// Save conversation
export function saveConversation(conversation: Conversation): void {
    const storage = getStorage();
    if (!storage) return;

    try {
        const conversations = getAllConversations();
        const existingIndex = conversations.findIndex(c => c.id === conversation.id);

        if (existingIndex >= 0) {
            // Update existing
            conversations[existingIndex] = {
                ...conversation,
                updatedAt: Date.now()
            };
        } else {
            // Add new
            conversations.push(conversation);
        }

        // Sort by updatedAt (most recent first)
        conversations.sort((a, b) => b.updatedAt - a.updatedAt);

        storage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error('Error saving conversation:', error);
    }
}

// Delete conversation
export function deleteConversation(id: string): void {
    const storage = getStorage();
    if (!storage) return;

    try {
        const conversations = getAllConversations();
        const filtered = conversations.filter(c => c.id !== id);
        storage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));

        // Clear active if it was deleted
        const activeId = getActiveConversationId();
        if (activeId === id) {
            clearActiveConversation();
        }
    } catch (error) {
        console.error('Error deleting conversation:', error);
    }
}

// Update conversation
export function updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversation = getConversation(id);
    if (!conversation) return;

    const updated = {
        ...conversation,
        ...updates,
        updatedAt: Date.now()
    };

    saveConversation(updated);
}

// Add message to conversation
export function addMessage(conversationId: string, message: Message): void {
    const conversation = getConversation(conversationId);
    if (!conversation) return;

    conversation.messages.push(message);
    saveConversation(conversation);
}

// Create new conversation
export function createConversation(agentType: string, title: string = 'New Chat'): Conversation {
    const conversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        agentType,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    saveConversation(conversation);
    setActiveConversationId(conversation.id);

    return conversation;
}

// Active conversation management
export function getActiveConversationId(): string | null {
    const storage = getStorage();
    if (!storage) return null;
    return storage.getItem(ACTIVE_CONVERSATION_KEY);
}

export function setActiveConversationId(id: string): void {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(ACTIVE_CONVERSATION_KEY, id);
}

export function clearActiveConversation(): void {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(ACTIVE_CONVERSATION_KEY);
}

// Generate conversation title from first message
export function generateConversationTitle(firstMessage: string): string {
    const maxLength = 50;
    const cleaned = firstMessage.trim();

    if (cleaned.length <= maxLength) {
        return cleaned;
    }

    return cleaned.substring(0, maxLength) + '...';
}

// Clear all data (for testing/reset)
export function clearAllConversations(): void {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(CONVERSATIONS_KEY);
    storage.removeItem(ACTIVE_CONVERSATION_KEY);
}

// Get storage usage info
export function getStorageInfo(): { used: number; available: number; percentage: number } {
    const storage = getStorage();
    if (!storage) return { used: 0, available: 0, percentage: 0 };

    try {
        const data = storage.getItem(CONVERSATIONS_KEY) || '';
        const used = new Blob([data]).size;
        const available = 5 * 1024 * 1024; // ~5MB typical localStorage limit
        const percentage = (used / available) * 100;

        return { used, available, percentage };
    } catch (error) {
        return { used: 0, available: 0, percentage: 0 };
    }
}
