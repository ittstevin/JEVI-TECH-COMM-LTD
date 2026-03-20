import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from './src/lib/firebase.js';

async function populateTestData() {
  try {
    console.log('🔍 Authenticating admin...');

    const adminEmail = 'admin@sky-dot-networks.com';
    const adminPassword = 'Admin123!';

    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('✅ Authenticated as admin');

    console.log('🌱 Populating test data...');

    // Add test users
    const usersRef = collection(firestore, 'users');
    await addDoc(usersRef, {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'CUSTOMER',
      phone: '+254 700 123 456',
      verified: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await addDoc(usersRef, {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'CUSTOMER',
      phone: '+254 711 987 654',
      verified: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Add test subscriptions
    const subsRef = collection(firestore, 'subscriptions');
    await addDoc(subsRef, {
      userId: 'test-user-1',
      planId: 'standard',
      status: 'ACTIVE',
      renewalDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      createdAt: Timestamp.now(),
    });

    // Add test tickets
    const ticketsRef = collection(firestore, 'tickets');
    await addDoc(ticketsRef, {
      userId: 'test-user-1',
      subject: 'Internet connection issue',
      description: 'My internet is very slow during peak hours',
      status: 'OPEN',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Add test messages
    const messagesRef = collection(firestore, 'messages');
    await addDoc(messagesRef, {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+254 722 555 123',
      subject: 'Installation inquiry',
      message: 'I would like to know about installation costs for my area.',
      status: 'NEW',
      createdAt: Timestamp.now(),
    });

    // Add test testimonials
    const testimonialsRef = collection(firestore, 'testimonials');
    await addDoc(testimonialsRef, {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      message: 'Excellent service! Fast installation and reliable connection.',
      approved: true,
      createdAt: Timestamp.now(),
    });

    // Add service status
    const statusRef = collection(firestore, 'serviceStatus');
    await addDoc(statusRef, {
      name: 'Core network',
      status: 'ok',
      note: 'All systems operational',
    });

    await addDoc(statusRef, {
      name: 'Wi-Fi provisioning',
      status: 'ok',
      note: 'Service running normally',
    });

    console.log('✅ Test data populated successfully!');
  } catch (error) {
    console.error('❌ Error populating test data:', error.message);
  }
}

populateTestData();