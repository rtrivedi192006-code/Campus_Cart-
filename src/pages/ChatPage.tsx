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

  // ✅ FIX: unified backend URL
  const API_BASE_URL = 'http://localhost:5000'

  const fetchMessages = async (otherUserId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return []

      const response = await fetch(`${API_BASE_URL}/api/messages/${otherUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error()

      return await response.json()
    } catch (error) {
      console.error('fetchMessages error', error)
      return []
    }
  }

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)

      const mockConversations: Conversation[] = [
        {
          id: 'c1',
          name: 'Kabir',
          product: 'Wireless Mouse (Silent Click)',
          otherUserId: '507f1f77bcf86cd799439011',
          messages: []
        },
        {
          id: 'c2',
          name: 'Zoya',
          product: 'Noise-Canceling Headphones',
          otherUserId: '507f1f77bcf86cd799439012',
          messages: []
        },
      ]

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConv?.messages])

  // ✅ SOCKET SETUP (FIXED)
  useEffect(() => {
    if (!user) return

    socketRef.current = io(API_BASE_URL, {
      transports: ['websocket'],
      withCredentials: true
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Connected')
      setConnectionStatus('online')
      socket.emit('join', userId)
    })

    socket.on('disconnect', () => {
      setConnectionStatus('offline')
    })

    // ✅ FIX: prevent duplicate messages
    socket.on('receiveMessage', (message: Message) => {
      setConversations(prev =>
        prev.map(c => {
          if (
            (message.senderId === c.otherUserId && message.receiverId === userId) ||
            (message.receiverId === c.otherUserId && message.senderId === userId)
          ) {
            const exists = c.messages.some(m => m._id === message._id)
            if (exists) return c

            return { ...c, messages: [...c.messages, message] }
          }
          return c
        })
      )
    })

    socket.on('messageSent', (message: Message) => {
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m._id.startsWith('temp-') && m.text === message.text
                    ? message
                    : m
                ),
              }
            : c
        )
      )
    })

    socket.on('messageError', () => {
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.filter(m => !m._id.startsWith('temp-')),
              }
            : c
        )
      )

      alert('Failed to send message')
    })

    return () => {
      socket.disconnect()
    }
  }, [user, userId, activeId])

  const sendMessage = async (receiverId: string, text: string): Promise<Message | null> => {
    if (!user) return null

    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      senderId: userId,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', { senderId: userId, receiverId, text })
      return tempMessage
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) return null

      const res = await fetch(`${API_BASE_URL}/api/messages/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId, text })
      })

      if (!res.ok) throw new Error()

      return await res.json()
    } catch {
      return tempMessage
    }
  }

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || !activeConv) return

    const newMessage = await sendMessage(activeConv.otherUserId, inputValue)

    if (newMessage) {
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, newMessage] }
            : c
        )
      )
      setInputValue('')
    }
  }

  return (
    <div className="page">
      <motion.div className="sectionHeader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div>
          <h1 className="heroTitle heroTitle--tight">Campus Chat</h1>
          <p className="sectionSub">Talk to buyers and sellers in real-time style UI.</p>
        </div>
      </motion.div>

      <div className="chatContainer">
        <div className="chatSidebar">
          <div className="chatSidebarHeader">
            <h2>Conversations</h2>
          </div>

          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`chatListItem ${activeId === conv.id ? 'chatListItem--active' : ''}`}
              onClick={() => setActiveId(conv.id)}
            >
              <div>{conv.name}</div>
              <div>{conv.product}</div>
            </div>
          ))}
        </div>

        <div className="chatMain">
          <div className="chatHeader">
            <h3>{activeConv?.name}</h3>
            <span>{connectionStatus}</span>
          </div>

          <div className="chatMessages">
            <AnimatePresence>
              {activeConv?.messages.map(msg => {
                const isMe = msg.senderId === userId
                return (
                  <motion.div key={msg._id} className={isMe ? 'sent' : 'received'}>
                    {msg.text}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatInputForm">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type message..."
            />
            <button type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}