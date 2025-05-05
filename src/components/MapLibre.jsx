import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreMap = () => {
  const mapContainerRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Start with an empty GeoJSON FeatureCollection for live events
  let heatmapData = {
    type: 'FeatureCollection',
    features: []
  };

  // This will hold realtime event features (for pulsing markers)
  let realtimeFeatures = [];

  let map; // Map instance

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5000/analytics');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        // Expected newData: { coordinates: [lng, lat], activity: number, label?: string }
        const newFeature = {
          type: 'Feature',
          properties: {
            activity: newData.activity || Math.floor(Math.random() * 101),
            label: newData.label || `Visit @ ${new Date().toLocaleTimeString()}`
          },
          geometry: {
            type: 'Point',
            coordinates: newData.coordinates || [0, 0]
          }
        };

        // Update heatmap data with the new event
        heatmapData.features.push(newFeature);
        const heatmapSource = map.getSource('points');
        if (heatmapSource) {
          heatmapSource.setData(heatmapData);
        }

        // Update realtime events source with the new event (for pulsing marker)
        realtimeFeatures.push(newFeature);
        const realtimeSource = map.getSource('realtime-events-source');
        if (realtimeSource) {
          realtimeSource.setData({
            type: 'FeatureCollection',
            features: realtimeFeatures
          });
        }

        // Automatically center the map on the new event's location
        map.setCenter(newFeature.geometry.coordinates);

        // Remove the realtime marker after 5 seconds
        setTimeout(() => {
          realtimeFeatures = realtimeFeatures.filter(feature => feature !== newFeature);
          if (realtimeSource) {
            realtimeSource.setData({
              type: 'FeatureCollection',
              features: realtimeFeatures
            });
          }
        }, 5000);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
      if (isMountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      }
    };
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Initialize the map with a global view
    map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
      pitch: 45,
      bearing: 0
    });

    map.addControl(new maplibregl.NavigationControl());

    // Optionally center on the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          map.setCenter([coords.longitude, coords.latitude]);
        },
        (error) => console.error('Error obtaining location:', error),
        { enableHighAccuracy: true }
      );
    }

    // Define layer configurations
    const heatmapLayer = {
      id: 'heatmap',
      type: 'heatmap',
      source: 'points',
      maxzoom: 9,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'activity'],
          0, 0,
          100, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 100, 0, 0)',
          0.3, 'rgb(0, 100, 0)',
          0.6, 'rgb(255, 165, 0)',
          1, 'rgb(255, 0, 0)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 0
        ]
      }
    };

    const circleLayer = {
      id: 'point-circles',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#00D2FF',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1
      }
    };

    const symbolLayer = {
      id: 'point-labels',
      type: 'symbol',
      source: 'points',
      layout: {
        'text-field': ['get', 'label'],
        'text-size': 12,
        'text-offset': [0, 1.5],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#FFFFFF'
      }
    };

    map.on('load', () => {
      map.addSource('points', {
        type: 'geojson',
        data: heatmapData
      });
      map.addLayer(heatmapLayer);
      map.addLayer(circleLayer);
      map.addLayer(symbolLayer);

      const size = 100;
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function () {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },
        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;
          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 0, 0, ${1 - t})`;
          context.fill();
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 0, 0, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          map.triggerRepaint();
          return true;
        }
      };

      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      map.addSource('realtime-events-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: realtimeFeatures
        }
      });
      map.addLayer({
        id: 'realtime-events',
        type: 'symbol',
        source: 'realtime-events-source',
        layout: {
          'icon-image': 'pulsing-dot'
        }
      });
    });

    connectWebSocket();

    return () => {
      isMountedRef.current = false;
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (map) map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapLibreMap;
