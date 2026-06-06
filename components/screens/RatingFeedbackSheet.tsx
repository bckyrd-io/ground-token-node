import { COLORS, FORM_INPUT_TOKENS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState, forwardRef } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/app/store';
import { showToast } from '@/app/toast';
// eslint-disable-next-line import/no-named-as-default
import ScreenBottomSheet from '@/components/ScreenBottomSheet';

export const RatingFeedbackSheet = forwardRef<any, { activityId?: string }>((props, ref) => {
    const closeSheet = () => {
        if (ref && 'current' in ref && ref.current) ref.current.dismiss();
    };
    const activityId = props.activityId || '1';
    const [rating, setRating] = useState(4);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { feedbackOptions, fetchFeedbackOptions, profile } = useStore();

    useEffect(() => {
        fetchFeedbackOptions();
    }, [fetchFeedbackOptions]);

    const handleSubmit = async () => {
        if (rating === 0) {
            showToast('Please select a rating');
            return;
        }

        setIsLoading(true);

        try {
            const serverIp = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.2:5000';

            // Mock user and activity IDs - in production, get from auth/params
            const userId = profile?.id;

            const response = await fetch(`${serverIp}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activityId,
                    rating,
                    comment,
                    quickTags: selectedTags,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Thank you for your feedback!', 'success');
                setTimeout(() => closeSheet(), 1500);
            } else {
                showToast(data.error || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            showToast('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    if (!feedbackOptions) {
        return (
            <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
                <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                    <Text>Loading...</Text>
                </SafeAreaView>
            </ScreenBottomSheet>
        );
    }

    const { quickTags } = feedbackOptions;

    return (
        <ScreenBottomSheet ref={ref} snapPoints={['90%']}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>

                <View style={styles.content}>

                    {/* Star Rating */}
                    <View style={styles.ratingSection}>
                        <Text style={styles.ratingLabel}>Tap to rate</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <MaterialIcons
                                        name={star <= rating ? 'star' : 'star-border'}
                                        size={48}
                                        color={star <= rating ? COLORS.primary : COLORS.slate200}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Comment */}
                    <View style={styles.commentSection}>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="Tell us about your visit, what did kids love most?"
                            placeholderTextColor={COLORS.slate400}
                            value={comment}
                            onChangeText={setComment}
                            {...(Platform.OS === 'android' && { textAlignVertical: 'top' })}
                        />
                    </View>

                    {/* Quick Tags */}
                    <View style={styles.tagsSection}>
                        <View style={styles.tagsRow}>
                            {quickTags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.tag,
                                        selectedTags.includes(tag) && styles.tagSelected
                                    ]}
                                    onPress={() => toggleTag(tag)}
                                >
                                    <Text style={[
                                        styles.tagText,
                                        selectedTags.includes(tag) && styles.tagTextSelected
                                    ]}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        activeOpacity={0.9}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        <Text style={styles.submitText}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Text>
                        <MaterialIcons name="send" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScreenBottomSheet>
    );
});

        RatingFeedbackSheet.displayName = 'RatingFeedbackSheet';

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.slate100,
    },
    headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900, flex: 1, textAlign: 'center' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' },
    branding: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 96, height: 96, borderRadius: 48, overflow: 'hidden',
        backgroundColor: 'rgba(46,125,50,0.1)', borderWidth: 2, borderColor: 'rgba(46,125,50,0.2)',
        marginBottom: 16,
    },
    logoImage: { width: '100%', height: '100%' },
    brandName: { fontSize: 24, fontWeight: '900', color: COLORS.slate900 },
    brandTagline: { fontSize: 14, color: COLORS.slate500, marginTop: 4 },
    ratingSection: { alignItems: 'center', marginBottom: 40 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.slate900, marginBottom: 12 },
    ratingLabel: { fontSize: 14, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    starsRow: { flexDirection: 'row', gap: 8 },
    ratingText: { fontSize: 14, color: COLORS.slate400, fontStyle: 'italic', marginTop: 16 },
    commentSection: { width: '100%' },
    textArea: {
        width: '100%',
        minHeight: 160,
        padding: 16,
        backgroundColor: FORM_INPUT_TOKENS.backgroundColor,
        borderWidth: FORM_INPUT_TOKENS.borderWidth,
        borderColor: FORM_INPUT_TOKENS.borderColor,
        borderRadius: FORM_INPUT_TOKENS.borderRadius,
        fontSize: FORM_INPUT_TOKENS.fontSize,
        color: FORM_INPUT_TOKENS.textColor,
        ...(Platform.OS === 'android' && { textAlignVertical: 'top' }),
    },
    tagsSection: { width: '100%', marginTop: 24 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, width: '100%' },
    tag: {
        paddingHorizontal: 12, paddingVertical: 4,
        backgroundColor: COLORS.slate100, borderRadius: 9999,
        borderWidth: 1, borderColor: COLORS.slate200,
    },
    tagSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tagText: { fontSize: 12, fontWeight: '500', color: COLORS.slate600 },
    tagTextSelected: { color: COLORS.white },
    footer: {
        padding: 24, borderTopWidth: 1, borderTopColor: COLORS.slate100,
    },
    submitButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 56, backgroundColor: COLORS.primary, borderRadius: 12,
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    footerNote: { textAlign: 'center', fontSize: 10, color: COLORS.slate400, marginTop: 16, textTransform: 'uppercase', letterSpacing: -0.3 },
});
