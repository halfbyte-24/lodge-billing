import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { hotelInfo, getDirectionsUrl } from '../../config/hotelInfo';

const LocationMap = ({ title = "Find Us", showHeader = true }) => {
  const { name, address, latitude, longitude } = hotelInfo;
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';

  // OpenStreetMap embed URL calculated when coordinates are available
  const osmEmbedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.008}%2C${
        latitude - 0.006
      }%2C${longitude + 0.008}%2C${latitude + 0.006}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  return (
    <section className="location-map-section" id="location-map">
      <div className="container">
        <div className="map-card-container">
          {showHeader && (
            <div className="map-card-header">
              <div className="map-header-info">
                <span className="section-tag" style={{ marginBottom: '2px' }}>
                  {title}
                </span>
                <h3>{name}</h3>
                <p>
                  <MapPin size={16} />
                  <span>{address}</span>
                </p>
              </div>
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                <Navigation size={16} />
                <span>Get Directions</span>
              </a>
            </div>
          )}

          {/* Interactive Map or Graceful Placeholder */}
          {hasCoordinates ? (
            <div className="map-iframe-wrapper">
              <iframe
                title={`Map of ${name}`}
                src={osmEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="map-placeholder-box">
              <MapPin size={42} />
              <h4>Lodge Coordinates Pending Configuration</h4>
              <p style={{ maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                Exact geographic coordinates are currently not configured. You can update{' '}
                <code>latitude</code> and <code>longitude</code> in{' '}
                <code>src/config/hotelInfo.js</code> to enable live OpenStreetMap mapping.
              </p>
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Navigation size={16} />
                <span>Search Location on Google Maps</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
