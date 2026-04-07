import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
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
  const [activeId, setActiveId] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [inputValue, setInputValue] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userId = user?._id ?? ''

  const API_BASE_URL = 'http://localhost:5000'

  // 🔹 Load conversations
  useEffect(() => {
    const init = async () => {
      const mock: Conversation[] = [
        {
          id: 'c1',
          name: 'Kabir',
          product: 'Mouse',
          otherUserId: '507f1f77bcf86cd799439011',
          messages: []
        }
      ]

      for (let c of mock) {
        const res = await fetch(`${API_BASE_URL}/api/messages/${c.otherUserId}`)
        c.messages = await res.json()
      }

      setConversations(mock)
      setActiveId(mock[0].id)
    }

    init()
  }, [])

  const activeConv = conversations.find(c => c.id === activeId)

  // 🔹 Socket setup
  useEffect(() => {
    if (!user) return

    socketRef.current = io(API_BASE_URL)

    const socket = socketRef.current

    socket.on('connect', () => {
      socket.emit('join', userId)
    })

    socket.on('receiveMessage', (msg: Message) => {
      setConversations(prev =>
        prev.map(c => {
          if (
            (msg.senderId === c.otherUserId && msg.receiverId === userId) ||
            (msg.receiverId === c.otherUserId && msg.senderId === userId)
          ) {
            if (c.messages.some(m => m._id === msg._id)) return c
            return { ...c, messages: [...c.messages, msg] }
          }
          return c
        })
      )
    })

    socket.on('messageSent', (msg: Message) => {
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m._id.startsWith('temp') ? msg : m
                )
              }
            : c
        )
      )
    })

    return () => socket.disconnect()
  }, [user, userId, activeId])

  // 🔹 Send message
  const sendMessage = async (receiverId: string, text: string) => {
    const temp: Message = {
      _id: 'temp-' + Date.now(),
      senderId: userId,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', { senderId: userId, receiverId, text })
      return temp
    }

    // ✅ FIXED endpoint here
    const res = await fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: userId, receiverId, text })
    })

    return await res.json()
  }

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue || !activeConv) return

    const msg = await sendMessage(activeConv.otherUserId, inputValue)

    setConversations(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, msg] }
          : c
      )
    )

    setInputValue('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  return (
    <div className="chatContainer">
      <div className="chatSidebar">
        {conversations.map(c => (
          <div key={c.id} onClick={() => setActiveId(c.id)}>
            {c.name}
          </div>
        ))}
      </div>

      <div className="chatMain">
        <div className="chatMessages">
          <AnimatePresence>
            {activeConv?.messages.map(m => (
              <motion.div key={m._id}>
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button type="submit">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}