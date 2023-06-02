import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetchTracks = (dataUrl, tokenAPI) => {
    const [dataTrack, setDataTrack] = useState([])
    const [fetchErrorTrack, setFetchErrorTrack] = useState(null)
    const [isLoadingTrack, setIsLoadingTrack] = useState(false)

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()

        const fetchData = async(url) =>{
            setIsLoadingTrack(true)
            try{
                const response = await axios.get(url, {
                    headers:{
                        Authorization:`Bearer ${tokenAPI}`
                    },
                    cancelToken:source.token
                })
                if(isMounted){
                    setDataTrack(response.data)
                    setFetchErrorTrack(null)
                }
            }catch(err){
                if(isMounted){
                    setFetchErrorTrack(err.message)
                    setDataTrack([])
                    
                }
            }finally{
                isMounted && setIsLoadingTrack(false)
            }
                
            
        }

        fetchData(dataUrl)

        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp
     }, [dataUrl, tokenAPI])

     return {dataTrack, fetchErrorTrack, isLoadingTrack}


}

export default useAxiosFetchTracks