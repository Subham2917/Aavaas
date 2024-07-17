import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7 text-rose-600'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button className='p-3 bg-slate-700 rounded-lg text-white hover:opacity-90 disabled:opacity-70'>SIGN UP</button>
      </form>
      <div className="flex gap-2 mt-5 font-semibold">
        <p>Have an account?</p>
        <Link to='/sign-in'><span className='text-blue-700'>Sign in</span></Link>
      </div>
    </div>
  )
}
