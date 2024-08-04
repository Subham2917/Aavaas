import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import {  getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserSuccess, updateUserFailure, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
export default function Profile() {
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  console.log(file)

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName =new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );

    
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut = async () =>{
    
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return;
      }
      dispatch(signOutSuccess())
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  }
  const handleShowListing = async () =>{
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingError(true)
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',        
      });
      const data = await res.json();
      if (data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center text-rose-700 my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept = 'image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile photo" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" placeholder='Username' defaultValue={currentUser.username} className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type="text" placeholder='Email' defaultValue={currentUser.email} className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70'>{loading ? "loading...": 'Update'}</button>
        <Link className = 'bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80' to = {'/Create-listing'}>Create listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-rose-800 cursor-pointer font-semibold'>Delete account</span>
        <span onClick={handleSignOut} className='text-rose-800 cursor-pointer font-semibold'>Sign out</span>
      </div>
      <p className='text-green-700 mt-5'>{updateSuccess? 'User is updated Successfully!' : ''}</p>
      <button onClick={handleShowListing} className='w-full bg-blue-500 rounded-lg hover:opacity-80 p-3 max-w-l uppercase text-white font-semibold'>Show listing</button>
      <p className='text-red-700 font-sm'>{showListingError? 'error showing listing' : ''}</p>
      {userListings && userListings.length > 0 && 
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold text-center p-4'>Your Listings</h1>
        { 
         userListings.map((listing) => (
        <div key={listing._id} className='bg-blue-100
          00 border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain' alt="listing cover" />
          </Link>
          <Link to={`/listing/${listing._id}`} className='text-grey-700 font-semibold hover:underline truncate flex-1'>
            <p className=''>{listing.name}</p>
          </Link>
          <div className='flex flex-col items-center'>
            <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase font-semibold'>Delete</button>
            <button className='text-blue-600 uppercase font-semibold'>Edit</button>
          </div>
        </div>))}        
      </div>} 
    </div>
  )
}
