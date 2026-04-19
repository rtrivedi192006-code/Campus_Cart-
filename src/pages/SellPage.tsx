import { useState } from 'react'
import { motion } from 'framer-motion'

function generateDescription(title: string) {
  const clean = title.trim() || 'College item'
  return `Well-maintained ${clean} in excellent working condition. Ideal for students looking for value and reliability. Available for campus pickup and open to quick response chat.`
}

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="page">
      <section className="section">
        <h1 className="heroTitle heroTitle--tight">List an Item</h1>
        <p className="sectionSub">Create a product listing with AI description assistance.</p>

        <motion.div
          className="sellCard"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          <label className="field">
            <span className="fieldLabel">Product Title</span>
            <input
              className="fieldInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Logitech Wireless Mouse"
            />
          </label>

          <div className="aiRow">
            <button
              className="primaryBtn"
              type="button"
              onClick={() => setDescription(generateDescription(title))}
            >
              Generate Description
            </button>
          </div>

          <label className="field">
            <span className="fieldLabel">Description</span>
            <textarea
              className="fieldInput textareaInput"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your generated description will appear here..."
            />
          </label>

          <div className="aiRow">
            <button
              className="primaryBtn primaryBtn--fill"
              type="button"
              disabled={!title.trim() || !description.trim()}
              onClick={() => console.log('Sell item:', { title, description })}
            >
              Sell Item
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

