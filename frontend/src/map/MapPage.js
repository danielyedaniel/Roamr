import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [styleIndex, setStyleIndex] = useState(0);

    const styles = [
        'mapbox://styles/mapbox/streets-v12',
        'mapbox://styles/mapbox/dark-v10',
        'mapbox://styles/mapbox/satellite-v9',
        'mapbox://styles/mapbox/satellite-streets-v11'
    ];

    const addCustomMarkerAndPoints = (map, data) => {
        console.log('Adding custom markers and points');

        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            (error, image) => {
                if (error) {
                    console.error('Error loading marker image:', error);
                    return;
                }
                if (!map.hasImage('custom-marker')) {
                    map.addImage('custom-marker', image);
                }

                const features = data.filter(location => {
                    if (!location || location.longitude == null || location.latitude == null) {
                        console.warn('Invalid location data:', location);
                        return false;
                    }
                    return true;
                }).map(location => {
                    console.log('Creating feature for location:', location);

                    // Parse posts if it's a string
                    let posts = location.posts;
                    if (typeof posts === 'string') {
                        try {
                            posts = JSON.parse(posts);
                        } catch (error) {
                            console.error('Error parsing posts:', error);
                            posts = [];
                        }
                    }

                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)]
                        },
                        properties: {
                            title: Array.isArray(posts) ? posts[0].username : (location.location_id ? location.location_id.toString() : 'Unknown'),
                            posts: Array.isArray(posts) ? JSON.stringify(posts) : []
                        }
                    };
                });

                console.log('Created features:', features);

                if (map.getSource('points')) {
                    console.log('Updating existing source');
                    map.getSource('points').setData({
                        type: 'FeatureCollection',
                        features
                    });
                } else {
                    console.log('Adding new source and layer');
                    map.addSource('points', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features
                        }
                    });

                    map.addLayer({
                        id: 'points',
                        type: 'symbol',
                        source: 'points',
                        layout: {
                            'icon-image': 'custom-marker',
                            'text-field': ['get', 'title'],
                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                    });

                    // Add click event listener
                    map.on('click', 'points', handleClick);
                }
            }
        );
    };


    const fetchLocations = async () => {
        try {
            const response = await fetch(`http://localhost:8000/postlocation?user_id=${localStorage.getItem("user_id")}`);
            const data = await response.json();

            console.log('Fetched data:', JSON.stringify(data, null, 2));

            data.forEach((location, index) => {
                console.log(`Location ${index}:`, {
                    location_id: location.location_id,
                    country: location.country,
                    city: location.city,
                    latitude: location.latitude,
                    longitude: location.longitude
                });
            });

            mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGNzMzQ4IiwiYSI6ImNseXpkYXdtcDJoeDcyanB1NnEyN252ejkifQ.KFDQShkH-emDn4Iz77W2jQ';

            if (mapRef.current) {
                mapRef.current.remove();
            }

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: styles[styleIndex],
                center: [-96, 37.8],
                zoom: 3,
                projection: 'globe'
            });

            mapRef.current.on('style.load', () => {
                console.log('Map style loaded');
                mapRef.current.setFog({});
                addCustomMarkerAndPoints(mapRef.current, data);
            });

            mapRef.current.on('load', () => {
                console.log('Map fully loaded');
            });

            // Add right-click event listener
            mapRef.current.on('contextmenu', handleRightClick);

            // Change cursor on hover
            mapRef.current.on('mouseenter', 'points', () => {
                mapRef.current.getCanvas().style.cursor = 'pointer';
            });
            mapRef.current.on('mouseleave', 'points', () => {
                mapRef.current.getCanvas().style.cursor = '';
            });
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };
    const handleClick = (e) => {
        const coordinates = e.lngLat;
        const properties = e.features[0].properties;

        if (properties.posts && properties.posts.length > 0) {
            const firstPost = JSON.parse(properties.posts)[0];

            const popupContent = document.createElement('div');
            popupContent.style.maxHeight = '300px';
            popupContent.style.overflowY = 'auto';
            popupContent.style.padding = '10px';
            popupContent.style.backgroundColor = '#ffffff';
            popupContent.style.borderRadius = '8px';
            popupContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

            if (firstPost.image) {
                const img = document.createElement('img');
                img.src = `data:image/jpeg;base64,${firstPost.image}`;
                img.alt = 'Post Image';
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '4px';
                img.style.marginBottom = '10px';
                popupContent.appendChild(img);
            } else {
                const noImageText = document.createElement('p');
                noImageText.textContent = 'No image available';
                noImageText.style.color = '#999';
                popupContent.appendChild(noImageText);
            }

            if (firstPost.description) {
                const descriptionText = document.createElement('p');
                descriptionText.textContent = firstPost.description;
                descriptionText.style.marginBottom = '10px';
                popupContent.appendChild(descriptionText);
            } else {
                const noDescriptionText = document.createElement('p');
                noDescriptionText.textContent = 'No description available';
                noDescriptionText.style.color = '#999';
                noDescriptionText.style.marginBottom = '10px';
                popupContent.appendChild(noDescriptionText);
            }

            const commentsContainer = document.createElement('div');
            const commentsHeader = document.createElement('h3');
            commentsHeader.textContent = 'Comments:';
            commentsHeader.style.marginBottom = '5px';
            commentsContainer.appendChild(commentsHeader);

            const commentsList = document.createElement('ul');
            commentsList.style.listStyleType = 'none';
            commentsList.style.paddingLeft = '0';
            commentsList.style.marginBottom = '10px';
            if (firstPost.comments && firstPost.comments.length > 0) {
                firstPost.comments.forEach((comment) => {
                    const commentItem = document.createElement('li');
                    commentItem.innerHTML = `<strong>${comment.username}</strong>: ${comment.content}`;
                    commentItem.style.marginBottom = '5px';
                    commentsList.appendChild(commentItem);
                });
            } else {
                const noCommentsItem = document.createElement('li');
                noCommentsItem.textContent = 'No comments available.';
                noCommentsItem.style.color = '#999';
                commentsList.appendChild(noCommentsItem);
            }
            commentsContainer.appendChild(commentsList);
            popupContent.appendChild(commentsContainer);

            const commentForm = document.createElement('form');
            commentForm.id = 'comment-form';
            commentForm.style.display = 'flex';
            commentForm.style.flexDirection = 'column';

            const commentLabel = document.createElement('label');
            commentLabel.setAttribute('for', 'comment');
            commentLabel.textContent = 'Add a comment:';
            commentLabel.style.marginBottom = '5px';
            commentForm.appendChild(commentLabel);

            const commentInput = document.createElement('input');
            commentInput.type = 'text';
            commentInput.id = 'comment';
            commentInput.name = 'comment';
            commentInput.style.marginBottom = '10px';
            commentInput.style.padding = '8px';
            commentInput.style.border = '1px solid #ccc';
            commentInput.style.borderRadius = '4px';
            commentForm.appendChild(commentInput);

            const postIdInput = document.createElement('input');
            postIdInput.type = 'hidden';
            postIdInput.id = 'post-id';
            postIdInput.name = 'post-id';
            postIdInput.value = firstPost.post_id;
            commentForm.appendChild(postIdInput);

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            submitButton.style.padding = '10px';
            submitButton.style.backgroundColor = '#6ba292';
            submitButton.style.color = '#fff';
            submitButton.style.border = 'none';
            submitButton.style.borderRadius = '4px';
            submitButton.style.cursor = 'pointer';
            commentForm.appendChild(submitButton);

            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                submitComment(event.target);
            });

            popupContent.appendChild(commentForm);

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupContent)
                .addTo(mapRef.current);
        } else {
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML('<p>No posts available for this location.</p>')
                .addTo(mapRef.current);
        }
    };

    const submitComment = async (form) => {
        const comment = form.elements['comment'].value;
        const postID = form.elements['post-id'].value;

        const data = {
            user_id: Number(localStorage.getItem("user_id")),
            post_id: parseInt(postID),
            content: comment
        };

        try {
            const response = await fetch('http://localhost:8000/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Comment submitted successfully');
                fetchLocations(); // Refresh locations after adding a comment
            } else {
                console.error('Error submitting comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };


    const postData = async (form) => {
        const description = form.elements['description'].value;
        const image = form.elements['image'].value;
        const latitude = form.elements['latitude'].value;
        const longitude = form.elements['longitude'].value;

        const data = {
            description,
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            user_id: Number(localStorage.getItem("user_id")),
            image
        };

        try {
            const response = await fetch('http://localhost:8000/addlocationpost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Post submitted successfully');
                fetchLocations(); // Refresh locations after adding a post
            } else {
                console.error('Error submitting post:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [styleIndex]);

    const handleRightClick = (e) => {
        e.preventDefault();

        const coordinates = e.lngLat;

        const formHTML = `
            <form id="popup-form">
                <label for="description">Description:</label><br>
                <input type="text" id="description" name="description"><br>
                <label for="image">Image Base64</label><br>
                <input type="text" id="image" name="image"><br>
                <input type="hidden" id="latitude" name="latitude" value="${coordinates.lat}">
                <input type="hidden" id="longitude" name="longitude" value="${coordinates.lng}">
                <button type="submit">Post</button>
            </form>
        `;

        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(formHTML)
            .addTo(mapRef.current);

        // Adding the event listener for form submission
        popup.getElement().querySelector('form#popup-form').addEventListener('submit', (event) => {
            event.preventDefault();
            postData(event.target);
        });
    };

    const cycleStyle = () => {
        setStyleIndex((prevIndex) => (prevIndex + 1) % styles.length);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <button onClick={cycleStyle}>Cycle Maps</button>
            </div>
            <div id="map" style={{ height: '100vh', width: '100%' }} ref={mapContainerRef}></div>
        </div>
    );
};

export default MapPage;
