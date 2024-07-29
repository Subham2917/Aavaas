import React from 'react'
import { useState } from 'react'
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { ref } from 'firebase/storage';



export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    console.log(formData)
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for(let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('image upload failed (2 mb max per image)');
                setUploading(false);
            })
        }else{  
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false);
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName =new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    const handleRemoveImages = (index) =>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a Listing
        </h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border border-green-400 p-3 rounded-lg text-center' id='name' maxLength='60' minLength= '6' required />
                <textarea type="text" placeholder='Description' className='border border-green-400 p-3 rounded-lg text-center' id='description'  required />
                <input type="text" placeholder='Address' className='border border-green-400 p-3 rounded-lg text-center' id='address' required />
                <div className='flex gap-6 flex-wrap font-semibold'>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='Rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='Parking Spot' className='w-5' />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap ">
                    <div className="flex items-center gap-1">
                        <input type="number" id='bedrooms' min= '1' required className='p-3 border border-grey-300 rounded-lg' />
                        <span className='font-semibold text-lg'>Bedroom</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" id='baths' min= '1' required className='p-3 border border-grey-300 rounded-lg' />
                        <span className='font-semibold text-lg'>Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" id='regularPrice' min= '1' required className='p-3 border border-grey-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <span className='font-semibold text-lg'>Regular price</span>
                            <span className='text-xs'>($/Month)</span>                            
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" id='discountPrice' min= '1' required className='p-3 border border-grey-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <span className='font-semibold text-lg'>Discounted Price</span>
                            <span className='text-xs'>($/Month)</span>                        
                        </div>
                    </div>
                </div>
           </div>
           <div className="flex flex-col flex-1 gap-4">
                <p className='font-semibold '>Images:
                <span className='font-normal text-gray-600 ml-2'>The first will be the cover (max 6)</span>
                </p>                          
                <div className='flex gap-4'>
                    <input onChange={(e) =>setFiles(e.target.files)} type="file" id='images' accept='images/*' multiple className='p-3 border border-gray-300 rounded w-full' />
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading? 'Uploading....' : 'Upload'}</button>
                    
                </div>
                <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) =>(
                        <div key={url} className='p-3 flex items-center border justify-between'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounde-lg' />
                            <button type='button' onClick={() => handleRemoveImages(index)} className='p-3 text-rose-800 rounded-xl uppercase hover:opacity-50 font-semibold'>Delete</button>
                        </div>
                    ))
                }           
                <button className='p-3 bg-green-600 text-white font-semibold uppercase rounded-lg hover:opacity-90 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

