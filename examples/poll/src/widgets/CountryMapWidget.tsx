import 'leaflet';
import type { VernaWidgetProps } from '@openfun/verna';
import { memo, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Pane } from 'react-leaflet';
import CountriesVectors from ':/assets/world_countries.json';

function CountryMapWidget(props: VernaWidgetProps) {
  const [country, setCountry] = useState<string>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    props.onChange(country);
  }, [country]);

  return (
    <div style={{ display: 'block', width: '100%', zIndex: 0 }}>
      {country ? (
        <p>
          You have selected : <strong>{country}</strong>
        </p>
      ) : (
        <p>
          <strong style={isMounted.current && props.rawErrors ? { color: 'red' } : {}}>
            Please select a country
          </strong>
        </p>
      )}
      <MapContainer center={[51.505, -0.09]} className="country-map" maxZoom={5} zoom={2}>
        <Pane name="labels" style={{ zIndex: 10 }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png" />
        </Pane>
        <Pane name="map" style={{ zIndex: 0 }}>
          <TileLayer
            // eslint-disable-next-line max-len
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          />
          <CountriesLayer onSelect={setCountry} />
        </Pane>
      </MapContainer>
    </div>
  );
}

type CountriesLayerProps = {
  onSelect: (country: string) => void;
};

const CountriesLayer = ({ onSelect }: CountriesLayerProps) => {
  return (
    <GeoJSON
      data={CountriesVectors as any}
      style={{ color: '#7D4CDB', fillColor: '#7D4CDB', fillOpacity: 0.25, weight: 1 }}
      eventHandlers={{
        click: (event) => {
          onSelect(event.propagatedFrom.feature.properties.name);
        },
      }}
    />
  );
};

export default memo(CountryMapWidget);
