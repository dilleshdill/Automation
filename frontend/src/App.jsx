import {React,lazy,Suspense} from 'react'
import './App.css'
import {BrowserRouter as Router,Routes,Route, BrowserRouter} from 'react-router-dom'

const LoginPage = lazy(() => import('./Pages/LoginPage'))
const HomePage = lazy(()=> import('./Pages/HomePage'))
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense>
        <Routes>
          
          <Route path='/login' element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Suspense> 
    </BrowserRouter>

  )
}

export default App