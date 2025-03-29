import React from "react";
const RandomArt = ({ art, onBanTopic, onError }) => {
    if (!art) {
        return;
    }
    // if (!art.image_id) {
    //     onError();
    //     return;
    // }
    return (
         <div className="art-display">
            <h2>{art.title}</h2>
            <p>{art.artist_title}</p>
            <p>{art.date_display}</p>
            <button className="ban-button" onClick={() => onBanTopic(art.medium_display.split(/[,;]/)[0])}>
                {art.medium_display.split(/[,;]/)[0]}
            </button>
            <button className="ban-button" onClick={() => onBanTopic(art.place_of_origin)}>
                {art.place_of_origin}
            </button>
            <button className="ban-button" onClick={() => onBanTopic(art.artwork_type_title)}>
                {art.artwork_type_title}
            </button>
            <br></br>
            <img
                src={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                alt={art.title}
                onError = {onError}
            />
        </div>
    )
    
};
export default RandomArt;