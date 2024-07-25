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
              title: location.location_id ? location.location_id.toString() : 'Unknown',
              posts: Array.isArray(posts) ? posts : []
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

  const handleClick = (e) => {
    const coordinates = e.lngLat;
    const properties = e.features[0].properties;

    if (properties.posts && properties.posts.length > 0) {
      const firstPost = JSON.parse(properties.posts)[0];

      // Debugging logs
      console.log('First Post:', firstPost);
      console.log('Image Base64:', firstPost.image);
      console.log('Description:', firstPost.description);

      const formHTML = `
        <div>
          ${firstPost.image ? `<img src="data:image/jpeg;base64,${firstPost.image}" alt="Post Image" style="width: 100%; height: auto;"/>` : '<p>No image available</p>'}
          ${firstPost.description ? `<p>${firstPost.description}</p>` : '<p>No description available</p>'}
        </div>
      `;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(formHTML)
        .addTo(mapRef.current);
    } else {
      // Handle case where no posts are available
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('<p>No posts available for this location.</p>')
        .addTo(mapRef.current);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/postlocation?user_id=1');
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

    fetchLocations();
  }, [styleIndex]);

  const handleRightClick = (e) => {
    e.preventDefault();
    
    const coordinates = e.lngLat;

    const formHTML = `
      <form id="popup-form">
        <label for="description">Description:</label><br>
        <input type="text" id="description" name="description"><br>
        <label for="image">Image URL:</label><br>
        <input type="text" id="image" name="image"><br>
        <input type="hidden" id="latitude" name="latitude" value="${coordinates.lat}">
        <input type="hidden" id="longitude" name="longitude" value="${coordinates.lng}">
        <button type="button">Post</button>
      </form>
    `;

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(formHTML)
      .addTo(mapRef.current);
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
