import React, { useEffect, useState } from 'react'
import { dummyPostsData } from "../assets/assets.js"
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'
import PostCard from '../components/PostCard.jsx'
import RecentMessages from '../components/RecentMessages.jsx'
  

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])
  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex 
    items-start justify-center xl:gap-8'>

      {/* stories and post list  */}

      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

      </div>

      {/* right side bar  */}

      <div className='max-xl:hidden sticky top-0'>
        {/* <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col 
      gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold '>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />

          <p className='text-slate-600'> Email Marketting </p>
          <p className='text-slate-400'>
            super charge your marketting with a powerfull ,wasy-to use platfrom build for result
          </p>



        </div> */}
 <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-3 shadow'>
  <h3 className='text-slate-800 font-semibold'>Photo of the Day</h3>
  <img
    src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
    alt='Photo of the Day'
    className='w-full h-40 rounded-md object-cover'
  />
  <p className='text-slate-600'>
    Serenity meets motion 🌊 — captured by <span className='text-indigo-600 font-medium'>@oceanlens</span>
  </p>
</div>


 


       <RecentMessages/>
      </div>

    </div>
  ) : < Loading />
}

export default Feed

