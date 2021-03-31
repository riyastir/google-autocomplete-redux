import React, { useEffect, useRef, useState } from "react";

const Map = ({ coord }) => {
  const mapRef = useRef();
  const [initMap,setInitMap] = useState(true);
  let googleMap;
  useEffect(() => {
    if(initMap){
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          return window.google
            ? createGoogleMap({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
            : false;
        });
      } else {
        return window.google ? createGoogleMap(coord) : false;
      }
      setInitMap(false);
    } else {
      return window.google ? createGoogleMap(coord) : false;
    }
   
  }, [coord]);

  const createGoogleMap = (coordinates) => {
    googleMap = new window.google.maps.Map(mapRef.current, {
      zoom: 16,
      center: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      disableDefaultUI: true,
    });

    new window.google.maps.Marker({
      position: { lat: coordinates.lat, lng: coordinates.lng },
      map: googleMap,
      animation: window.google.maps.Animation.DROP,
    });
  };

  return (
    <div
      id="google-map"
      ref={mapRef}
      style={{ width: "auto", height: "600px" }}
    />
  );
};

export default Map;
