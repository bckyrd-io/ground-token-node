import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { ActivityDetailSheet } from '@/components/screens/ActivityDetailSheet';
import { LeafletMap, LeafletMapHandle } from '@/components/LeafletMap';
import { useStore } from '../store';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Used only until locations load, so the map still opens somewhere sensible.
const FALLBACK_REGION = {
    latitude: -15.7861,
    longitude: 35.0058,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

interface Playground {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: 'Available' | 'Occupied';
    spotsFree: number;
    capacity: number;
    image: string | null;
}

const statusColor = (status: Playground['status']) =>
    status === 'Occupied' ? COLORS.error : COLORS.primary;

// Region that frames every marker, with a zoom floor so a single marker does not
// zoom in absurdly far.
const regionForMarkers = (items: Playground[]): typeof FALLBACK_REGION => {
    if (items.length === 0) return FALLBACK_REGION;

    const lats = items.map((i) => i.latitude);
    const lngs = items.map((i) => i.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max((maxLat - minLat) * 2, 0.004),
        longitudeDelta: Math.max((maxLng - minLng) * 2, 0.004),
    };
};

export default function LocateScreen() {
    const { serverIp } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [mapLoadFailed, setMapLoadFailed] = useState(false);
    const mapRef = useRef<LeafletMapHandle>(null);
    const hasFittedRef = useRef(false);
    const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activityDetailRef = useRef<BottomSheetModal>(null);

    // Pads the fit animation so markers are not hidden behind the search bar.
    const mapPadding = useMemo(() => ({ top: 130, right: 60, bottom: 90, left: 60 }), []);

    const loadLocations = useCallback(async () => {
        try {
            setLoadError(null);
            const response = await fetch(`${serverIp}/api/locations`);

            if (!response.ok) {
                throw new Error(`Server responded ${response.status}`);
            }

            const data = await response.json();

            // Skip entries without usable coordinates, otherwise the map fit maths
            // breaks and a marker is dropped at (0, 0) in the Gulf of Guinea.
            const mapped: Playground[] = data
                .filter((location: any) =>
                    location.latitude !== null &&
                    location.longitude !== null &&
                    Number.isFinite(Number(location.latitude)) &&
                    Number.isFinite(Number(location.longitude))
                )
                .map((location: any) => {
                    // The API returns a relative path such as "/uploads/x.jpg";
                    // Image needs an absolute URL or it renders nothing.
                    const image = location.image
                        ? location.image.startsWith('http')
                            ? location.image
                            : `${serverIp}${location.image}`
                        : null;

                    const capacity = Number(location.capacity) || 0;
                    const currentOccupancy = Number(location.currentOccupancy) || 0;

                    return {
                        id: String(location.id),
                        name: location.name,
                        latitude: Number(location.latitude),
                        longitude: Number(location.longitude),
                        status: location.status === 'Occupied' ? 'Occupied' : 'Available',
                        capacity,
                        spotsFree: Math.max(capacity - currentOccupancy, 0),
                        image,
                    };
                });

            setPlaygrounds(mapped);
        } catch (error) {
            setLoadError(
                error instanceof Error ? error.message : 'Failed to load locations'
            );
        } finally {
            setLoading(false);
        }
    }, [serverIp]);

    useEffect(() => {
        loadLocations();
    }, [loadLocations]);

    const initialRegion = useMemo(() => regionForMarkers(playgrounds), [playgrounds]);

    // Frame every marker once the data arrives.
    useEffect(() => {
        if (playgrounds.length === 0 || hasFittedRef.current) return;
        hasFittedRef.current = true;
        mapRef.current?.fitCoords(
            playgrounds.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))
        );
    }, [playgrounds]);

    const mapMarkers = useMemo(
        () =>
            playgrounds.map((p) => ({
                id: p.id,
                latitude: p.latitude,
                longitude: p.longitude,
                title: p.name,
                statusColor: statusColor(p.status),
                selected: p.id === selectedId,
                imageUrl: p.image,
            })),
        [playgrounds, selectedId]
    );

    const showHint = useCallback((text: string) => {
        setHint(text);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setHint(null), 2500);
    }, []);

    useEffect(
        () => () => {
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        },
        []
    );

    const flyTo = useCallback((item: Playground) => {
        mapRef.current?.flyTo(item.latitude, item.longitude);
    }, []);

    const selectPlayground = useCallback(
        (item: Playground) => {
            setSelectedId(item.id);
            flyTo(item);
        },
        [flyTo]
    );

    const handleMarkerPress = useCallback(
        (id: string) => {
            // Second tap on the same marker opens the full detail sheet;
            // first tap (or another marker) just shows its name tooltip.
            if (id === selectedId) {
                activityDetailRef.current?.present();
                return;
            }
            const item = playgrounds.find((p) => p.id === id);
            if (item) {
                setSelectedId(item.id);
                flyTo(item);
            }
        },
        [playgrounds, selectedId, flyTo]
    );

    const handleMapPress = useCallback(() => {
        setSelectedId(null);
    }, []);

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedId(null);
        setHint(null);
        if (playgrounds.length > 0) {
            mapRef.current?.fitCoords(
                playgrounds.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))
            );
        }
    };

    // Search moves the map to the match; no results are listed on screen.
    const handleSubmitSearch = () => {
        Keyboard.dismiss();

        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            clearSearch();
            return;
        }

        const matches = playgrounds.filter((p) => p.name.toLowerCase().includes(query));

        if (matches.length === 0) {
            showHint(`No play areas match "${searchQuery.trim()}"`);
            return;
        }

        if (matches.length === 1) {
            selectPlayground(matches[0]);
            return;
        }

        // Several matches: frame them all so they are visible and tappable.
        mapRef.current?.fitCoords(
            matches.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))
        );
    };

    return (
        <View style={styles.container}>
            <LeafletMap
                ref={mapRef}
                style={styles.map}
                markers={mapMarkers}
                initialRegion={initialRegion}
                fitPadding={mapPadding}
                onMarkerPress={handleMarkerPress}
                onMapPress={handleMapPress}
                onLoadError={() => setMapLoadFailed(true)}
            />

            {/* Search */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={COLORS.slate400} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search play areas..."
                    placeholderTextColor={FORM_INPUT_TOKENS.placeholderColor}
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        if (hint) setHint(null);
                    }}
                    onSubmitEditing={handleSubmitSearch}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearSearch}
                        accessibilityLabel="Clear search"
                    >
                        <MaterialIcons name="close" size={18} color={COLORS.slate500} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Transient hint under the search bar (no-match, or map script failed) */}
            {hint ? (
                <View style={styles.hintPill} pointerEvents="none">
                    <MaterialIcons name="search-off" size={15} color={COLORS.white} />
                    <Text style={styles.hintText}>{hint}</Text>
                </View>
            ) : mapLoadFailed ? (
                <View style={styles.hintPill} pointerEvents="none">
                    <MaterialIcons name="error-outline" size={15} color={COLORS.white} />
                    <Text style={styles.hintText}>Map failed to load - check your connection</Text>
                </View>
            ) : null}

            {/* Loading / error / empty */}
            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.overlayText}>Loading play areas...</Text>
                </View>
            )}

            {!loading && loadError && (
                <View style={styles.overlay}>
                    <MaterialIcons name="wifi-off" size={36} color={COLORS.slate400} />
                    <Text style={styles.overlayText}>Could not load play areas</Text>
                    <Text style={styles.overlaySubText}>{loadError}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadLocations}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && !loadError && playgrounds.length === 0 && (
                <View style={styles.overlay}>
                    <MaterialIcons name="location-off" size={36} color={COLORS.slate400} />
                    <Text style={styles.overlayText}>No play areas have been mapped yet</Text>
                </View>
            )}

            <ActivityDetailSheet ref={activityDetailRef} activityId={selectedId ?? ''} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    searchContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 2,
        backgroundColor: COLORS.white,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
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
        paddingRight: 44,
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
    clearButton: {
        position: 'absolute',
        right: 12,
        top: 14,
        zIndex: 1,
        padding: 4,
    },
    hintPill: {
        position: 'absolute',
        top: 76,
        alignSelf: 'center',
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(17, 24, 29, 0.92)',
        maxWidth: '90%',
    },
    hintText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        flexShrink: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 3,
        backgroundColor: COLORS.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 32,
    },
    overlayText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.slate700,
        textAlign: 'center',
    },
    overlaySubText: {
        fontSize: 13,
        color: COLORS.slate500,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 8,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    retryButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 14,
    },
});
