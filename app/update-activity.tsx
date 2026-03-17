import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform, Switch } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2E7D32',
  backgroundLight: '#f8f6f6',
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
};

export default function UpdateActivity() {
  const router = useRouter();
  const [activityName, setActivityName] = useState('Trampoline Park');
  const [description, setDescription] = useState('Our premium trampoline park features wall-to-wall bounce areas, foam pits, and slam dunk zones perfect for kids aged 5-12.');
  const [pricing, setPricing] = useState('5,000');
  const [capacity, setCapacity] = useState('25');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [autoAssign, setAutoAssign] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Activity</Text>
          <View style={{ width: 40 }} /> {/* Spacer */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Image Upload Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACTIVITY COVER</Text>
          </View>
          
          <TouchableOpacity style={styles.imageUploadContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gjQxEjY_5T8PBFbc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2yTGlzNUZMM1P0oHzLvHcjR_pknikPnAxUFl0iSrkqw9bc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2yspt_EMb551UzIyROrQURrFT5_R7qRi04fkOWDBTgllYLbAdSoOa2c2JvsbdYJQUoi55U_jwxJfmtCPRWXPzG0ySWUg2vUIVqrWCfZkFwBLpieXbc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2y' }}
              style={styles.coverImage}
              contentFit="cover"
            />
            <View style={styles.imageOverlay}>
              <MaterialIcons name="add-a-photo" size={32} color={COLORS.slate300} />
              <Text style={styles.imageOverlayText}>Change Photo</Text>
            </View>
          </TouchableOpacity>

          {/* Activity Details Form */}
          <View style={styles.formSection}>
            
            {/* Activity Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Activity Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Jungle Gym"
                placeholderTextColor={COLORS.slate400}
                value={activityName}
                onChangeText={setActivityName}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the play zone activities and features..."
                placeholderTextColor={COLORS.slate400}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Pricing & Capacity Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowItem]}>
                <Text style={styles.inputLabel}>Pricing</Text>
                <View style={styles.iconInputContainer}>
                  <Text style={styles.leftAddon}>MWK</Text>
                  <TextInput
                    style={styles.iconInputCenter}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.slate400}
                    keyboardType="numeric"
                    value={pricing}
                    onChangeText={setPricing}
                  />
                  <Text style={styles.rightAddon}>/hr</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, styles.rowItem]}>
                <Text style={styles.inputLabel}>Capacity</Text>
                <View style={styles.iconInputContainer}>
                  <MaterialIcons name="groups" size={20} color={COLORS.slate400} style={styles.leftIcon} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="Max kids"
                    placeholderTextColor={COLORS.slate400}
                    keyboardType="numeric"
                    value={capacity}
                    onChangeText={setCapacity}
                  />
                </View>
              </View>
            </View>

            {/* Staff Assignment Section */}
            <View style={styles.formSectionSpacer}>
              <Text style={styles.inputLabel}>Staff Assignment</Text>
              
              <View style={styles.subInputGroup}>
                <Text style={styles.subLabel}>Assign Staff/Attendants</Text>
                <View style={styles.selectContainer}>
                  <TextInput
                    style={styles.selectInput}
                    placeholder="Select staff members"
                    placeholderTextColor={COLORS.slate400}
                    value={assignedStaff}
                    onChangeText={setAssignedStaff}
                    // Mock dropdown behavior
                  />
                  <MaterialIcons name="expand-more" size={24} color={COLORS.slate400} style={styles.selectIcon} />
                </View>
              </View>

              {/* Auto-assign Toggle */}
              <View style={styles.toggleContainer}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Auto-assign available staff</Text>
                  <Text style={styles.toggleSubtitle}>Automatically assign on-duty staff to this activity</Text>
                </View>
                <Switch
                  trackColor={{ false: COLORS.slate200, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                  ios_backgroundColor={COLORS.slate200}
                  onValueChange={() => setAutoAssign(!autoAssign)}
                  value={autoAssign}
                />
              </View>
            </View>

            {/* Safety Rules */}
            <View style={styles.formSectionSpacer}>
              <Text style={styles.inputLabel}>Safety Rules</Text>
              <View style={styles.rulesContainer}>
                
                <View style={styles.ruleItem}>
                  <View style={styles.ruleBullet} />
                  <TextInput
                    style={styles.ruleInput}
                    multiline={true}
                    placeholder="Add rule..."
                    value="Grip socks must be worn at all times while on the trampoline mats."
                  />
                </View>
                
                <View style={[styles.ruleItem, styles.ruleDivider]}>
                  <View style={styles.ruleBullet} />
                  <TextInput
                    style={styles.ruleInput}
                    multiline={true}
                    placeholder="Add rule..."
                    value="No double bouncing or rough play in the foam pit area."
                  />
                </View>

                <TouchableOpacity style={styles.addRuleButton}>
                  <MaterialIcons name="add" size={20} color={COLORS.primary} />
                  <Text style={styles.addRuleText}>Add Another Rule</Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
             <MaterialIcons name="save" size={24} color={COLORS.white} style={{ marginRight: 8 }} />
             <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Matching the backdrop-blur header bg roughly
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    maxWidth: 448, // max-w-md
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // accommodate footer
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imageUploadContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.slate300,
    borderStyle: 'dashed',
    backgroundColor: COLORS.slate50,
    position: 'relative',
    marginBottom: 24,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  imageOverlayText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate700,
    marginTop: 4,
  },
  formSection: {
    gap: 20, // Requires RN 0.71+, use marginBottom fallback inside items
  },
  inputGroup: {
    marginBottom: 20,
  },
  formSectionSpacer: {
    marginTop: 8,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate700,
    marginLeft: 4,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.slate900,
  },
  textArea: {
    minHeight: 120,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.slate900,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowItem: {
    flex: 1,
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  leftAddon: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate400,
    marginRight: 8,
  },
  rightAddon: {
    fontSize: 12,
    color: COLORS.slate400,
    marginLeft: 8,
  },
  iconInputCenter: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.slate900,
  },
  leftIcon: {
    marginRight: 12,
  },
  iconInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.slate900,
  },
  subInputGroup: {
    marginBottom: 16,
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.slate500,
    marginLeft: 4,
    marginBottom: 8,
  },
  selectContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  selectInput: {
    height: 56,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 14,
    color: COLORS.slate700,
  },
  selectIcon: {
    position: 'absolute',
    right: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    padding: 16,
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate700,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
  },
  rulesContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    padding: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  ruleDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    marginTop: 4,
    paddingTop: 12,
  },
  ruleBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 12,
  },
  ruleInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.slate900,
    padding: 0,
    minHeight: 40,
  },
  addRuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
  },
  addRuleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24, // Matches pb-8 tailwind loosely plus safe area
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
