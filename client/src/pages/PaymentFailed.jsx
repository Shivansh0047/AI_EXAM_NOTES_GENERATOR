import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { FaTimesCircle } from "react-icons/fa";
import { getCurrentUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PaymentFalied() {
    const dispatch  = useDispatch()
    const navigate = useNavigate()
    useEffect(()=> { // to navigate user back to home page
        getCurrentUser(dispatch) // update user data

        const t=setTimeout(()=> {navigate("/")},5000) // timeout of 5 sec
        return ()=>clearTimeout(t)
    },[])
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
        <motion.div
        initial={{scale:0,rotate:-100}}
        animate={{scale:1, rotate:360}}
        transition={{duration:0.6, ease:"easeOut"}}
        className='text-red-500 text-6xl'>
            <FaTimesCircle />
        </motion.div>

        <motion.h1
        initial={{opacity:1,y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.3}}
        className='text-2xl font-bold text-red-600'>
            Payment Falied
        </motion.h1>
         <motion.p
         initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.6}}
        className='text-gray-500 text-sm'>
            Redirecting to home...
         </motion.p>
    </div>
  )
}

export default PaymentFalied