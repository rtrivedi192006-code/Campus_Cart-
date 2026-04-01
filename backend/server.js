const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5175",
    methods: ["GET", "POST"]
  }
});

// Server should run on port 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:5176',
    'http://localhost:5175',
    'http://localhost:19006' // Expo default
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));


// Basic route
app.get('/', (req, res) => {
  res.send('CampusCart API running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's room for private messaging
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      
      // Save message to database
      const Message = require('./models/Message');
      const message = await Message.create({
        senderId,
        receiverId,
        text
      });

      // Emit to receiver's room
      io.to(receiverId).emit('receiveMessage', message);
      
      // Also emit back to sender for confirmation
      io.to(senderId).emit('messageSent', message);
      
      console.log('Message sent:', message._id);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
