import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Public: Submit a contact message
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required',
      });
    }

    const contactMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Message received! We will respond shortly.',
      messageId: contactMessage.id,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

// Admin: Get all messages
export const getMessages = async (req, res) => {
  try {
    const { read } = req.query;
    let filter = {};
    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const messages = await prisma.message.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Admin: Get a single message
export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Mark as read
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      message: { ...message, read: true },
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

// Admin: Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
