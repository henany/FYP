import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback';
import axios from 'axios';
import { FiX } from "react-icons/fi";



const TrackPlayground = ({topTrack, token ,isLoadingTrack, fetchErrorTrack}) => {
    const location = useLocation()
    const queryParam = new URLSearchParams(location.search)
    const userId = queryParam.get('userId')
   

    const {id} = useParams()
    const [trackFeature, setTrackFeature] = useState([])
    const [thisTrack, setThisTrack] = useState(null)
    const [recommendTrack, setRecommendTrack] = useState([])
    const [searchDanceability, setSearchDanceability] = useState(0.3)
    const [searchAcousticness, setSearchAcousticness] = useState(0.4)
    const [searchEnergy, setSearchEnergy] = useState(0.5)
    const [searchValence, setSearchValence] = useState(0.2)
    const [recommendTrackFeatures, setRecommendTrackFeatures] = useState([])
    const [isFilteringDanceability, setIsFilteringDanceability] = useState(false)
    const [isFilteringAcousticness, setIsFilteringAcousticness] = useState(false)
    const [isFilteringEnergy, setIsFilteringEnergy] = useState(false)
    const [isFilteringValence, setIsFilteringValence] = useState(false)
    const [filteredTrackDanceability, setFilteredTrackDanceability] = useState([])
    const [filteredTrackAcousticness, setFilteredTrackAcousticness] = useState([])
    const [filteredTrackEnergy, setFilteredTrackEnergy] = useState([])
    const [filteredTrackValence, setFilteredTrackValence] = useState([])
    const [playerId, setPlayerId] = useState(id)
    const [popWindowVisible, setPopWindowVisible] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)

    const filterDanceability = useRef(null)
    const filterAcousticness = useRef(null)
    const filterEnergy = useRef(null)
    const filterValence = useRef(null)
    const history = useNavigate()

    useEffect(() => {
        // Store the track ID in sessionStorage
        sessionStorage.setItem('trackId', id);
    
        // Check if the track ID exists in sessionStorage
        const storedTrackId = sessionStorage.getItem('trackId');
      
    
       if(!storedTrackId){
          // Handle the case where the track ID is not found
          // Redirect to an error page or display an error message
          history('/userProfile');
        }else{
            fetchData(`https://api.spotify.com/v1/tracks/${sessionStorage.getItem('trackId')}`, setThisTrack)
            fetchData(`https://api.spotify.com/v1/audio-features/${sessionStorage.getItem('trackId')}`, setTrackFeature)
        }

        // Clean up the stored track ID when the component unmounts
       
      }, [id,history]);

    
    const CREATEPLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${userId}/playlists`

    
    
    const fetchRecommend = async (id) => {
        try{
            const url = 'https://api.spotify.com/v1/recommendations'
            const config = {
            headers: {Authorization:`Bearer ${localStorage.getItem('token')}`},
            params: {
                
                limit:20,
                seed_tracks:id
                
                
                },
            }
            const response = await axios.get(url, config)
            
            setRecommendTrack(response.data.tracks)
            handleRecomTracksID(response.data.tracks)

                
        }catch(err){
                console.log(err.message)
        }
                

    }
    

    const fetchData = async (dataUrl, setFunc) => {
        try{
            const response = await axios.get(dataUrl, {
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            setFunc(response.data)
            

        }catch(err){
            console.log(err.message)

        }
    }

    const handlePlaylist = async (curTrackId) => {

        try{
            const playlistid_local = localStorage.getItem('RecommandedPlaylist')
            // if(playlistid_local){
            //     setPlaylistId(playlistid_local)
            // }
            if(!playlistid_local && userId){
                const response = await axios.post(CREATEPLAYLIST_ENDPOINT,{
                    name: 'Recommand Playlist',
                    description: 'A new playlist you just created',
                    public: true,
                  },
                  {
                    headers: {
                      'Authorization': 'Bearer ' + token
                    }
                  }
                );
               // setPlaylistId(response.data.id); // set the playlist ID in state
                localStorage.setItem('RecommandedPlaylist',response.data.id)
                // console.log('Playlist created:', response.data);
                
                await axios.post(`https://api.spotify.com/v1/playlists/${response.data.id}/tracks`, {
                    uris:[`spotify:track:${curTrackId}`]
                },{
                    headers:{
                        'Authorization': 'Bearer ' + token
                    }
                }
                )

                // console.log('track is added successfully')
                setPopWindowVisible(true)
                let timer = setTimeout(() => {
                    setPopWindowVisible(false)
                    clearTimeout(timer)
                }, 2000)

               
            }else if(playlistid_local && userId){
                // console.log(`playlist is exist and id is:${playlistId}`)
                try{
                    await axios.post(`https://api.spotify.com/v1/playlists/${playlistid_local}/tracks`, {
                        uris:[`spotify:track:${curTrackId}`]
                    },{
                        headers:{
                         'Authorization': 'Bearer ' + token
                        }
                    }
                    )

                    // console.log('track is added successfully')
                    setPopWindowVisible(true)
                    let timer = setTimeout(() => {
                        setPopWindowVisible(false)
                        clearTimeout(timer)
                    }, 3000)

                }catch(err){
                    console.log(err.message)
                }
                

            }

        }catch(err){
            console.log(err.message)

        }
    }

    



    useEffect(() => {
        
        fetchRecommend(sessionStorage.getItem('trackId'), localStorage.getItem('token'))
         
    },[id])

    const handleRefresh = () =>{
        setIsRefresh(true)
        fetchRecommend(sessionStorage.getItem('trackId'), localStorage.getItem('token'))
        setIsRefresh(false)
    }

   

    const handleFilterDanceability = async () => {
        try{
            const danceability = parseFloat(filterDanceability.current.value)
            if(recommendTrackFeatures && recommendTrackFeatures.audio_features && recommendTrack ){
                
                    const filterDance = recommendTrackFeatures.audio_features.filter(   
                        feature => danceability - 0.03 <= feature.danceability &&  feature.danceability <= danceability + 0.03)
                       
                    
                    const filterTrackIds = filterDance.map(feature => feature.id)
                 
                    
                    const filterTrack = recommendTrack.filter(
                        recTrack => filterTrackIds.includes(recTrack.id))
                    setFilteredTrackDanceability(filterTrack)
                    setIsFilteringDanceability(true)
                    // console.log(`filtered Tracks: ${JSON.stringify(filterTrack)}`)  

            }

        }catch(err){
            console.log(err.message)
        }
        
    }

    const handleFilterAcousticness = async () => {
        try{
            const acousticness = parseFloat(filterAcousticness.current.value)

            if(recommendTrackFeatures && recommendTrackFeatures.audio_features && recommendTrack ){
                const filterAcoustic = recommendTrackFeatures.audio_features.filter(   
                    feature => acousticness - 0.03 <= feature.acousticness &&  feature.acousticness <= acousticness + 0.03)
                    
                  
                
                const filterTrackIds = filterAcoustic.map(feature => feature.id)
              
                const filterTrack = recommendTrack.filter(
                    recTrack => filterTrackIds.includes(recTrack.id))
                setFilteredTrackAcousticness(filterTrack)
                setIsFilteringAcousticness(true)
                
            }

        }catch(err){
            console.log(err.message)
        }
        
    }

    const handleFilterEnergy = async () => {
        try{
            const energy = parseFloat(filterEnergy.current.value)

            if(recommendTrackFeatures && recommendTrackFeatures.audio_features && recommendTrack ){
                const filterEner = recommendTrackFeatures.audio_features.filter(   
                    feature => energy - 0.03 <= feature.energy &&  feature.energy <= energy + 0.03)
              
                
                const filterTrackIds = filterEner.map(feature => feature.id)
              
                const filterTrack = recommendTrack.filter(
                    recTrack => filterTrackIds.includes(recTrack.id))
                setFilteredTrackEnergy(filterTrack)
                setIsFilteringEnergy(true)
                
            }

        }catch(err){
            console.log(err.message)
        }
        
    }

    const handleFilterValence = async () => {
        try{
            const valence = parseFloat(filterValence.current.value)

            if(recommendTrackFeatures && recommendTrackFeatures.audio_features && recommendTrack ){
                const filterEner = recommendTrackFeatures.audio_features.filter(   
                    feature => valence - 0.03 <= feature.valence &&  feature.valence <= valence + 0.03)
              
                
                const filterTrackIds = filterEner.map(feature => feature.id)
              
                const filterTrack = recommendTrack.filter(
                    recTrack => filterTrackIds.includes(recTrack.id))
                setFilteredTrackValence(filterTrack)
                setIsFilteringValence(true)
                
            }

        }catch(err){
            console.log(err.message)
        }
        
    }


    const handleIsFilteringDanceability = async () => {
        setIsFilteringDanceability(false)
        filterDanceability.current.value = null
    }

    const handleIsFilteringAcousticness = async () => {
        setIsFilteringAcousticness(false)
        filterAcousticness.current.value = null
    }

    const handleIsFilteringEnergy = async () => {
        setIsFilteringEnergy(false)
        filterEnergy.current.value = null
    }

    const handleIsFilteringValence = async () => {
        setIsFilteringValence(false)
        filterValence.current.value = null
    }


    const handleRecomTracksID = async (recTrack) => {
      
        const trackIds =  await recTrack.map(track => track.id).join(',');
            fetchData(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`,setRecommendTrackFeatures)
       
            
    }

    const handlePlayerId = async (player) => {
        setPlayerId(player)
    }



  return (
    <div className='playground_container'>
        <div className='playground_container-header'>
            {!thisTrack && <p>Loading</p>}
            {thisTrack &&( 
                <div className='playground_container-selectedTrack'>
                    <div className='playground_container-selectedTrack_image'>
                        <img src={thisTrack.album.images[0].url} alt='album img'/>
                    </div>
                    <div className='playground_container-selectedTrack_infor'>
                        <p>{thisTrack.name}</p>
                        <p>{thisTrack.artists[0].name}</p>
                        <ul className='playground_container-selectedTrack-features'>
                            <li>Album: {thisTrack.album.name}</li>
                            <li>Duration: {(trackFeature.duration_ms/60000).toFixed(2)}</li>
                            <li>Acousticness: {trackFeature.acousticness}</li>
                            <li>Danceability: {trackFeature.danceability}</li>
                            <li>Energy: {trackFeature.energy}</li>
                            <li>Valence: {trackFeature.valence}</li>
                            <li className='button_moreTracks'>
                                <button onClick={handleRefresh}>More Recommanded Tracks</button>
                            </li>
                            
                        </ul> 
                    </div>
                    
                   
                </div>
            )}
            <div className='playground_container-player'>
                <div>
                    <SpotifyWebPlayer
                        token = {token}
                        play = {true}
                        hideAttribution = {true}
                        uris = {`spotify:track:${playerId}`}
                        styles={{
                            bgColor:'#0461A5',
                            color:'#021819'
                        }}
                    />
                    <p className='danceability_infor'><span>Danceability:</span> how suitable a track is for dancing, 0.0 is least danceable and 1.0 is most danceable</p>
                    <p className='acousticness_infor'><span>Acousticness:</span> a measure from 0.0 to 1.0 of whether the track is acoustic</p>
                    <p className='energy_infor'><span>Energy:</span> represents a perceptual measure of intensity and activity, high energy means fast, loud, and noisy</p>
                    <p className='valence_infor'><span>Valence:</span> Tracks with high valence sound more positive, low valence sound more negative</p>
                </div>
            </div>
        </div>

        <div>
            {recommendTrack && 
            recommendTrackFeatures &&
            recommendTrackFeatures.audio_features &&
            !isRefresh &&(


            <div className='playground_container-recommendTrack'>
                    {recommendTrack.map(recomTrack =>{
                    const feature = recommendTrackFeatures.audio_features.find(feature => feature.id === recomTrack.id);
                    return (
                        <div key={recomTrack.id} >
                            <div className='recommendTrack-image'>
                                <img src={recomTrack.album.images[0].url} onClick={() => handlePlayerId(recomTrack.id)}/>
                            </div>
                            <div className='recommendTrack-infor'>
                                <p>{recomTrack.name}</p>
                            
                                <p>Album: {recomTrack.album.name}</p>
                                <p>Artist: {recomTrack.artists[0].name}</p>
                                {feature && <p>Duration: {(feature.duration_ms/60000).toFixed(2)}</p>}
                                {feature && <p>Acousticness: {feature.acousticness}</p>}
                                {feature && <p>Danceability: {feature.danceability}</p>}
                                {feature && <p>Energy: {feature.energy}</p>}
                                {feature && <p>Valence: {feature.valence}</p>}
                                
                                <button className='button_add' onClick={() => handlePlaylist(recomTrack.id)}>Add</button>
                            </div>

                        </div>
                    )})}

                    
            </div>
           
            
                
            )}

            
        </div> 

        <div className='playground_container-filterTrack'>
            <p>Search by Danceability</p>
            <div className='filterTrack-track'>

            
                <div className='filterTrack-search'>
                    <div className='filterTrack-search_input'>
                        <form className='form_filter' onSubmit={e => e.preventDefault()}>
                            <label>0</label>
                            <input
                                type='range' 
                                min='0'
                                max='1'
                                step='0.01'
                                ref = {filterDanceability}
                                value={searchDanceability}
                                onChange={e => setSearchDanceability(e.target.value)}
                            ></input>
                            <i className='filter_value'>{searchDanceability}</i>
                            <label>1</label>
                        </form>
                    </div>
                    <div className='button_addFilter'>
                        <button onClick={handleFilterDanceability} >Add Filter</button>
                    </div>
                    <div className='button_removeFilter'>
                        <button onClick={handleIsFilteringDanceability} >Remove Filter</button>
                    </div>
                </div>
            
                {!isFilteringDanceability && <div className='filterTrack-empty'>Please add filter</div>}
                {!recommendTrack && <p>Loading...</p>}
                {isFilteringDanceability && !filteredTrackDanceability && <p>Loading...</p>}
                {isFilteringDanceability && !filteredTrackDanceability.length && <p className='invalidFilter_message'>Please toggle danceability and try again</p>}
                {isFilteringDanceability && 
                filteredTrackDanceability &&
                recommendTrackFeatures.audio_features&&(
                <div className='filterTrack-result'>
                        {filteredTrackDanceability.map(recomTrack => {
                            const feature = recommendTrackFeatures.audio_features.find(feature => feature.id === recomTrack.id)
                            return(
                                <div key={recomTrack.id}>
                                    <div className='filterTrack-image'>
                                         <img src={recomTrack.album.images[0].url} onClick={() => handlePlayerId(recomTrack.id)}/>
                                    </div>
                                    <div className='filterTrack-infor'>
                                        <p>{recomTrack.name}</p>
                                        <p>Album: {recomTrack.album.name}</p>
                                        <p>Artist: {recomTrack.artists[0].name}</p>
                                        {feature && <p>Duration: {(feature.duration_ms/60000).toFixed(2)}</p>}
                                        {feature && <p>Acousticness: {feature.acousticness}</p>}
                                        {feature && <p>Danceability: {feature.danceability}</p>}
                                        {feature && <p>Energy: {feature.energy}</p>}
                                        {feature && <p>Valence: {feature.valence}</p>}
                                        <button className='button_add' onClick={() => handlePlaylist(recomTrack.id)}>Add</button>
                                    </div>
                            </div>
                        )})}
 

                </div>
                
            
                )}
            </div>
        </div>
            

        <div className='playground_container-filterTrack'>
            <p>Search by Acousticness</p>
            <div className='filterTrack-track'>

            <div className='filterTrack-search'>
                    <div className='filterTrack-search_input'>
                        <form className='form_filter' onSubmit={e => e.preventDefault()}>
                            <label>0</label>
                            <input
                                type='range' 
                                min='0'
                                max='1'
                                step='0.01'
                                ref = {filterAcousticness}
                                value={searchAcousticness}
                                onChange={e => setSearchAcousticness(e.target.value)}
                            ></input>
                            <i className='filter_value'>{searchAcousticness}</i>
                            <label>1</label>
                        </form>
                    </div>
                    <div className='button_addFilter'>
                        <button onClick={handleFilterAcousticness} >Add Filter</button>
                    </div>
                    <div className='button_removeFilter'>
                        <button onClick={handleIsFilteringAcousticness} >Remove Filter</button>
                    </div>
                </div>

            {!isFilteringAcousticness && <div className='filterTrack-empty'>Please add filter</div>}
            {isFilteringAcousticness && !filteredTrackAcousticness && <p>Loading...</p>}
            {isFilteringAcousticness && !filteredTrackAcousticness.length && <p className='invalidFilter_message'>Please acousticness and try again</p>}
            {isFilteringAcousticness && 
             filteredTrackAcousticness &&(
            <div className='filterTrack-result'>
                {filteredTrackAcousticness.map(recomTrack => {
                        const feature = recommendTrackFeatures.audio_features.find(feature => feature.id === recomTrack.id)
                        return(
                            <div key={recomTrack.id}>
                               <div className='filterTrack-image'>
                                         <img src={recomTrack.album.images[0].url} onClick={() => handlePlayerId(recomTrack.id)}/>
                                    </div>
                                    <div className='filterTrack-infor'>
                                        <p>{recomTrack.name}</p>
                                        <p>Album: {recomTrack.album.name}</p>
                                        <p>Artist: {recomTrack.artists[0].name}</p>
                                        {feature && <p>Duration: {(feature.duration_ms/60000).toFixed(2)}</p>}
                                        {feature && <p>Acousticness: {feature.acousticness}</p>}
                                        {feature && <p>Danceability: {feature.danceability}</p>}
                                        {feature && <p>Energy: {feature.energy}</p>}
                                        {feature && <p>Valence: {feature.valence}</p>}
                                        <button className='button_add' onClick={() => handlePlaylist(recomTrack.id)}>Add</button>
                                    </div>
                            </div>
                        )
                    }
                )}
               
            </div>

            )}
            </div>

        </div>

        <div className='playground_container-filterTrack'>
            <p>Search by Energy</p>
            <div className='filterTrack-track'>
                <div className='filterTrack-search'>
                        <div className='filterTrack-search_input'>
                            <form className='form_filter' onSubmit={e => e.preventDefault()}>
                                <label>0</label>
                                <input
                                    type='range' 
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    ref = {filterEnergy}
                                    value={searchEnergy}
                                    onChange={e => setSearchEnergy(e.target.value)}
                                ></input>
                                <i className='filter_value'>{searchEnergy}</i>
                                <label>1</label>
                            </form>
                        </div>
                        <div className='button_addFilter'>
                            <button onClick={handleFilterEnergy} >Add Filter</button>
                        </div>
                        <div className='button_removeFilter'>
                            <button onClick={handleIsFilteringEnergy} >Remove Filter</button>
                        </div>
                </div>


            {!isFilteringEnergy && <div className='filterTrack-empty'>Please add filter</div>}
            {isFilteringEnergy && !filteredTrackEnergy && <p>Loading...</p>}
            {isFilteringEnergy && !filteredTrackEnergy.length && <p className='invalidFilter_message'>Please toggle engery and try again</p>}
            {isFilteringEnergy && 
            filteredTrackEnergy &&(
            <div className='filterTrack-result'>
                {filteredTrackEnergy.map(recomTrack => {
                    const feature = recommendTrackFeatures.audio_features.find(feature => feature.id === recomTrack.id)
                return(
                    <div key={recomTrack.id}>
                                    <div className='filterTrack-image'>
                                         <img src={recomTrack.album.images[0].url} onClick={() => handlePlayerId(recomTrack.id)}/>
                                    </div>
                                    <div className='filterTrack-infor'>
                                        <p>{recomTrack.name}</p>
                                        <p>Album: {recomTrack.album.name}</p>
                                        <p>Artist: {recomTrack.artists[0].name}</p>
                                        {feature && <p>Duration: {(feature.duration_ms/60000).toFixed(2)}</p>}
                                        {feature && <p>Acousticness: {feature.acousticness}</p>}
                                        {feature && <p>Danceability: {feature.danceability}</p>}
                                        {feature && <p>Energy: {feature.energy}</p>}
                                        {feature && <p>Valence: {feature.valence}</p>}
                                        <button className='button_add' onClick={() => handlePlaylist(recomTrack.id)}>Add</button>
                                    </div>
                            </div>
                )})}
               
            </div>

            )}
            </div>
        </div>

        <div className='playground_container-filterTrack'>
            <p>Search by Valence</p>
            <div className='filterTrack-track'>

                <div className='filterTrack-search'>
                        <div className='filterTrack-search_input'>
                            <form className='form_filter' onSubmit={e => e.preventDefault()}>
                                <label>0</label>
                                <input
                                    type='range' 
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    ref = {filterValence}
                                    value={searchValence}
                                    onChange={e => setSearchValence(e.target.value)}
                                ></input>
                                <i className='filter_value'>{searchValence}</i>
                                <label>1</label>

                                
                            </form>
                        </div>
                        <div className='button_addFilter'>
                            <button onClick={handleFilterValence} >Add Filter</button>
                        </div>
                        <div className='button_removeFilter'>
                            <button onClick={handleIsFilteringValence} >Remove Filter</button>
                        </div>
                </div>
            {!isFilteringValence && <div className='filterTrack-empty'>Please add filter</div>}
            {isFilteringValence && !filteredTrackValence && <p>Loading...</p>}
            {isFilteringValence && !filteredTrackValence.length && <p className='invalidFilter_message'>Please toggle valence and try again</p>}
            {isFilteringValence &&
            filteredTrackValence &&(

            <div className='filterTrack-result'>
                {filteredTrackValence.map(recomTrack => {
                    const feature = recommendTrackFeatures.audio_features.find(feature => feature.id === recomTrack.id)
                return(
                    <div key={recomTrack.id}>
                    <div className='filterTrack-image'>
                              <img src={recomTrack.album.images[0].url} onClick={() => handlePlayerId(recomTrack.id)}/>
                         </div>
                         <div className='filterTrack-infor'>
                             <p>{recomTrack.name}</p>
                             <p>Album: {recomTrack.album.name}</p>
                             <p>Artist: {recomTrack.artists[0].name}</p>
                             {feature && <p>Duration: {(feature.duration_ms/60000).toFixed(2)}</p>}
                             {feature && <p>Acousticness: {feature.acousticness}</p>}
                             {feature && <p>Danceability: {feature.danceability}</p>}
                             {feature && <p>Energy: {feature.energy}</p>}
                             {feature && <p>Valence: {feature.valence}</p>}
                             <button className='button_add' onClick={() => handlePlaylist(recomTrack.id)}>Add</button>
                         </div>
                 </div>
                )})}
               
            </div>

            )}
            </div>
        </div>
        {popWindowVisible && 
        <div className="confirm_message">
            <div>
                <i><FiX className='confirm_message_icon'/></i>
            </div>
            <h4>Success!</h4>
            You have added the song
        </div>

        }
        

    </div>
   
         
       
        
  
    
  )
}

export default TrackPlayground