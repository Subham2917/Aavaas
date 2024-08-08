import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
export default function ListingItem({listing}) {
  return (
    <div className='bg-yellow-600 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]} alt='listing cover' className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'></img>
        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='text-lg text-white font-semibold truncate'>{listing.name}</p>
            <div className="flex items-center gap-1">
                <MdLocationOn className='h-4 w-4 text-green-700' />
                <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
            </div> 
            <p className='text-sm text-gray-600 line-clamp-2 '>{listing.description}</p>
            <p className='text-slate-500 mt-2 font-semibold'>
                ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && '/month'}
            </p> 
            <div className="flex text-gray-600 gap-4 font-bold text-xs ">
                <p className='gap-2'>{listing.bedrooms === 1 ? `${listing.bedrooms} Bed`: `${listing.bedrooms} Beds`}</p>
                <p className='gap-2'>{listing.bathrooms} Bath</p>
                <p className=''>{listing.furnished === true ? `Furnished` : 'Unfurnished'}</p>
                <p>{listing.parking === true ? 'Parking for 1' : 'Noparking'}</p>                
            </div>           
        </div>
      </Link>
    </div>
  )
}
