import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetchSearch = (trackId, tokenAPI) => {
    const [dataSearch, setDataSearch] = useState([])
    const [fetchErrorSearch, setFetchErrorSearch] = useState(null)
    const [isLoadingSearch, setIsLoadingSearch] = useState(false)

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()
       
        const url = 'https://api.spotify.com/v1/recommendations'
        const config = {
            headers: {Authorization:`Bearer ${tokenAPI}`},
            params: {
                
                limit:20,
                seed_tracks:trackId
                
                
            },
            cancelToken:source.token

        }
        

        const fetchData = async() =>{
            setIsLoadingSearch(true)
            try{
                const response = await axios.get(url, config)
                if(isMounted){
                    setDataSearch(response.data)
                    setFetchErrorSearch(null)
                }
            }catch(err){
                if(isMounted){
                    setFetchErrorSearch(err.message)
                    setDataSearch([])
                    
                }
            }finally{
                isMounted && setIsLoadingSearch(false)
            }
                
            
        }

        fetchData()

        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp
     }, [trackId, tokenAPI])

     return {dataSearch, fetchErrorSearch, isLoadingSearch}


}

export default useAxiosFetchSearch