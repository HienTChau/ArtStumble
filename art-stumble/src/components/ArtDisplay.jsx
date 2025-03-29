import React, { useState, useEffect } from 'react';
import RandomArt from './RandomArt'; // Ensure this path is correct

const ArtDisplay = () => {
    const [currentPage, setPage] = useState(1);
    const [currentIndex, setIndex] = useState(0);
    const [maxPages, setMaxPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [randomArt, setRandomArt] = useState(null);
    const [bannedTopics, setBannedTopics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching initial data...");
                const response = await fetch('https://api.artic.edu/api/v1/artworks');
                const data = await response.json();

                const items = data.pagination.limit;
                const totalPages = data.pagination.total_pages;

                setMaxPages(totalPages);
                setItemsPerPage(items);

                console.log("Initial data fetched:", { items, totalPages });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleRandomize = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault(); // Prevent default behavior only if `e` is an event
        }
        const randomPage = Math.floor(Math.random() * maxPages) + 1;
        const randomItem = Math.floor(Math.random() * (itemsPerPage - 1));

        console.log("Randomizing artwork:", { randomPage, randomItem });

        setPage(randomPage);
        setIndex(randomItem);

        await fetchRandomArt(randomPage, randomItem);
    };

    const fetchRandomArt = async (page, index) => {
        try {
            console.log("Fetching random artwork:", { page, index });
            const response = await fetch(
                `https://api.artic.edu/api/v1/artworks?page=${page}&fields=title,date_display,artist_title,place_of_origin,medium_display,artwork_type_title,image_id`
            );
            const data = await response.json();

            if (data && data.data && data.data[index]) {
                const art = data.data[index];
                console.log("Fetched artwork:", art);

                // Check if the artwork matches any banned topics
                if (
                    bannedTopics.includes(art.artist_title) ||
                    bannedTopics.includes(art.medium_display.split(/[,;]/)[0]) ||
                    bannedTopics.includes(art.place_of_origin) ||
                    bannedTopics.includes(art.artwork_type_title)
                ) {
                    console.warn('Artwork matches a banned topic. Fetching another...');
                    handleRandomize(); // Fetch another random artwork
                } else {
                    setRandomArt(art); // Set the random artwork data
                }
            } else {
                console.error('No artwork found at the specified index. Fetching another...');
                // handleRandomize(); // Fetch another random artwork
            }
        } catch (error) {
            console.error('Error fetching random artwork:', error);
            // handleRandomize();
        }
    };

    const handleBanTopic = (topic) => {
        console.log("Banning topic:", topic);
        setBannedTopics((preTopics) => {
            if (!preTopics.includes(topic)) {
                return [...preTopics, topic];
            }
            return preTopics;
        });
    };

    const handleUnBanTopic = (topic) => {
        console.log("Unbanning topic:", topic);
        setBannedTopics((preTopics) => preTopics.filter((t) => t !== topic));
    };

    return (
        <div className="art-display-container">
            {/* Left Section: Random Art */}
            <div className="art-section">
                <RandomArt art={randomArt} onBanTopic={handleBanTopic} onError={handleRandomize} />
                <button className="random-button" onClick={handleRandomize}>
                    Randomize Artwork
                </button>
            </div>

            {/* Right Section: Banned Topics */}
            <div className="banned-topics-section">
                <h3>Banned Topics:</h3>
                <div className="banned-topic-list">
                    {bannedTopics.map((topic, index) => (
                        <button
                            key={index}
                            className="banned-topic-button"
                            onClick={() => handleUnBanTopic(topic)}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtDisplay;