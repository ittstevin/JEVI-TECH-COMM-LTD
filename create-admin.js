import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, firestore } from './src/lib/firebase.js'

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...')

    // Create Firebase Auth user
    const adminEmail = 'admin@sky-dot-networks.com'
    const adminPassword = 'Admin123!'

    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user

    console.log('✅ Firebase Auth user created:', user.email)

    // Create admin profile in Firestore
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
    }

    await setDoc(doc(firestore, 'users', user.uid), adminData)

    console.log('✅ Admin profile created in Firestore')
    console.log('🎉 Admin user setup complete!')
    console.log('📧 Email: admin@sky-dot-networks.com')
    console.log('🔑 Password: Admin123!')
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)

    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists. Skipping creation.')
    }
  }
}

// Run the setup
createAdminUser()
