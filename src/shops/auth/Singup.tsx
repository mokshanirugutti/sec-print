import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add shop details to Firestore
      await setDoc(doc(db, 'shops', shopName), {
        shopName: shopName,
        email: email,
        userId: user.uid,
      });

      navigate('/shop/login');
    } catch (error:any) {
      console.error('Error signing up:', error);
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <>
    <div className='flex flex-col items-center justify-center min-h-screen p-10 bg-zinc-700'>
      <h1 className="text-cyan-400 mb-4" >Sign up </h1>
    <form onSubmit={handleSignUp} className='flex flex-col '>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
      />
      <input
        type="text"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        placeholder="Shop Name"
        required
        className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
      />
      <button 
      type="submit"
      className="w-full max-w-xs bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"> Sign Up</button>
    </form>
    </div>
    </>
  );
};

export default SignUpPage;
