import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/postlocation?user_id=1');
        const data = await response.json();

        if (mapboxgl) {
          mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGNzMzQ4IiwiYSI6ImNseXhib2xrdzA4MXoycXBzZmd5dGM1YXQifQ.KNe0pfNA3TaKVRinPFmF6Q'; // Add your Mapbox access token here

          if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = new mapboxgl.Map({
              container: mapContainerRef.current,
              style: 'mapbox://styles/mapbox/streets-v12',
              center: [-96, 37.8],
              zoom: 3
            });

            mapRef.current.on('load', () => {
              mapRef.current.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (error, image) => {
                  if (error) throw error;
                  if (!mapRef.current.hasImage('custom-marker')) {
                    mapRef.current.addImage('custom-marker', image);
                  }

                  const features = data.map(location => ({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [location.Longitude, location.Latitude]
                    },
                    properties: {
                      title: location.LocationID.toString()
                    }
                  }));

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
                      'icon-image': 'custom-marker',
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
                }
              );
            });
          }
        } else {
          console.error('Mapbox GL JS is not loaded');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }} ref={mapContainerRef}></div>;
};

export default MapPage;
