import React, { useEffect, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const BackgroundMusic = () => {
	const sound = useRef<Audio.Sound | null>(null);

	const playMusic = async () => {
		if (sound.current) {
			await sound.current.unloadAsync(); // Unload any previous instance
		}

		// Load and play the music
		const { sound: loadedSound } = await Audio.Sound.createAsync(
			require("../assets/music/solve-the-riddle-140001.mp3")
		);
		sound.current = loadedSound;

		await sound.current.setVolumeAsync(0.2); // Set lower volume
		await sound.current.playAsync(); // Start playing the music
		await sound.current.setIsLoopingAsync(true); // Loop the music
	};

	useFocusEffect(
		useCallback(() => {
			playMusic(); // Play/restart music when the screen is focused

			return () => {
				if (sound.current) {
					sound.current.stopAsync(); // Stop music when the screen loses focus
				}
			};
		}, [])
	);

	useEffect(() => {
		// Cleanup to unload sound when the component unmounts
		return () => {
			if (sound.current) {
				sound.current.unloadAsync();
			}
		};
	}, []);

	return <View style={styles.container} />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
});

export default BackgroundMusic;
