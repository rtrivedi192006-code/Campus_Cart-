import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MoreVertical, Phone } from 'lucide-react'
import './ChatPage.css'

type Message = {
  id: string
  text: string
  sender: 'me' | 'other'
  timestamp: string
}

type Conversation = {
  id: string
  name: string
  product: string
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Kabir',
    product: 'Wireless Mouse (Silent Click)',
    messages: [
      { id: 'm1', text: 'Hey, is the mouse still available?', sender: 'me', timestamp: '10:30 AM' },
      { id: 'm2', text: 'Yes, it is! You can pick it up today at the Main Hostel Lobby.', sender: 'other', timestamp: '10:35 AM' },
      { id: 'm3', text: 'Awesome, can we meet around 5 PM?', sender: 'me', timestamp: '10:36 AM' },
    ],
  },
  {
    id: 'c2',
    name: 'Zoya',
    product: 'Noise-Canceling Headphones',
    messages: [
      { id: 'm1', text: 'Hi Zoya, are the headphones still under warranty?', sender: 'me', timestamp: 'Yesterday' },
      { id: 'm2', text: 'Hey! Yes, they have 3 months of warranty left.', sender: 'other', timestamp: 'Yesterday' },
    ],
  },
]

export default function ChatPage() {
  const [activeId, setActiveId] = useState<string>(mockConversations[0].id)
  const [conversations, setConversations] = useState(mockConversations)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeId)!

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConv.messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setConversations(prev =>
      prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    )
    setInputValue('')
    
    // Simulate auto-reply after 1.5s
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sounds good to me! 🎉',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? { ...c, messages: [...c.messages, replyMessage] } : c
        )
      )
    }, 1500)
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
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`chatListItem ${activeId === conv.id ? 'chatListItem--active' : ''}`}
                onClick={() => setActiveId(conv.id)}
              >
                <div className="chatListName">{conv.name}</div>
                <div className="chatListProduct">{conv.product}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chatMain">
          <div className="chatHeader">
            <div className="chatHeaderInfo">
              <h3 className="chatHeaderName">{activeConv.name}</h3>
              <span className="chatHeaderProduct">Regarding: {activeConv.product}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text)' }}>
              <Phone size={20} cursor="pointer" />
              <MoreVertical size={20} cursor="pointer" />
            </div>
          </div>

          <div className="chatMessages">
            <AnimatePresence initial={false}>
              {activeConv.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`messageWrapper messageWrapper--${msg.sender === 'me' ? 'sent' : 'received'}`}
                  initial={{ opacity: 0, x: msg.sender === 'me' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  layout
                >
                  <div className={`messageBubble messageBubble--${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    {msg.text}
                  </div>
                  <div className="messageTime">{msg.timestamp}</div>
                </motion.div>
              ))}
            </AnimatePresence>
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
              />
              <button 
                type="submit" 
                className="chatSendBtn"
                disabled={!inputValue.trim()}
                title="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
