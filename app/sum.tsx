import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ComingSoonScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#083344", // Background color
				alignItems: "center",
				justifyContent: "center",
				padding: 20,
			}}
		>
			{/* Title */}
			<Text
				style={{
					fontSize: 36,
					fontWeight: "bold",
					color: "#FFD700", // Golden yellow for contrast
					marginBottom: 20,
				}}
			>
				Coming Soon!
			</Text>

			{/* Subtitle */}
			<Text
				style={{
					fontSize: 18,
					color: "#FFFFFF", // White for readability
					textAlign: "center",
					marginBottom: 30,
				}}
				className="px-4"
			>
				This Game will be shiped shortly.
			</Text>

			{/* Back Button */}
			<TouchableOpacity
				onPress={() => {
					router.push("/");
				}}
				style={{
					backgroundColor: "#FFD700", // Golden yellow for contrast
					paddingVertical: 12,
					paddingHorizontal: 24,
					borderRadius: 8,
				}}
			>
				<Text
					style={{
						fontSize: 16,
						color: "#083344", // Dark teal for button text
						fontWeight: "600",
					}}
				>
					Back to Menu
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ComingSoonScreen;
