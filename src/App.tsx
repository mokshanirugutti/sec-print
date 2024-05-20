import './App.css'
import { BrowserRouter as Router,Route,Routes  } from 'react-router-dom'
import ShopPage from './shops/ShopPage'
import Home from './Home'
import Singup from './shops/auth/Singup'
import LoginPage from './shops/auth/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import Sender from './customer/Sender'


function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/shop/:shopName' element={<ProtectedRoute element={<ShopPage/>} />}/>
          <Route path='/shop/signup' element={<Singup/>}/>
          <Route path='/shop/login' element={<LoginPage/>}/>
          <Route path='/send/:shopName' element={<Sender/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
