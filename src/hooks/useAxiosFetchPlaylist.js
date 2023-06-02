import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetchPlaylist = (dataUrl, tokenAPI) => {
    const [dataPlaylist, setDataPlaylist] = useState([])
    const [fetchErrorPlaylist, setFetchErrorPlaylist] = useState(null)
    const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false)

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()
        

        const fetchData = async(url) =>{
            setIsLoadingPlaylist(true)
            try{
                const response = await axios.get(url, {
                    headers:{
                        Authorization:`Bearer ${tokenAPI}`
                    },
                    cancelToken:source.token
                })
                if(isMounted){
                    setDataPlaylist(response.data)
                    setFetchErrorPlaylist(null)
                }
            }catch(err){
                if(isMounted){
                    setFetchErrorPlaylist(err.message)
                    setDataPlaylist([])
                    
                }
            }finally{
                isMounted && setIsLoadingPlaylist(false)
            }
                
            
        }

        fetchData(dataUrl)

        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp
     }, [dataUrl, tokenAPI])

     return {dataPlaylist, fetchErrorPlaylist, isLoadingPlaylist}


}

export default useAxiosFetchPlaylist