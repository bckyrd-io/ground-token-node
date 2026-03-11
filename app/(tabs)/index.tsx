import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome To Ground Token</Text>
			<Text style={styles.subtitle}>
				Discover amazing play locations and activities near you!
			</Text>

			{/* Optional: Add an image or carousel to showcase features */}
			<Image
				source={require('@/assets/images/play.png')}
				style={styles.image}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push('/LoginScreen')}
			>
				<Text style={styles.buttonText}>Log In</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, styles.secondaryButton]}
				onPress={() => router.push('/RegisterScreen')}
			>
				<Text style={[styles.buttonText, styles.secondaryButtonText]}>
					Sign Up
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#f9f9f9',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#4CAF50',
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: '#555',
		textAlign: 'center',
		marginBottom: 24,
	},
	image: {
		width: '100%',
		height: 200,
		marginBottom: 32,
	},
	button: {
		backgroundColor: '#4CAF50',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 16,
		width: '100%',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FFC107',
	},
	secondaryButtonText: {
		color: '#FFC107',
	},
});
