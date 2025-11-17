import express from 'express';
import Chat from '../models/Chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', authenticate, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user._id;
    
    let chat = await Chat.findOne({
      participants: { $all: [userId, receiverId] }
    }).populate('participants', 'profile role');
    
    if (!chat) {
      chat = new Chat({
        participants: [userId, receiverId]
      });
      await chat.save();
      await chat.populate('participants', 'profile role');
    }
    
    res.json({ chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start chat', error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
      .populate('participants', 'profile role')
      .populate('lastMessage.sender', 'profile')
      .sort({ 'lastMessage.timestamp': -1 });
    
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chats', error: error.message });
  }
});

router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'profile')
      .populate('participants', 'profile role');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await chat.markAsRead(req.user._id);
    
    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
});

router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    await chat.addMessage(req.user._id, content);
    await chat.populate('messages.sender', 'profile');
    
    res.json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

export default router;