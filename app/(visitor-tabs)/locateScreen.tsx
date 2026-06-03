import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from '@/components/Map';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Types
interface Playground {
    _id: string;
    name: string;
    location: { latitude: number; longitude: number };
    status?: 'Available' | 'Occupied';
    itemsAvailable?: number;
    image?: string;
}

export default function LocateScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
    const [filteredPlaygrounds, setFilteredPlaygrounds] = useState<Playground[]>([]);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const serverIp = process.env.EXPO_PUBLIC_API_URL;
                const response = await fetch(`${serverIp}/api/locations`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load locations');
                }

                const mapped = data.map((location: any) => ({
                    _id: String(location.id),
                    name: location.name,
                    location: { latitude: Number(location.latitude), longitude: Number(location.longitude) },
                    status: location.status,
                    itemsAvailable: Math.max(Number(location.capacity) - Number(location.currentOccupancy), 0),
                    image: location.image,
                }));

                setPlaygrounds(mapped);
                setFilteredPlaygrounds(mapped);
            } catch (error) {
                console.error('Error fetching playgrounds:', error);
                Alert.alert('Error', 'Failed to load playgrounds.');
            }
        };

        fetchLocations();
    }, []);

    // Filter playgrounds based on search query
    useEffect(() => {
        const results = playgrounds.filter((playground) =>
            playground.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPlaygrounds(results);
    }, [searchQuery, playgrounds]);

    // Focus on the first matching marker
    const focusOnMarker = () => {
        if (filteredPlaygrounds.length > 0 && mapRef.current) {
            const { latitude, longitude } = filteredPlaygrounds[0].location;
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={COLORS.slate400} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search locations..."
                    placeholderTextColor={FORM_INPUT_TOKENS.placeholderColor}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={focusOnMarker}
                    returnKeyType="search"
                />
            </View>

            {/* Map Section */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: -16.008213,
                    longitude: 35.305639,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {filteredPlaygrounds.map((playground) => (
                    <Marker
                        key={playground._id}
                        coordinate={{
                            latitude: playground.location.latitude,
                            longitude: playground.location.longitude,
                        }}
                        title={playground.name}
                        description={`${playground.status || 'Available'} - ${playground.itemsAvailable || 0} items available`}
                        pinColor={playground.status === 'Occupied' ? '#dc2626' : COLORS.primary}
                    >
                        {/* Custom Marker Image */}
                        {playground.image && (
                            <Image
                                source={{ uri: playground.image }}
                                style={styles.markerImage}
                            />
                        )}
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    searchContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 1,
        backgroundColor: COLORS.white,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    searchBar: {
        height: FORM_INPUT_TOKENS.height,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingLeft: FORM_INPUT_TOKENS.iconLeftPadding,
        paddingRight: FORM_INPUT_TOKENS.horizontalPadding,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
        top: 18,
        zIndex: 1,
    },
    map: {
        width: screenWidth,
        height: screenHeight,
    },
    markerImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.primary,
        resizeMode: 'cover',
    },
});
