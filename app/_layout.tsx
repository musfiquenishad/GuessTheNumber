import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";
import "../global.css";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const [loaded, error] = useFonts({
		petitCochon: require("../assets/fonts/Petit-Cochon.ttf"),
		handjet: require("../assets/fonts/Handjet.ttf"),
		handjetLight: require("../assets/fonts/Handjet-Light.ttf"),
		handjetMedium: require("../assets/fonts/Handjet-Medium.ttf"),
		handjetSemibold: require("../assets/fonts/Handjet-SemiBold.ttf"),
		handjetBold: require("../assets/fonts/Handjet-Bold.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			{/* Optionally configure static options outside the route.*/}
			<Stack.Screen name="index" />
			<Stack.Screen name="number" />
			<Stack.Screen name="sequence" />
			<Stack.Screen name="equation" />
			<Stack.Screen name="leaderboard" />
		</Stack>
	);
}
