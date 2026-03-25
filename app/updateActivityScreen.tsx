import { COLORS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UpdateActivityScreen() {
    const router = useRouter();
    const [autoAssign, setAutoAssign] = React.useState(true);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update Activity</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Image Upload */}
                <View style={styles.imageSection}>
                    <Text style={styles.sectionLabel}>Activity Cover</Text>
                    <TouchableOpacity style={styles.imageUpload} activeOpacity={0.8}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gjQxEjY_5T8PBF1hHnVSVdyNNx8UAArbBO4ZvIde5cF4Bt8zLTGlzNUZMM1P0oHzLvHcjR_pknikPnAxUFl0iSrkqw93OiCRTA5pezh9dOmyWmS3SBFErKbpJkNeEbspt_EMb551UzIyROrQURrFT5_R7qRi04fkOWDBTgllYLbAdSoOa2c2JvsbdYJQUoi55U_jwxJfmtCPRWXPzG0ySWUg2vUIVqrWCfZkFwBLpieX1kVzjXuknXncjMUmF5MWjvf7GdwtBxBW' }}
                            style={styles.uploadImage}
                            contentFit="cover"
                        />
                        <View style={styles.uploadOverlay}>
                            <MaterialIcons name="add-a-photo" size={28} color={COLORS.slate700} />
                            <Text style={styles.uploadText}>Change Photo</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Activity Name */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Activity Name</Text>
                    <TextInput style={styles.input} defaultValue="Trampoline Park" placeholderTextColor={COLORS.slate400} />
                </View>

                {/* Description */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        defaultValue="Our premium trampoline park features wall-to-wall bounce areas, foam pits, and slam dunk zones perfect for kids aged 5-12."
                        placeholderTextColor={COLORS.slate400}
                    />
                </View>

                {/* Pricing & Capacity */}
                <View style={styles.row}>
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Pricing</Text>
                        <View style={styles.prefixInput}>
                            <Text style={styles.prefix}>MWK</Text>
                            <TextInput style={styles.prefixField} defaultValue="5,000" keyboardType="numeric" />
                            <Text style={styles.suffix}>/hr</Text>
                        </View>
                    </View>
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Capacity</Text>
                        <View style={styles.prefixInput}>
                            <MaterialIcons name="groups" size={20} color={COLORS.slate400} />
                            <TextInput style={styles.prefixField} defaultValue="25" keyboardType="numeric" />
                        </View>
                    </View>
                </View>

                {/* Staff Assignment */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Staff Assignment</Text>
                    <Text style={styles.subLabel}>Assign Staff/Attendants</Text>
                    <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>Select staff members</Text>
                        <MaterialIcons name="expand-more" size={24} color={COLORS.slate400} />
                    </View>
                </View>

                {/* Auto-assign Toggle */}
                <View style={styles.toggleCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.toggleLabel}>Auto-assign available staff</Text>
                        <Text style={styles.toggleDesc}>Automatically assign on-duty staff to this activity</Text>
                    </View>
                    <Switch
                        value={autoAssign}
                        onValueChange={setAutoAssign}
                        trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
                        thumbColor={COLORS.white}
                    />
                </View>

                {/* Safety Rules */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Safety Rules</Text>
                    <View style={styles.rulesCard}>
                        <View style={styles.ruleRow}>
                            <View style={styles.ruleDot} />
                            <TextInput
                                style={styles.ruleInput}
                                multiline
                                defaultValue="Grip socks must be worn at all times while on the trampoline mats."
                            />
                        </View>
                        <View style={styles.ruleDivider} />
                        <View style={styles.ruleRow}>
                            <View style={styles.ruleDot} />
                            <TextInput
                                style={styles.ruleInput}
                                multiline
                                defaultValue="No double bouncing or rough play in the foam pit area."
                            />
                        </View>
                        <TouchableOpacity style={styles.addRuleBtn}>
                            <MaterialIcons name="add" size={18} color={COLORS.primary} />
                            <Text style={styles.addRuleText}>Add Another Rule</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} activeOpacity={0.9}>
                    <MaterialIcons name="save" size={20} color={COLORS.white} />
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.slate200,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.slate900, letterSpacing: -0.5 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, gap: 20 },
    imageSection: { gap: 12 },
    sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: 0.5 },
    imageUpload: {
        width: '100%', aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden',
        borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.slate200, position: 'relative',
    },
    uploadImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
    uploadOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    uploadText: { fontSize: 14, fontWeight: '500', color: COLORS.slate700, marginTop: 4 },
    fieldGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.slate700, marginLeft: 4 },
    subLabel: { fontSize: 12, color: COLORS.slate500, marginLeft: 4 },
    input: {
        height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 12, fontSize: 16, color: COLORS.slate900,
    },
    textArea: {
        minHeight: 120, padding: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 12, fontSize: 16, color: COLORS.slate900, textAlignVertical: 'top',
    },
    row: { flexDirection: 'row', gap: 16 },
    prefixInput: {
        height: 56, flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200, borderRadius: 12,
    },
    prefix: { color: COLORS.slate400, fontWeight: '500' },
    suffix: { color: COLORS.slate400, fontSize: 12 },
    prefixField: { flex: 1, fontSize: 16, color: COLORS.slate900 },
    selectWrapper: {
        height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200,
        borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    selectText: { fontSize: 16, color: COLORS.slate400 },
    toggleCard: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        borderRadius: 12, borderWidth: 1, borderColor: COLORS.slate200,
    },
    toggleLabel: { fontSize: 14, fontWeight: '500', color: COLORS.slate700 },
    toggleDesc: { fontSize: 12, color: COLORS.slate500, marginTop: 4 },
    rulesCard: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.slate200 },
    ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    ruleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 8 },
    ruleInput: { flex: 1, fontSize: 14, color: COLORS.slate900, lineHeight: 20, padding: 0 },
    ruleDivider: { height: 1, backgroundColor: COLORS.slate100, marginVertical: 12 },
    addRuleBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12 },
    addRuleText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
    footer: {
        padding: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: COLORS.slate200,
    },
    saveButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 56, backgroundColor: COLORS.primary, borderRadius: 12,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    saveText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});
