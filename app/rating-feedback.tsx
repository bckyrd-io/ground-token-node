import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get window dimensions
const { width } = Dimensions.get('window');

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
  starEmpty: '#e2e8f0',
  starFilled: '#fbbf24', // amber-400
};

export default function RatingFeedback() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const handleStarPress = (index: number) => {
    setRating(index + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={COLORS.slate900} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Main Icon Area */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="mood" size={60} color={COLORS.primary} />
              </View>
            </View>

            {/* Title Section */}
            <Text style={styles.titleText}>How was your play session?</Text>
            <Text style={styles.subtitleText}>
              Your feedback helps us make Gelato Kids even better for everyone.
            </Text>

            {/* Interactive Star Rating */}
            <View style={styles.starsContainer}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleStarPress(index)}
                  style={styles.starButton}
                >
                  <MaterialIcons 
                    name={index < rating ? "star" : "star-border"} 
                    size={48} 
                    color={index < rating ? COLORS.starFilled : COLORS.starEmpty} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Text Area */}
            {rating > 0 && ( // Optionally reveal text area only after rating
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>Care to share more? (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tell us what you liked or what we can improve..."
                  placeholderTextColor={COLORS.slate400}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton,
                rating === 0 ? styles.submitButtonDisabled : {}
              ]}
              disabled={rating === 0}
              onPress={() => router.back()} // Mock submission routing back
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>

            {/* Helper Footer Link */}
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>I had an issue that needs support</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    maxWidth: 448, // max-w-md equivalent
    width: '100%',
    alignSelf: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    flexGrow: 1,
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.slate500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 48,
  },
  starButton: {
    padding: 8,
  },
  feedbackContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate700,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    padding: 16,
    height: 120, // Approximates rows=4
    fontSize: 16,
    color: COLORS.slate900,
  },
  submitButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 9999, // fully rounded
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.slate300,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  footerLink: {
    paddingVertical: 8,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate500,
    textAlign: 'center',
  },
});
