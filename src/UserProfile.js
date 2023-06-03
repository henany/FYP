import React from 'react'
import { useEffect, useState } from 'react'
import Tracklist from './Tracklist'
import Playlist from './Playlist'
import axios from 'axios';


const UserProfile = ({profile, topTrack, isLoadingUser, fetchErrorUser, token}) => {
    const [userId, setUserId] = useState('')
    const [searchKey, setSearchKey] = useState('')
    const [searchTrack, setSearchTrack] = useState([])
    const [isValidSearch, setIsValidSearch] = useState(true)
    const [playlist, setPlaylist] = useState([])

    const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search'

   

    const fetchData = async() =>{
        try{
            const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            setPlaylist(response.data)
        }catch(err){
            console.log(err.message)
        }
            
        
    }
    
    


    const handleSearchKey = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.get(SEARCH_ENDPOINT,{
                headers:{
                    Authorization:`Bearer ${token}`
                },
                params:{
                    q:searchKey,
                    type:'track'
                }
            })
            setIsValidSearch(true)
            setSearchTrack(response.data.tracks.items)
            setSearchKey('')
        }catch(err){
            setIsValidSearch(false)
            console.log(err.message)
        }
    }

    useEffect(() => {
        if(profile){
            setUserId(profile.id)
        }    
    }, [profile])

    useEffect(() => {

        fetchData()
    },[])

    

  return (
    <div className='profile_container'>
        {isLoadingUser && <p className='loading'>Loading...</p>}
        {!isLoadingUser && fetchErrorUser && <p style={{color:'red'}}>{fetchErrorUser}</p>}
        {!isLoadingUser && !fetchErrorUser && profile.display_name &&
        <div className='profile_container-user'>
            <div>
                <img className='userImage' src={profile.images[0].url} alt='profile img' />
            </div>
            <div className='profile_container-message'>
                <h2>Welcome {profile.display_name}</h2>
                <br></br>
                <ul>
                    <li>Select or search any song</li>
                    <li>Click to explore musical features</li>
                    <li>Find your dream song</li>
                </ul>
            </div>
            
        </div>
        }
        <div className='profile_container-content'>
            <div className='your_toptracks'>
            <h3>Your top 10 tracks: </h3>
               {topTrack.items ? (
                <div className='profile_container-track'>
                    {topTrack.items.map((track, index) => (
                        <Tracklist 
                            track={track}
                            key = {index}
                            userId = {userId}
                        />
                    ))}

                </div>) :(
                <p className='loading'>loading </p>)
                }  
            </div>
            <div className='your_playlists'>
                <h3>Your playlists: </h3>
                {playlist.items ? (
                <div className='profile_container-playlist'>
                    {playlist.items.map((item, index) => (
                        <Playlist
                            playlist = {item}
                            key = {index}
                            userId = {userId}
                            
                        />
                    ))}
                </div>

            ) : (
                <p className='loading'> loading</p>
            )}
            </div>
            <div className="your_search">
                <form onSubmit={handleSearchKey}>
                    <input 
                        type='text'
                        value={searchKey}
                        placeholder='Please search by track name'
                        onChange={e => setSearchKey(e.target.value)}
                    />
                    <button>Search</button>

                </form>
                {
                !isValidSearch&& <p className='invalid_searchKey'>Sorry, song cannot be found <br></br>please try a different one</p>}
                {isValidSearch &&
                searchTrack &&(
                    <ul className='search_track'>
                        {searchTrack.map((track, index) => (
                            <Tracklist 
                                track={track}
                                key = {index}
                                userId = {userId}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
    
  )
}

export default UserProfile