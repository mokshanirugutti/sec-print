import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import QrCodeGenerator from "../utils/QRCodeGenerator";
import NavBar from "../components/NavBar";

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { shopName } = useParams<{ shopName: string }>();
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [gettingUser, setGettingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [shopUserId, setShopUserId] = useState<string | null>(null);
  const db = getFirestore();

  // Ensure authentication state persistence
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            setUserId(null);
          }
          setGettingUser(false); // Indicates the user fetching is complete
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  }, []);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (shopName) {
        try {
          const shopDocRef = doc(db, "shops", shopName);
          const shopDoc = await getDoc(shopDocRef);
          if (shopDoc.exists()) {
            const shopData = shopDoc.data();
            setShopUserId(shopData.userId);
          } else {
            setError("Shop not found");
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching shop details:", err);
          setError("Error fetching shop details");
          setLoading(false);
        }
      }
    };

    if (!gettingUser) {
      fetchShopDetails();
      setInterval(fetchShopDetails, 10000);
    }
  }, [gettingUser, shopName, db]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (shopName && userId && shopUserId) {
        if (userId === shopUserId) {
          try {
            const messagesRef = collection(db, "shops", shopName, "messages");
            const querySnapshot = await getDocs(messagesRef);
            const msgs = querySnapshot.docs.map(
              (doc) => doc.data() as { text: string; sender: string }
            );
            setMessages(msgs);
            setError(null); // Clear any previous errors
          } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Error fetching messages");
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError("You are not authorized to view these messages");
        }
      } else if (!shopUserId) {
        setLoading(false);
        setError("Shop details not found");
      }
    };

    if (shopUserId !== null) {
      fetchMessages();
    }
  }, [shopName, userId, shopUserId, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      navigate("/shop/login");
      window.localStorage.removeItem("loggedIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  type Message = {
    sender: string;
    text: string;
  };

  const groupedMessages = (messages: Message[]): Record<string, string[]> => {
    return messages.reduce((acc, message) => {
      if (!acc[message.sender]) {
        acc[message.sender] = [];
      }
      acc[message.sender].push(message.text);
      return acc;
    }, {} as Record<string, string[]>);
  };
  const grouped = groupedMessages(messages);

  const handleDeleteMessage = async (sender: string, text: string) => {
    if (shopName && userId && shopUserId && userId === shopUserId) {
      try {
        const messagesRef = collection(db, 'shops', shopName, 'messages');
        const querySnapshot = await getDocs(messagesRef);

        querySnapshot.forEach(async (doc) => {
          const data = doc.data();
          if (data.sender === sender && data.text === text) {
            await deleteDoc(doc.ref);
            setMessages((prevMessages) =>
              prevMessages.filter((message) => !(message.sender === sender && message.text === text))
            );
          }
        });
      } catch (err) {
        console.error('Error deleting message:', err);
      }
    }
  };

  return (
    <div className="flex flex-col item-center min-w-screen min-h-screen bg-gray-300">
      <NavBar handleLogout={handleLogout} />
      <div className="flex justify-center space-x-5 item-center">
        <h1 className="text-blue-600 text-2xl">Messages for {shopName}</h1>
        <div className="w-100">
          {shopName && <QrCodeGenerator shopName={shopName} />}
        </div>
      </div>
      <div className='w-full'>
        <div className='p-10 border-2 max-w-xs shadow-lg flex flex-col justify-center'>
          {Object.entries(grouped).map(([sender, texts], index) => (
            <div key={index} className="mb-4 border-2 shadow-lg p-6">
              <strong>{sender}:</strong>
              <div className="flex flex-row flex-wrap space-x-2 mt-2">
                {texts.map((text, idx) => (
                  <div key={idx} className="border p-2 rounded flex items-center space-x-2">
                    <p>{text}</p>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteMessage(sender, text)}
                    > Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ShopPage;
