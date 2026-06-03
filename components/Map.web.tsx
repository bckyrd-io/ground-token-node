import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ style, children }: any) => (
  <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' }]}>
    <Text style={{ color: '#64748b', fontSize: 16 }}>Map feature is not supported on web.</Text>
  </View>
);

export const Marker = ({ children }: any) => <>{children}</>;

export default MapView;
