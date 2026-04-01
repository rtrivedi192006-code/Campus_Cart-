import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MoreVertical, Phone } from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { io, Socket } from 'socket.io-client'
import './ChatPage.css'

type Message = {
  _id: string
  senderId: string
  receiverId: string
  text: string
  createdAt: string
  updatedAt: string
}

type Conversation = {
  id: string
  name: string
  product: string
  messages: Message[]
  otherUserId: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const [activeId, setActiveId] = useState<string>('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('offline')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  const userId = user?._id ?? user?.email ?? ''
  const API_BASE_URL = 'http://192.168.0.100:5000' // <YOUR_LOCAL_IP> for mobile; update before production

  // Function to fetch messages from backend (HTTP)
  const fetchMessages = async (otherUserId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('[ChatPage] fetchMessages: no token')
        return []
      }

      const endpoint = `${API_BASE_URL}/api/messages/${otherUserId}`
      console.log('[ChatPage] fetchMessages request:', endpoint)

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`[ChatPage] fetchMessages failed: ${response.status} ${text}`)
      }

      const data: Message[] = await response.json()
      console.log('[ChatPage] fetchMessages response', data.length)
      return data
    } catch (error) {
      console.error('[ChatPage] fetchMessages error', error)
      return []
    }
  }

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)
      // For now, we'll use mock conversations but fetch real messages
      // In a real app, you'd fetch conversation list from backend
      const mockConversations: Conversation[] = [
        {
          id: 'c1',
          name: 'Kabir',
          product: 'Wireless Mouse (Silent Click)',
          otherUserId: '507f1f77bcf86cd799439011', // Replace with real user ID
          messages: []
        },
        {
          id: 'c2',
          name: 'Zoya',
          product: 'Noise-Canceling Headphones',
          otherUserId: '507f1f77bcf86cd799439012', // Replace with real user ID
          messages: []
        },
      ]

      // Fetch messages for each conversation
      for (const conv of mockConversations) {
        const messages = await fetchMessages(conv.otherUserId)
        conv.messages = messages
      }

      setConversations(mockConversations)
      setActiveId(mockConversations[0]?.id || '')
      setLoading(false)
    }

    loadConversations()
  }, [])

  const activeConv = conversations.find(c => c.id === activeId) ?? null

  // Function to handle conversation selection
  const selectConversation = async (conversationId: string) => {
    setActiveId(conversationId)
    // Messages will be refreshed automatically by the polling useEffect
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConv?.messages])

  // Socket.IO setup
  useEffect(() => {
    if (!user) return

    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server')
      setConnectionStatus('online')
      
      // Join user's room
        socket.emit('join', userId)
    })

    // Message events
    socket.on('receiveMessage', (message: Message) => {
      console.log('Received message:', message)
      
      // Update conversations with new message
      setConversations(prev =>
        prev.map(c => {
          // Check if this message belongs to this conversation
          if ((message.senderId === c.otherUserId && message.receiverId === userId) ||
              (message.receiverId === c.otherUserId && message.senderId === userId)) {
            return { ...c, messages: [...c.messages, message] }
          }
          return c
        })
      )
    })

    socket.on('messageSent', (message: Message) => {
      console.log('Message sent confirmation:', message)
      
      // Replace temporary message with real message
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? {
            ...c,
            messages: c.messages.map(m => 
              m._id.startsWith('temp-') && m.text === message.text ? message : m
            )
          } : c
        )
      )
    })

    socket.on('messageError', (error) => {
      console.error('Message error:', error)
      
      // Remove failed temporary message
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? {
            ...c,
            messages: c.messages.filter(m => !m._id.startsWith('temp-'))
          } : c
        )
      )
      
      // Could show error toast here
      alert('Failed to send message. Please try again.')
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [user])

  // Function to send a message
  const sendMessage = async (receiverId: string, text: string): Promise<Message | null> => {
    if (!user) {
      console.error('[ChatPage] sendMessage: no user')
      return null
    }

    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      senderId: userId,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (socketRef.current && socketRef.current.connected) {
      console.log('[ChatPage] sendMessage via socket', { receiverId, text })
      socketRef.current.emit('sendMessage', { senderId: userId, receiverId, text })
      return tempMessage
    }

    // Fallback to REST call
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('[ChatPage] sendMessage: no token')
        return null
      }

      const response = await fetch(`${API_BASE_URL}/api/messages/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId, text })
      })

      if (!response.ok) {
        const textRes = await response.text()
        throw new Error(`HTTP ${response.status}: ${textRes}`)
      }

      const savedMessage: Message = await response.json()
      console.log('[ChatPage] sendMessage rest success', savedMessage)
      return savedMessage
    } catch (error) {
      console.error('[ChatPage] sendMessage REST error', error)
      return tempMessage
    }
  }

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || !activeConv) return

    const newMessage = await sendMessage(activeConv.otherUserId, inputValue)
    if (newMessage) {
      // Update local state optimistically
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? { ...c, messages: [...c.messages, newMessage] } : c
        )
      )
      setInputValue('')
    }
  }

  return (
    <div className="page">
      <motion.div 
        className="sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="heroTitle heroTitle--tight">Campus Chat</h1>
          <p className="sectionSub">Talk to buyers and sellers in real-time style UI.</p>
        </div>
      </motion.div>

      <motion.div 
        className="chatContainer"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        <div className="chatSidebar">
          <div className="chatSidebarHeader">
            <h2 className="chatSidebarTitle">Conversations</h2>
          </div>
          <div className="chatList">
            {loading ? (
              <div className="loading">Loading conversations...</div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`chatListItem ${activeId === conv.id ? 'chatListItem--active' : ''}`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className="chatListName">{conv.name}</div>
                  <div className="chatListProduct">{conv.product}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chatMain">
          <div className="chatHeader">
            <div className="chatHeaderInfo">
              <h3 className="chatHeaderName">
                {loading ? 'Loading...' : activeConv?.name || 'Select a conversation'}
              </h3>
              <span className="chatHeaderProduct">
                {loading ? '' : activeConv ? `Regarding: ${activeConv.product}` : ''}
              </span>
            </div>
            <div className="chatHeaderActions">
              <div className={`connectionStatus connectionStatus--${connectionStatus}`}>
                <div className="connectionDot"></div>
                <span className="connectionText">{connectionStatus === 'online' ? 'Online' : 'Offline'}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text)' }}>
                <Phone size={20} cursor="pointer" />
                <MoreVertical size={20} cursor="pointer" />
              </div>
            </div>
          </div>

          <div className="chatMessages">
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : activeConv?.messages.length === 0 ? (
              <div className="emptyChat">
                <div className="emptyChatIcon">💬</div>
                <div className="emptyChatText">No messages yet. Start the conversation!</div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {activeConv?.messages.map((msg) => {
                  const isMe = msg.senderId === userId
                  const messageDate = new Date(msg.createdAt)
                  const today = new Date()
                  const isToday = messageDate.toDateString() === today.toDateString()
                  
                  let timestamp
                  if (isToday) {
                    timestamp = messageDate.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  } else {
                    timestamp = messageDate.toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }
                  
                  return (
                    <motion.div
                      key={msg._id}
                      className={`messageWrapper messageWrapper--${isMe ? 'sent' : 'received'} ${msg._id.startsWith('temp-') ? 'messageWrapper--pending' : ''}`}
                      initial={{ opacity: 0, x: isMe ? 20 : -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      layout
                    >
                      <div className={`messageBubble messageBubble--${isMe ? 'sent' : 'received'} ${msg._id.startsWith('temp-') ? 'messageBubble--pending' : ''}`}>
                        {msg.text}
                      </div>
                      <div className="messageTime">
                        {msg._id.startsWith('temp-') ? 'Sending...' : timestamp}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatInputArea">
            <form onSubmit={handleSend} className="chatInputForm">
              <input
                type="text"
                className="chatInput"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e as any)
                  }
                }}
                autoFocus
              />
              <button 
                type="submit" 
                className="chatSendBtn"
                disabled={!inputValue.trim()}
                title={inputValue.trim() ? "Send Message (Enter)" : "Type a message to send"}
              >
                <Send size={18} />
              </button>
            </form>
            <div className="chatInputHint">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
