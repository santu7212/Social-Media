import React, { useEffect, useState } from 'react'
import { dummyPostsData} from "../assets/assets.js"
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'

const Feed = () => {

  const [feed,setFeeds]=useState([])
  const [loading,setLoading]=useState(true)

  const fetchFeeds=async()=>{
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])
  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex 
    items-start justify-center xl:gap-8'>

    {/* stories and post list  */}

    <div>
       <StoriesBar/>
      <div className='p-4 space-y-6'>
        List of post 
      </div>

    </div>

    {/* right side bar  */}

    <div>
      <div>
        <h1>Sponsored</h1>

      </div>

      <h1>Recent messages </h1>

    </div>
      
    </div>
  ): < Loading/>
}

export default Feed

