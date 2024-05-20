import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const ShopProfile: React.FC = () => {
    const { shopName } = useParams<{ shopName: string }>();
    const [shopDetails, setShopDetails] = useState<{ shopName: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
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
              sender: 'Anonymous', // Or get the sender's info if logged in
              ownerId: shopName, // Assuming shopName is unique
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
      <div>
        <h3>welcome to </h3>
        <h1>{shopDetails?.shopName}</h1>
        <form onSubmit={handleSendMessage}>
          <label>Message:</label>
          <input
            type="text"
            placeholder="enter your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };

export default ShopProfile;
