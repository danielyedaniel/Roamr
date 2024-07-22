import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapboxgl) {
      mapboxgl.accessToken = '';

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

              if (!mapRef.current.getSource('points')) {
                mapRef.current.addSource('points', {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [-77.03238901390978, 38.913188059745586]
                        },
                        properties: {
                          title: 'Daniel'
                        }
                      },
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [-122.414, 37.776]
                        },
                        properties: {
                          title: 'John'
                        }
                      },
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [-122.414, 86.776]
                        },
                        properties: {
                          title: 'Evan'
                        }
                      },
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [-50.414, 86.776]
                        },
                        properties: {
                          title: 'Marie'
                        }
                      },
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [50.414, 30.776]
                        },
                        properties: {
                          title: 'Amire'
                        }
                      }
                    ]
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
              }
            }
          );
        });
      }
    } else {
      console.error('Mapbox GL JS is not loaded');
    }
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }} ref={mapContainerRef}></div>;
};

export default MapPage;
