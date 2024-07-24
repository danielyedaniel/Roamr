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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/postlocation?user_id=1');
        const data = await response.json();

        console.log(data); // Debugging: Log the fetched data

        mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGNzMzQ4IiwiYSI6ImNseXpkYXdtcDJoeDcyanB1NnEyN252ejkifQ.KFDQShkH-emDn4Iz77W2jQ'; // Add your Mapbox access token here

        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: styles[styleIndex],
          center: [-96, 37.8],
          zoom: 3,
          projection: 'globe' // Ensure the map is rendered as a globe
        });

        mapRef.current.on('style.load', () => {
          mapRef.current.setFog({}); // Add fog to the map for better visualization of the globe
        });

        mapRef.current.on('load', () => {
          const features = data.map(location => {
            // Add checks to ensure location properties are defined
            const longitude = location.Longitude;
            const latitude = location.Latitude;
            const title = location.LocationID ? location.LocationID.toString() : 'Unknown';

            if (longitude !== undefined && latitude !== undefined) {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                },
                properties: {
                  title
                }
              };
            } else {
              console.error('Invalid location data', location); // Debugging: Log invalid data
              return null;
            }
          }).filter(feature => feature !== null);

          mapRef.current.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features
            }
          });

          mapRef.current.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'marker-15',
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });

          // Add a right-click event listener to the entire map
          mapRef.current.getCanvas().addEventListener('contextmenu', (e) => {
            e.preventDefault();

            // Get the coordinates of the click
            const bbox = mapRef.current.getCanvas().getBoundingClientRect();
            const x = e.clientX - bbox.left;
            const y = e.clientY - bbox.top;
            const coordinates = mapRef.current.unproject([x, y]);

            // Form HTML
            const formHTML = `
              <form id="popup-form">
                <label for="description">Description:</label><br>
                <input type="text" id="description" name="description"><br>
                <label for="image">Image URL:</label><br>
                <input type="text" id="image" name="image"><br>
                <input type="text" id="latitude" name="latitude" value="${coordinates.lat}">
                <input type="text" id="longitude" name="longitude" value="${coordinates.lng}">
                <button type="button">Post</button>
              </form>
            `;

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(formHTML)
              .addTo(mapRef.current);
          });

          // Change the cursor to a pointer when the mouse is over the points layer.
          mapRef.current.on('mouseenter', 'points', () => {
            mapRef.current.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to a pointer when it leaves.
          mapRef.current.on('mouseleave', 'points', () => {
            mapRef.current.getCanvas().style.cursor = '';
          });
        });
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [styleIndex]);

  const cycleStyle = () => {
    setStyleIndex((prevIndex) => (prevIndex + 1) % styles.length);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1
        }}
      >
        <button onClick={cycleStyle}>Cycle Maps</button>
      </div>
      <div id="map" style={{ height: '100vh', width: '100%' }} ref={mapContainerRef}></div>
    </div>
  );
};

export default MapPage;
