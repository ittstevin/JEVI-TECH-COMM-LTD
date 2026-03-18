import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User: Submit a testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        userId,
        message,
        rating: rating ? Math.min(Math.max(rating, 1), 5) : null,
        approved: false, // Requires admin approval
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted! Pending admin approval.',
      testimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
};

// Public: Get approved testimonials
export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Admin: Get all testimonials (pending and approved)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Admin: Approve a testimonial
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Testimonial approved',
      testimonial,
    });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ error: 'Failed to approve testimonial' });
  }
};

// Admin: Delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted',
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
