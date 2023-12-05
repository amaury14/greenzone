import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

import './globals.css';
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { Home } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import Rootlayout from './_root/RootLayout'


const App = () => {
  return (
    <main className="flex h-screen">
         <Routes>
            {/* public routes */}
            <Route element={<AuthLayout />}>
                <Route path="/sing-in" element={<SigninForm />} />
                <Route path="/sing-up" element={<SignupForm />} />
            </Route>

            {/* private routes */}
            <Route element={<Rootlayout />}>
                <Route index element={<Home />}/>
            </Route>            
         </Routes>

         <Toaster />
    </main>
  )
}

export default App