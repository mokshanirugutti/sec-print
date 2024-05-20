import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';


const ShopProfile: React.FC = () => {
    const { shopName } = useParams<{ shopName: string }>();
    const [shopDetails, setShopDetails] = useState<{ shopName: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const db = getFirestore();

    useEffect(() => {
      const fetchShopDetails = async () => {
          console.log(`shopname : ${shopName}`);
        if (shopName) {
            
          try {
            const q = query(collection(db, 'shops'), where('shopName', '==', shopName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              const data = doc.data();
              setShopDetails({
                shopName: data.shopName,
              });
            } else {
              setError('Shop not found');
            }
          } catch (err) {
            console.error('Error fetching shop details:', err);
            setError('Error fetching shop details');
          } finally {
            setLoading(false);
          }
        }
      };
    fetchShopDetails();

   }, [shopName, db]);

   const handleSendMessage = async (event: React.FormEvent) => {
        console.log("called sender");
        event.preventDefault();
        try {
          if (shopName && newMessage) {
            await addDoc(collection(db, 'shops', shopName, 'messages'), {
              text: newMessage,
              sender: customerName, // Or get the sender's info if logged in
              ownerId: shopName, // Assuming shopName is unique
              createdAt: serverTimestamp(),
            });
            setNewMessage('');
            alert('Message sent successfully');
          }
        } catch (error: any) {
          console.error('Error sending message:', error);
          alert('Error sending message: ' + error.message);
        }
    };

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    return (
      <div className='flex flex-col align-center justify-center min-h-screen'>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-auto  ">
      <h3 className="text-lg font-semibold">Welcome to</h3>
      <h1 className="text-3xl font-bold">{shopDetails?.shopName}</h1>
      <form className="mt-4" onSubmit={handleSendMessage}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name :</label>
          <input
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Message:</label>
          <input
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            type="text"
            placeholder="Enter your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
    );
  };

export default ShopProfile;
