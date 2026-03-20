import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from './src/lib/firebase.js';

async function fixAdmin() {
  try {
    const adminEmail = 'admin@sky-dot-networks.com';
    const adminPassword = 'Admin123!';

    console.log('🔍 Checking admin user...');

    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    console.log('✅ Authenticated as:', user.email);

    const docRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log('📝 Creating admin profile in Firestore...');
      const adminData = {
        uid: user.uid,
        email: adminEmail,
        name: 'System Administrator',
        role: 'ADMIN',
        phone: '+254 700 000 000',
        address: 'Sky Dot Networks HQ, Nairobi',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(docRef, adminData);
      console.log('✅ Admin profile created in Firestore');
    } else {
      console.log('✅ Admin profile already exists in Firestore');
    }

    console.log('🎉 Admin setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAdmin();