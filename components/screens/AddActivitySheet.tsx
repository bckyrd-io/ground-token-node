import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState, forwardRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/app/store';
import { showToast } from '@/app/toast';
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const AddActivitySheet = forwardRef<any, any>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
    const { staff, fetchStaff } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [showStaffPicker, setShowStaffPicker] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [activity, setActivity] = useState<{
        name: string;
        description: string;
        price: string;
        capacity: string;
        image: string;
        safetyRules: string[];
        type: 'play' | 'food';
    }>({
        name: '',
        description: '',
        price: '',
        capacity: '',
        image: '',
        safetyRules: [''],
        type: 'play'
    });

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.175:5000';

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', activity.name);
            formData.append('description', activity.description);
            formData.append('price', activity.price);
            formData.append('capacity', activity.capacity);
            formData.append('type', activity.type);
            formData.append('safetyRules', JSON.stringify(activity.safetyRules));
            formData.append('staff', JSON.stringify(selectedStaff));
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);

            // Add image if selected
            if (selectedImage) {
                console.log('Uploading image:', selectedImage);
                const uri = selectedImage;
                let filename = uri.split('/').pop() || 'photo.jpg';
                if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
                    filename = 'photo.jpg';
                }
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : `image/jpeg`;

                if (Platform.OS === 'web') {
                    // Fetch blob for web and create a file
                    const res = await fetch(uri);
                    const blob = await res.blob();
                    const file = new File([blob], filename, { type });
                    formData.append('image', file);
                } else {
                    // React Native FormData format
                    formData.append('image', {
                        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                        name: filename,
                        type,
                    } as any);
                }
            } else {
                console.log('No image selected');
            }

            console.log('Sending request to:', `${serverIp}/api/activities/upload`);
            console.log('Form data entries:');
            console.log('name:', activity.name);
            console.log('description:', activity.description);
            console.log('price:', activity.price);
            console.log('capacity:', activity.capacity);
            console.log('safetyRules:', activity.safetyRules);
            console.log('hasImage:', !!selectedImage);

            const response = await fetch(`${serverIp}/api/activities/upload`, {
                method: 'POST',
                // Important: Don't set Content-Type header for React Native FormData
                // Let the browser/set it automatically with boundary
                body: formData,
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                showToast('Activity added successfully', 'success', () => {
                    closeSheet();
                });
            } else {
                showToast(data.error || 'Failed to add activity');
            }
        } catch (error) {
            console.error('Add error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showToast('Location permission is required to use current location');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLatitude(currentLocation.coords.latitude.toFixed(6));
            setLongitude(currentLocation.coords.longitude.toFixed(6));
            showToast('Current location captured', 'success');
        } catch (error) {
            console.error('Location error:', error);
            showToast('Failed to get current location');
        }
    };

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={true}
                >


                    {/* Activity Name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{activity.type === 'food' ? 'Food Item Name' : 'Activity Name'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={activity.type === 'food' ? 'Enter food item name' : 'Enter activity name'}
                            value={activity.name}
                            onChangeText={(text) => setActivity({ ...activity, name: text })}
                            placeholderTextColor={COLORS.slate400}
                        />
                    </View>

                    {/* Activity Type */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Activity Type</Text>
                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[styles.typeButton, activity.type === 'play' && styles.typeButtonActive]}
                                onPress={() => setActivity({ ...activity, type: 'play' })}
                            >
                                <MaterialIcons name="sports-basketball" size={20} color={activity.type === 'play' ? COLORS.white : COLORS.slate600} />
                                <Text style={[styles.typeButtonText, activity.type === 'play' && styles.typeButtonTextActive]}>Play</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, activity.type === 'food' && styles.typeButtonActive]}
                                onPress={() => setActivity({ ...activity, type: 'food' })}
                            >
                                <MaterialIcons name="restaurant" size={20} color={activity.type === 'food' ? COLORS.white : COLORS.slate600} />
                                <Text style={[styles.typeButtonText, activity.type === 'food' && styles.typeButtonTextActive]}>Food</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter activity description"
                            value={activity.description}
                            multiline
                            onChangeText={(text) => setActivity({ ...activity, description: text })}
                            placeholderTextColor={COLORS.slate400}
                        />
                    </View>

                    {/* Pricing & Capacity */}
                    <View style={styles.row}>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Pricing</Text>
                            <View style={styles.prefixInput}>
                                <Text style={styles.prefix}>MWK</Text>
                                <TextInput
                                    style={styles.inputWithoutBorder}
                                    placeholder="0"
                                    value={activity.price}
                                    onChangeText={(text) => setActivity({ ...activity, price: text })}
                                    placeholderTextColor={COLORS.slate400}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
                            <Text style={styles.label}>Number</Text>
                            <View style={styles.suffixInput}>
                                <TextInput
                                    style={styles.inputWithoutBorder}
                                    placeholder="0"
                                    value={activity.capacity}
                                    onChangeText={(text) => setActivity({ ...activity, capacity: text })}
                                    placeholderTextColor={COLORS.slate400}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.suffix}>people</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Activity Coordinates</Text>
                        <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
                            <MaterialIcons name="my-location" size={18} color={COLORS.white} />
                            <Text style={styles.locationButtonText}>Use Current Location</Text>
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, { flex: 1 }]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Latitude"
                                    value={latitude}
                                    onChangeText={setLatitude}
                                    placeholderTextColor={COLORS.slate400}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Longitude"
                                    value={longitude}
                                    onChangeText={setLongitude}
                                    placeholderTextColor={COLORS.slate400}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Staff Assignment */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Staff Assignment</Text>
                        <TouchableOpacity
                            style={styles.staffSelector}
                            onPress={() => setShowStaffPicker(true)}
                        >
                            <Text style={styles.staffSelectorText}>
                                {selectedStaff.length > 0
                                    ? `${selectedStaff.length} staff member(s) selected`
                                    : 'Select staff members'
                                }
                            </Text>
                            <MaterialIcons name="expand-more" size={24} color={COLORS.slate400} />
                        </TouchableOpacity>
                    </View>

                    {/* Staff Picker Modal */}
                    {showStaffPicker && (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Staff</Text>
                                    <TouchableOpacity onPress={() => setShowStaffPicker(false)}>
                                        <MaterialIcons name="close" size={24} color={COLORS.slate900} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.staffList}>
                                    {staff.map(member => (
                                        <TouchableOpacity
                                            key={member.id}
                                            style={[
                                                styles.staffItem,
                                                selectedStaff.includes(member.id) && styles.selectedStaffItem
                                            ]}
                                            onPress={() => {
                                                if (selectedStaff.includes(member.id)) {
                                                    setSelectedStaff(selectedStaff.filter(id => id !== member.id));
                                                } else {
                                                    setSelectedStaff([...selectedStaff, member.id]);
                                                }
                                            }}
                                        >
                                            <View style={styles.staffAvatar}>
                                                <MaterialIcons name="person" size={24} color={COLORS.slate400} />
                                            </View>
                                            <View style={styles.staffInfo}>
                                                <Text style={styles.staffName}>{member.name || member.username}</Text>
                                                <Text style={styles.staffZone}>{member.zone}</Text>
                                            </View>
                                            <View style={[
                                                styles.checkbox,
                                                selectedStaff.includes(member.id) && styles.checkboxChecked
                                            ]}>
                                                {selectedStaff.includes(member.id) && (
                                                    <MaterialIcons name="check" size={16} color={COLORS.white} />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowStaffPicker(false)}
                                >
                                    <Text style={styles.modalButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Safety Rules */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Safety Rules</Text>
                        <TouchableOpacity
                            style={styles.addRuleButton}
                            onPress={() => {
                                setActivity({
                                    ...activity,
                                    safetyRules: [...activity.safetyRules, '']
                                });
                            }}
                        >
                            <MaterialIcons name="add" size={20} color={COLORS.primary} />
                            <Text style={styles.addRuleText}>Add Safety Rule</Text>
                        </TouchableOpacity>

                        {activity.safetyRules.map((rule, index) => (
                            <View key={index} style={styles.ruleItem}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder={`Safety rule ${index + 1}`}
                                    value={rule}
                                    onChangeText={(text) => {
                                        const newRules = [...activity.safetyRules];
                                        newRules[index] = text;
                                        setActivity({ ...activity, safetyRules: newRules });
                                    }}
                                    placeholderTextColor={COLORS.slate400}
                                />
                                {activity.safetyRules.length > 1 && (
                                    <TouchableOpacity
                                        style={styles.removeRuleButton}
                                        onPress={() => {
                                            const newRules = activity.safetyRules.filter((_, i) => i !== index);
                                            setActivity({ ...activity, safetyRules: newRules });
                                        }}
                                    >
                                        <MaterialIcons name="close" size={20} color={COLORS.red500} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Activity Photo */}
                    <View style={styles.photoSection}>
                        <Text style={styles.sectionTitle}>Activity Photo</Text>
                        <TouchableOpacity style={styles.photoCard} onPress={pickImage}>
                            <Image
                                source={{ uri: selectedImage || 'https://via.placeholder.com/400x225?text=No+Image' }}
                                style={styles.photo}
                                contentFit="cover"
                            />
                            <View style={styles.uploadOverlay}>
                                <MaterialIcons name="add-a-photo" size={28} color={COLORS.slate700} />
                                <Text style={styles.uploadText}>{selectedImage ? 'Change Photo' : 'Upload Photo'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveButtonText}>
                            {isLoading ? 'Adding Activity...' : 'Submit'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate200,
    },
    headerBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.slate900,
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 48,
        flexGrow: 1,
    },
    photoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.slate900,
        marginBottom: 12,
    },
    photoCard: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        height: 200,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    uploadOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    uploadText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.slate700,
        marginBottom: 8,
    },
    input: {
        height: FORM_INPUT_TOKENS.height,
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
    },
    textArea: {
        minHeight: 120,
        paddingVertical: 16,
        ...(Platform.OS === 'android' && { textAlignVertical: 'top' }),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prefixInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
        height: FORM_INPUT_TOKENS.height,
    },
    prefix: {
        fontSize: 16,
        color: COLORS.slate600,
        marginRight: 4,
    },
    inputWithoutBorder: {
        flex: 1,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
    },
    suffixInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
        height: FORM_INPUT_TOKENS.height,
    },
    suffix: {
        fontSize: 14,
        color: COLORS.slate600,
        marginLeft: 4,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 14,
        color: COLORS.slate600,
    },
    staffSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
        height: FORM_INPUT_TOKENS.height,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
    },
    staffSelectorText: {
        fontSize: 16,
        color: COLORS.slate900,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate200,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.slate900,
    },
    staffList: {
        maxHeight: 300,
    },
    staffItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate100,
    },
    selectedStaffItem: {
        backgroundColor: COLORS.green50,
    },
    staffAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: COLORS.slate100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    staffInfo: {
        flex: 1,
    },
    staffName: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.slate900,
    },
    staffZone: {
        fontSize: 12,
        color: COLORS.slate600,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.slate300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    modalButton: {
        backgroundColor: COLORS.primary,
        margin: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    addRuleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        borderStyle: 'dashed',
        marginBottom: 12,
    },
    addRuleText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    removeRuleButton: {
        padding: 8,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        borderWidth: 2,
        borderColor: COLORS.slate300,
        backgroundColor: COLORS.white,
    },
    typeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.slate600,
    },
    typeButtonTextActive: {
        color: COLORS.white,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        alignItems: 'center',
        marginTop: 8,
    },
    textInput: {
        height: FORM_INPUT_TOKENS.height,
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        paddingHorizontal: FORM_INPUT_TOKENS.horizontalPadding,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 44,
        backgroundColor: COLORS.primary,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        marginBottom: 12,
    },
    locationButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.slate300,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
