import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch shop name associated with the user
      const shopsRef = collection(db, 'shops');
      const q = query(shopsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const shopDoc = querySnapshot.docs[0];
        const shopName = shopDoc.id; 
        window.localStorage.setItem("loggedIn","True");
        navigate(`/shop/${shopName}`);
      } else {
        setError('No shop found for this user.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in. Please check your email and password.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-10 bg-zinc-700'>
      <h1 className="text-cyan-400 mb-4">Login</h1>
  
      <form onSubmit={handleLogin} className="flex flex-col items-center">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <button type="submit" className="w-full max-w-xs bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Log In
        </button>
        <p className="text-sm text-slate-100 mt-2">
          Don't have an account? <Link to="/shop/signup">Sign up</Link>
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}

      </form>
    </div>
  );
  
};

export default LoginPage;
