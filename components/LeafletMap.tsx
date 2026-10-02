import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

export interface LeafletMarker {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    statusColor: string;
    selected?: boolean;
    imageUrl?: string | null;
}

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface RegionInput {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MapPadding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface LeafletMapHandle {
    flyTo(latitude: number, longitude: number): void;
    fitCoords(coords: LatLng[]): void;
}

export interface LeafletMapProps {
    style?: StyleProp<ViewStyle>;
    markers?: LeafletMarker[];
    initialRegion?: RegionInput;
    fitPadding?: MapPadding;
    onMarkerPress?: (id: string) => void;
    onMapPress?: () => void;
    onLoadError?: () => void;
}

type OutgoingMessage =
    | { type: 'setMarkers'; markers: LeafletMarker[] }
    | { type: 'flyTo'; latitude: number; longitude: number }
    | {
          type: 'fitCoords';
          coords: LatLng[];
          padding: MapPadding;
      }
    | {
          type: 'initRegion';
          latitude: number;
          longitude: number;
          latitudeDelta: number;
          longitudeDelta: number;
      };

type WebViewMessageHandler = NonNullable<React.ComponentProps<typeof WebView>['onMessage']>;
type WebViewMessageEvent = Parameters<WebViewMessageHandler>[0];

const DEFAULT_PADDING: MapPadding = { top: 60, right: 60, bottom: 60, left: 60 };

// The map lives in a WebView because react-native-maps/Google Maps renders a
// blank surface inside Expo Go (expo/expo#49323, react-native-maps#5888).
// Leaflet + OpenStreetMap needs no API key and works in Expo Go as-is.
const MAP_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #eae6df; }
  .leaflet-container { background: #eae6df; }
  .pm-icon { background: transparent; border: 0; }
  .pm-wrap { display: flex; flex-direction: column; align-items: center; }
  .pm-circle {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #94a3b8;
    background: #94a3b8;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pm-circle.pm-sel { width: 48px; height: 48px; border-width: 3px; }
  .pm-circle img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pm-pointer {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 9px solid #94a3b8;
    margin-top: -2px;
  }
  .leaflet-control-attribution { font-size: 10px; background: rgba(255, 255, 255, 0.75); }
  .leaflet-tooltip.pm-tip {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    white-space: nowrap;
    pointer-events: none;
  }
  .leaflet-tooltip.pm-tip::before { border-top-color: #ffffff; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function () {
  function post(msg) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  }

  if (typeof L === 'undefined') {
    post({ type: 'loadError' });
    return;
  }

  var map = L.map('map', { zoomControl: false, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.setView([-15.7861, 35.0058], 15);

  var layers = {};
  var lastMarkerPress = 0;

  // Matches the previous react-native-maps animateToRegion(latitudeDelta: 0.0025).
  function zoomForDelta(delta, lat) {
    var cos = Math.cos((lat * Math.PI) / 180);
    var meters = delta * 111320;
    var z = Math.log((156543.03392 * cos * 600) / meters) / Math.LN2;
    if (z < 3) z = 3;
    if (z > 19) z = 19;
    return Math.round(z);
  }

  function circleHtml(m) {
    var sel = m.selected ? ' pm-sel' : '';
    var inner;
    if (m.imageUrl) {
      inner = '<img src="' + m.imageUrl + '" alt="" onerror="this.style.display=&apos;none&apos;" />';
    } else {
      inner = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8M3.5 12h17M12 3.5v17"></path></svg>';
    }
    return (
      '<div class="pm-wrap">' +
      '<div class="pm-circle' + sel + '" style="border-color:' + m.statusColor + '">' + inner + '</div>' +
      '<div class="pm-pointer" style="border-top-color:' + m.statusColor + '"></div>' +
      '</div>'
    );
  }

  function iconFor(m) {
    var w = m.selected ? 48 : 40;
    var h = w + 7;
    return L.divIcon({ className: 'pm-icon', html: circleHtml(m), iconSize: [w, h], iconAnchor: [w / 2, h] });
  }

  function setMarkers(list) {
    var seen = {};
    list.forEach(function (m) {
      seen[m.id] = true;
      var existing = layers[m.id];
      if (existing) {
        existing.setIcon(iconFor(m));
        existing.setZIndexOffset(m.selected ? 1000 : 0);
      } else {
        var mk = L.marker([m.latitude, m.longitude], {
          icon: iconFor(m),
          zIndexOffset: m.selected ? 1000 : 0
        });
        mk.bindTooltip(m.title || '', {
          direction: 'top',
          offset: [0, -57],
          className: 'pm-tip',
          permanent: false,
          opacity: 1,
          interactive: false
        });
        (function (id) {
          mk.on('click', function () {
            lastMarkerPress = Date.now();
            post({ type: 'markerPress', id: id });
          });
        })(m.id);
        mk.addTo(map);
        layers[m.id] = mk;
      }
      if (m.selected) {
        layers[m.id].openTooltip();
      } else {
        layers[m.id].closeTooltip();
      }
    });
    Object.keys(layers).forEach(function (id) {
      if (!seen[id]) {
        map.removeLayer(layers[id]);
        delete layers[id];
      }
    });
  }

  function handleMessage(event) {
    var msg;
    try {
      msg = JSON.parse(event.data);
    } catch (e) {
      return;
    }
    if (!msg || !msg.type) return;

    if (msg.type === 'setMarkers') {
      setMarkers(msg.markers || []);
    } else if (msg.type === 'flyTo') {
      map.flyTo([msg.latitude, msg.longitude], zoomForDelta(0.0025, msg.latitude), { duration: 0.6 });
    } else if (msg.type === 'initRegion') {
      map.setView([msg.latitude, msg.longitude], zoomForDelta(msg.latitudeDelta, msg.latitude), { animate: false });
    } else if (msg.type === 'fitCoords') {
      if (msg.coords && msg.coords.length) {
        var bounds = L.latLngBounds(
          msg.coords.map(function (c) {
            return [c.latitude, c.longitude];
          })
        );
        var p = msg.padding || { top: 60, right: 60, bottom: 60, left: 60 };
        map.fitBounds(bounds, {
          paddingTopLeft: [p.left, p.top],
          paddingBottomRight: [p.right, p.bottom],
          maxZoom: 18,
          animate: true,
          duration: 0.6
        });
      }
    }
  }

  document.addEventListener('message', handleMessage);
  window.addEventListener('message', handleMessage);

  map.on('click', function () {
    // Marker taps bubble to the map; ignore those so a tap does not
    // immediately deselect what it just selected.
    if (Date.now() - lastMarkerPress < 400) return;
    post({ type: 'mapPress' });
  });

  post({ type: 'ready' });
})();
</script>
</body>
</html>`;

export const LeafletMap = forwardRef<LeafletMapHandle, LeafletMapProps>(function LeafletMap(
    { style, markers, initialRegion, fitPadding, onMarkerPress, onMapPress, onLoadError },
    ref
) {
    const webViewRef = useRef<WebView>(null);
    const readyRef = useRef(false);
    const queueRef = useRef<string[]>([]);
    const paddingRef = useRef<MapPadding>(fitPadding ?? DEFAULT_PADDING);

    useEffect(() => {
        paddingRef.current = fitPadding ?? DEFAULT_PADDING;
    }, [fitPadding]);

    const send = useCallback((message: OutgoingMessage) => {
        const payload = JSON.stringify(message);
        if (readyRef.current) {
            webViewRef.current?.postMessage(payload);
        } else {
            queueRef.current.push(payload);
        }
    }, []);

    const markersKey = JSON.stringify(markers ?? []);
    useEffect(() => {
        send({ type: 'setMarkers', markers: JSON.parse(markersKey) });
    }, [markersKey, send]);

    const regionKey = initialRegion ? JSON.stringify(initialRegion) : '';
    useEffect(() => {
        if (!regionKey) return;
        const region: RegionInput = JSON.parse(regionKey);
        send({ type: 'initRegion', latitude: region.latitude, longitude: region.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta });
    }, [regionKey, send]);

    const handleMessage = useCallback(
        (event: WebViewMessageEvent) => {
            let message: { type?: string; id?: unknown };
            try {
                message = JSON.parse(event.nativeEvent.data);
            } catch {
                return;
            }

            if (message.type === 'ready') {
                readyRef.current = true;
                const queued = queueRef.current;
                queueRef.current = [];
                queued.forEach((payload) => webViewRef.current?.postMessage(payload));
            } else if (message.type === 'markerPress' && message.id != null) {
                onMarkerPress?.(String(message.id));
            } else if (message.type === 'mapPress') {
                onMapPress?.();
            } else if (message.type === 'loadError') {
                onLoadError?.();
            }
        },
        [onMarkerPress, onMapPress, onLoadError]
    );

    useImperativeHandle(
        ref,
        () => ({
            flyTo: (latitude: number, longitude: number) => {
                send({ type: 'flyTo', latitude, longitude });
            },
            fitCoords: (coords: LatLng[]) => {
                if (coords.length === 0) return;
                send({ type: 'fitCoords', coords, padding: paddingRef.current });
            },
        }),
        [send]
    );

    return (
        <View style={[styles.root, style]}>
            <WebView
                ref={webViewRef}
                style={styles.webview}
                originWhitelist={['*']}
                source={{ html: MAP_HTML }}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                setSupportMultipleWindows={false}
                overScrollMode="never"
                androidLayerType="hardware"
                onMessage={handleMessage}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#eae6df',
        overflow: 'hidden',
    },
    webview: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#eae6df',
    },
});
