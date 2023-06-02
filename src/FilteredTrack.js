import React from 'react'

const FilteredTrack = ({fTracks, handlePlayerId}) => {
  return (
    <ul>
        {fTracks.map(track =>(
            <li key = {track.id}>
                <img src={track.album.images[0].url} onClick={() => handlePlayerId(track.id)}/>
                {track.name}

            </li>

        ))}
    </ul>
  )
}

export default FilteredTrack