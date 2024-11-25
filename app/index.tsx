import {
	Text,
	View,
	SafeAreaView,
	Platform,
	TouchableHighlight,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index() {
	const router = useRouter();

	const [coins, setCoins] = useState<number>(0);
	const [guessNumberLevel, setGuessNumberLevel] = useState<number>(1);
	const [guessSequenceLevel, setGuessSequenceLevel] = useState<number>(1);
	const [guessEquationLevel, setGuessEquationLevel] = useState<number>(1);

	useEffect(() => {
		const loadData = async () => {
			try {
				const guessNumberLevel = await AsyncStorage.getItem("guessNumberLevel");
				const guessSequenceLevel = await AsyncStorage.getItem(
					"guessSequenceLevel"
				);
				const guessEquationLevel = await AsyncStorage.getItem(
					"guessEquationLevel"
				);
				const storedCoins = await AsyncStorage.getItem("coins");

				// Safely parse and set state with explicit type checking
				setGuessNumberLevel(
					guessNumberLevel ? parseInt(guessNumberLevel, 10) : 1
				);
				setGuessSequenceLevel(
					guessSequenceLevel ? parseInt(guessSequenceLevel, 10) : 1
				);
				setGuessEquationLevel(
					guessEquationLevel ? parseInt(guessEquationLevel, 10) : 1
				);
				setCoins(storedCoins ? parseInt(storedCoins, 10) : 0);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};

		loadData();
	}, []);

	return (
		<SafeAreaView
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: "#083344",
			}}
		>
			<LinearGradient
				style={{
					width: "100%",
					height: "100%",
					paddingTop: Platform.OS === "android" ? 25 : 0,
				}}
				colors={["#155E75", "#083344"]}
			>
				<StatusBar hidden={true} style="auto" backgroundColor="#155e75" />

				{/* Header */}
				<View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginHorizontal: 20,
							marginTop: 20,
						}}
					>
						<View>
							<TouchableHighlight
								activeOpacity={0.6}
								underlayColor={"transparent"}
								onPress={() => console.log("Pressed!")}
							>
								<Image
									style={{
										width: 60,
										height: 70,
										zIndex: 1,
										marginLeft: 15,
									}}
									source={require("../assets/images/leaderBoardIcon.svg")}
									contentFit="contain"
								/>
							</TouchableHighlight>
						</View>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Image
								style={{
									width: 46,
									height: 46,
									zIndex: 2,
								}}
								source={require("../assets/images/coin.svg")}
								contentFit="contain"
							/>
							<View
								style={{
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									marginLeft: -20,
								}}
							>
								<Image
									style={{
										width: 100,
										height: 38,
									}}
									source={require("../assets/images/coinHolder.svg")}
									contentFit="fill"
								/>
								<Text
									style={{
										fontFamily: "petitCochon",
										zIndex: 2,
										marginTop: -30,
									}}
									className={"text-yellow-50 text-xl font-semibold pl-4"}
								>
									{coins}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Body */}
				<View
					style={{
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<Image
						style={{
							width: 200,
							height: 270,
						}}
						source={require("../assets/images/guessTheNumber.svg")}
						contentFit="contain"
					/>
				</View>

				{/* Buttons */}

				{/* Guess the number button */}

				<TouchableHighlight
					activeOpacity={0.6}
					underlayColor={"transparent"}
					onPress={() => router.push("/number")}
				>
					<View
						className="rounded-lg"
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							alignSelf: "center",
							width: 330,
							marginTop: 100,
						}}
					>
						<View
							style={{ height: 60, width: 262 }}
							className="flex flex-row justify-center items-center bg-cyan-400 rounded-l-lg"
						>
							<Text
								style={{ fontFamily: "handjetMedium" }}
								className="text-3xl text-cyan-950 mr-1"
							>
								Play
							</Text>
							<AntDesign name="caretright" size={20} color="#083344" />
						</View>

						<View
							style={{ height: 60, width: 65 }}
							className="bg-cyan-600 h-16 flex justify-center items-center  rounded-r-lg border-l-2 border-l-cyan-950"
						>
							<Text
								style={{ fontFamily: "handjet" }}
								className="text-center text-xl text-cyan-950"
							>
								Level {guessNumberLevel}
							</Text>
						</View>
					</View>
				</TouchableHighlight>
				{/* Guess Sequence Button */}
				<View
					style={{ width: 320 }}
					className="mt-5 flex flex-row justify-between items-center self-center"
				>
					<TouchableHighlight
						activeOpacity={0.6}
						underlayColor={"transparent"}
						onPress={() => router.push("/sequence")}
					>
						<View
							className="rounded-lg"
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View
								style={{ height: 60, width: 180 }}
								className="flex flex-row justify-start items-center bg-yellow-400 rounded-l-lg px-3"
							>
								<Image
									style={{
										width: 35,
										height: 35,
									}}
									source={require("../assets/images/sequence.svg")}
									contentFit="contain"
								/>
								<Text
									style={{ fontFamily: "handjetMedium" }}
									className="text-2xl text-yellow-950 pl-3"
								>
									Guess Sequence
								</Text>
							</View>

							<View
								style={{ height: 60, width: 65 }}
								className="bg-yellow-600 h-16 flex flex-row justify-center items-center  rounded-r-lg border-l-2 border-l-yellow-950"
							>
								<Text
									style={{ fontFamily: "handjet" }}
									className="text-center text-xl text-yellow-950"
								>
									Level {guessSequenceLevel}
								</Text>
							</View>
						</View>
					</TouchableHighlight>
					<View>
						<TouchableHighlight
							activeOpacity={0.6}
							underlayColor={"transparent"}
							onPress={() => console.log("Pressed!")}
						>
							<Image
								style={{
									width: 60,
									height: 60,
								}}
								source={require("../assets/images/settings.svg")}
								contentFit="cover"
							/>
						</TouchableHighlight>
					</View>
				</View>

				{/* Guess Equation Button */}
				<View
					style={{ width: 320 }}
					className="mt-5 flex flex-row justify-between items-center self-center"
				>
					<TouchableHighlight
						activeOpacity={0.6}
						underlayColor={"transparent"}
						onPress={() => router.push("/equation")}
					>
						<View
							className="rounded-lg"
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View
								style={{ height: 60, width: 180 }}
								className="flex flex-row justify-start items-center bg-yellow-400 rounded-l-lg px-3"
							>
								<Image
									style={{
										width: 35,
										height: 35,
									}}
									source={require("../assets/images/sum.svg")}
									contentFit="contain"
								/>
								<Text
									style={{ fontFamily: "handjetMedium" }}
									className="text-2xl text-yellow-950 pl-3"
								>
									Guess Equation
								</Text>
							</View>

							<View
								style={{ height: 60, width: 65 }}
								className="bg-yellow-600 h-16 flex flex-row justify-center items-center  rounded-r-lg border-l-2 border-l-yellow-950"
							>
								<Text
									style={{ fontFamily: "handjet" }}
									className="text-center text-xl text-yellow-950"
								>
									Level {guessEquationLevel}
								</Text>
							</View>
						</View>
					</TouchableHighlight>

					<View>
						<TouchableHighlight
							activeOpacity={0.6}
							underlayColor={"transparent"}
							onPress={() => console.log("Pressed!")}
						>
							<Image
								style={{
									width: 60,
									height: 60,
								}}
								source={require("../assets/images/star.svg")}
								contentFit="cover"
							/>
						</TouchableHighlight>
					</View>
				</View>
			</LinearGradient>
		</SafeAreaView>
	);
}
