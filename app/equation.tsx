import {
	SafeAreaView,
	Text,
	View,
	Platform,
	TouchableHighlight,
	Modal,
	Pressable,
} from "react-native";
import { Image } from "expo-image";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundMusic from "@/components/BackgroundMusic";

// // Function to generate equations with context
// const generateEquation = (level: number) => {
// 	const maxNumber = level * 5 + 10; // Level affects the number range
// 	const A = Math.floor(Math.random() * maxNumber) + 1;
// 	const B = Math.floor(Math.random() * maxNumber) + 1;

// 	const equationSet = [
// 		{ question: `A = ${A}\nA + B = ${A + B}\nB = `, answer: B },
// 		{ question: `A = ${A}\nA - B = ${A - B}\nB = `, answer: B },
// 		{ question: `A = ${A}\nB = ${B}\nA + B = `, answer: A + B },
// 		{ question: `A = ${A}\nB = ${B}\nA - B = `, answer: A - B },
// 		{ question: `A = ${A}\nB = ${B}\nA * B = `, answer: A * B },
// 		{
// 			question: `A = ${A * B}\nB = ${B}\nA / B = `,
// 			answer: Math.floor((A * B) / B),
// 		},
// 	];

// 	// Randomly pick one equation
// 	const randomEquation =
// 		equationSet[Math.floor(Math.random() * equationSet.length)];
// 	return randomEquation;
// };

// Function to generate equations with context
const generateEquation = (level: number) => {
	// Level affects the number range
	const maxNumber = level * 5 + 10;

	// Generate random values for A and B
	const A = Math.floor(Math.random() * maxNumber) + 1;
	const B = Math.floor(Math.random() * maxNumber) + 1;

	const equationSet = [
		{ question: `A = ${A}\nA + B = ${A + B}\nB = `, answer: B }, // A + B = ?
		{ question: `A = ${A}\nA - B = ${A - B}\nB = `, answer: B }, // A - B = ?
		{ question: `A = ${A}\nB = ${B}\nA + B = `, answer: A + B }, // A + B = ?
		{ question: `A = ${A}\nB = ${B}\nA - B = `, answer: A - B }, // A - B = ?
		{ question: `A = ${A}\nB = ${B}\nA * B = `, answer: A * B }, // A * B = ?
		{
			question: `A = ${A * B}\nB = ${B}\nA / B = `,
			answer: (A * B) / B, // A * B / B = A
		}, // A / B = ?
		{
			question: `A = ${A}\nB = ${B}\n(A + B) * 2 = `,
			answer: (A + B) * 2, // (A + B) * 2 = ?
		}, // (A + B) * 2 = ?
		{
			question: `A = ${A}\nB = ${B}\n(A * B) - 5 = `,
			answer: A * B - 5, // (A * B) - 5 = ?
		}, // (A * B) - 5 = ?
		{
			question: `A = ${A}\nB = ${B}\n(A + B) / 2 = `,
			answer: (A + B) / 2, // (A + B) / 2 = ?
		}, // (A + B) / 2 = ?
		{
			question: `A = ${A}\nB = ${B}\n(A * B) + (A + B) = `,
			answer: A * B + (A + B), // (A * B) + (A + B) = ?
		}, // (A * B) + (A + B) = ?
	];

	// Randomly pick one equation
	const randomEquation =
		equationSet[Math.floor(Math.random() * equationSet.length)];

	return randomEquation;
};

const GuessEquation = () => {
	const router = useRouter();
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	const [roboFeedback, setRoboFeedback] = useState("");
	const [minLimit, setMinLimit] = useState(1);
	const [randomNumber, setRandomNumber] = useState<number>(0);
	const [question, setQuestion] = useState("");
	const [questionAnswer, setQuestionAnswer] = useState<number>(0);
	const [level, setLevel] = useState<number>(1);
	const [coins, setCoins] = useState<number>(0);
	const [coinsEarned, setCoinsEarned] = useState(0);
	const [xp, setXp] = useState<number>(0);
	const [xpEarned, setXpEarned] = useState(0);
	const [attempt, setAttempt] = useState(1);
	const [guess, setGuess] = useState("");

	const [showStory, setShowStory] = useState(false);
	const [complete, setComplete] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [levelUp, setLevelUp] = useState<boolean>(false);
	const [showLevelUp, setShowLevelUp] = useState(false);
	const [showRoboFeedback, setShowRoboFeedback] = useState(false);
	const [showInputBox, setShowInputBox] = useState(false);
	const [showNumberPad, setShowNumberPad] = useState(false);

	const [hintsAvailable, setHintsAvailable] = useState(2);
	const [showHint, setShowHint] = useState<boolean>(false);
	const [firstHint, setFirstHint] = useState("");
	const [secondHint, setSecondHint] = useState("");

	// AsyncStorage keys
	const LEVEL_KEY = "guessEquationLevel";
	const COINS_KEY = "coins";
	const XP_KEY = "guessEquationXp";

	useEffect(() => {
		const loadData = async () => {
			try {
				const storedLevel = await AsyncStorage.getItem(LEVEL_KEY);
				const storedCoins = await AsyncStorage.getItem(COINS_KEY);
				const storedXp = await AsyncStorage.getItem(XP_KEY);

				// Safely parse and set state with explicit type checking
				setLevel(storedLevel ? parseInt(storedLevel, 10) : 1);
				setCoins(storedCoins ? parseInt(storedCoins, 10) : 0);
				setXp(storedXp ? parseInt(storedXp, 10) : 0);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};

		loadData();
	}, []);

	// Save data to AsyncStorage when states change
	useEffect(() => {
		const saveData = async () => {
			try {
				await AsyncStorage.setItem(LEVEL_KEY, String(level));
				await AsyncStorage.setItem(COINS_KEY, String(coins));
				await AsyncStorage.setItem(XP_KEY, String(xp));
			} catch (error) {
				console.error("Error saving data:", error);
			}
		};

		saveData();
	}, [level, coins, xp]);

	//add Xp
	const addXp = (amount: number) => {
		setXp((prevXp) => {
			const newXp = prevXp + amount;

			if (newXp >= 5000) {
				setLevel((prevLevel) => prevLevel + 1);
				setLevelUp(true);

				return 0;
			}

			return newXp;
		});
	};

	// Add coins
	const addCoins = (amount: number) => {
		setCoins((prevCoins) => prevCoins + amount);
	};

	const appendNumber = (number: number | string) => {
		// Directly append the input to the guess, regardless of the type
		if (guess.length < 3) {
			setGuess((prev) => prev + number.toString());
		}
	};

	const deleteLastNumber = (): void => {
		setGuess((prevNumber) => prevNumber.slice(0, -1));
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowStory(true);
		}, 600);

		return () => clearTimeout(timer); // Cleanup timeout
	}, []);

	useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	return (
		<SafeAreaView
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: "#083344",
			}}
		>
			<BackgroundMusic />
			<LinearGradient
				style={{
					width: "100%",
					height: "100%",
					paddingTop: Platform.OS === "android" ? 25 : 0,
				}}
				colors={["#155E75", "#083344"]}
			>
				{/* story modal */}
				<Modal
					statusBarTranslucent={true}
					animationType="fade"
					transparent={true}
					visible={showStory}
					onRequestClose={() => {
						setShowStory(false);

						const { question, answer } = generateEquation(level);
						setQuestion(question);
						setQuestionAnswer(answer);
						setRoboFeedback(
							"Below is a math puzzle. Analyze the equation, solve it, and type your answer in the box."
						);
						setTimeout(() => {
							setShowRoboFeedback(true);
						}, 600);
						setTimeout(() => {
							setShowInputBox(true);
						}, 2000);
						setTimeout(() => {
							setShowNumberPad(true);
						}, 3000);
					}}
					style={{ margin: 0 }}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						}}
					>
						<View
							style={{
								width: 340,
								padding: 20,
								backgroundColor: "#f7fee7",
								borderRadius: 40,
								alignItems: "center",
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
							className="border-4 border-b-8 border-t-8 border-lime-900 p-3"
						>
							<View className="px-5 py-2 bg-lime-900 rounded-3xl -mt-12 border-4 border-gray-100">
								<Text
									style={{ fontFamily: "petitCochon" }}
									className="text-2xl text-gray-50 pt-2"
								>
									Guess the Number
								</Text>
							</View>

							<View className="bg-lime-200 p-2 mt-5 rounded-xl">
								<Image
									style={{
										width: 100,
										height: 100,
									}}
									source={require("../assets/images/boltLime.svg")}
									contentFit="contain"
								/>
							</View>

							<View className="p-2 mt-4">
								<Text
									style={{ fontFamily: "handjetMedium" }}
									className="text-2xl text-lime-900 text-center"
								>
									A clever robot named Bolt has created a tricky equation and is
									challenging you to solve it. Analyze the equation carefully
									and find the missing number.
								</Text>
							</View>

							<TouchableHighlight
								activeOpacity={0.6}
								underlayColor={"#a3e635"}
								onPress={() => {
									const { question, answer } = generateEquation(level);
									setQuestion(question);
									setQuestionAnswer(answer);
									setRoboFeedback(
										"Below is a math puzzle. Analyze the equation, solve it, and type your answer in the box."
									);
									setTimeout(() => {
										setShowRoboFeedback(true);
									}, 600);
									setTimeout(() => {
										setShowInputBox(true);
									}, 2000);
									setTimeout(() => {
										setShowNumberPad(true);
									}, 3000);
									setShowStory(false);
								}}
								className="bg-lime-500 px-24 py-3 flex items-center justify-center rounded-2xl mt-14 mb-5"
							>
								<Text
									style={{ fontFamily: "petitCochon" }}
									className="text-2xl text-lime-900 mt-2"
								>
									LET'S PLAY
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>

				{/* Game over modal */}
				<Modal
					statusBarTranslucent={true}
					animationType="fade"
					transparent={true}
					visible={gameOver}
					onRequestClose={async () => {
						const { sound } = await Audio.Sound.createAsync(
							require("../assets/sfx/replay.wav")
						);
						setSound(sound);
						await sound.playAsync();
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
						const { question, answer } = generateEquation(level);
						setQuestion(question);
						setQuestionAnswer(answer);
						setRoboFeedback(
							"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
						);
						setAttempt(1);
						setGuess("");
						setAttempt(1);

						setGameOver(false);
					}}
					style={{ margin: 0 }}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						}}
					>
						<View
							style={{
								width: 340,
								padding: 20,

								alignItems: "center",
								shadowColor: "#000",
								borderRadius: 50,
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
							className="bg-amber-50 border-4 border-b-8 border-t-8 border-amber-950"
						>
							{/* Header */}
							<View style={{ marginBottom: 0, alignItems: "center" }}>
								<Image
									style={{
										width: 300,
										height: 80,
										marginTop: 10,
									}}
									source={require("../assets/images/gameOver.svg")}
									contentFit="contain"
								/>
								<Text
									style={{
										fontFamily: "handjetMedium",
									}}
									className="text-3xl text-amber-950 text-center px-5 p-4"
								>
									You have to guess the number in three attempt. The correct
									number was:
								</Text>
							</View>

							{/* Body */}
							<View style={{ marginBottom: 20, alignItems: "center" }}>
								<Text
									style={{
										fontFamily: "handjetMedium",
									}}
									className="text-6xl text-amber-950 text-center px-5 p-4"
								>
									{questionAnswer}
								</Text>
							</View>

							{/* Footer with Buttons */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-evenly",
									width: "100%",
									marginBottom: 10,
								}}
							>
								{/* Home Button (Secondary with border) */}
								<TouchableHighlight
									activeOpacity={0.6}
									underlayColor={"transparent"}
									onPress={() => {
										setGameOver(false);
										router.push("/");
									}}
									style={{
										borderWidth: 2,

										paddingVertical: 12,
										paddingHorizontal: 20,

										justifyContent: "center",
										alignItems: "center",
									}}
									className="border-2 border-amber-700 rounded-lg"
								>
									<Text
										style={{
											fontFamily: "petitCochon",
											fontSize: 18,
										}}
										className="text-amber-700"
									>
										{"<"} HOME
									</Text>
								</TouchableHighlight>

								{/* Next Button (CTA with larger width) */}
								<TouchableHighlight
									activeOpacity={0.6}
									underlayColor={"#a3e635"}
									onPress={async () => {
										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/replay.wav")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Warning
										);
										const { question, answer } = generateEquation(level);
										setQuestion(question);
										setQuestionAnswer(answer);
										setRoboFeedback(
											"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
										);
										setGuess("");
										setAttempt(1);

										setGameOver(false);
									}}
									style={{
										paddingVertical: 12,
										paddingHorizontal: 30,

										justifyContent: "center",
										alignItems: "center",
										minWidth: 150,
									}}
									className="bg-lime-600 rounded-lg"
								>
									<Text
										style={{
											fontFamily: "petitCochon",
											fontSize: 18,
										}}
										className="text-lime-900 flex-row text-center items-center"
									>
										PLAY AGAIN {">"}
									</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</Modal>

				{/* Level Up modal */}
				<Modal
					statusBarTranslucent={true}
					animationType="fade"
					transparent={true}
					visible={showLevelUp}
					onShow={async () => {
						const { sound } = await Audio.Sound.createAsync(
							require("../assets/sfx/levelUp2.wav")
						);
						setSound(sound);
						await sound.playAsync();
					}}
					onRequestClose={async () => {
						const { sound } = await Audio.Sound.createAsync(
							require("../assets/sfx/replay.wav")
						);
						setSound(sound);
						await sound.playAsync();
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
						const { question, answer } = generateEquation(level);
						setQuestion(question);
						setQuestionAnswer(answer);
						setRoboFeedback(
							"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
						);
						setAttempt(1);

						setLevelUp(false);
						setShowLevelUp(false);
					}}
					style={{ margin: 0 }}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						}}
					>
						<View
							style={{
								width: 340,
								padding: 20,

								alignItems: "center",
								shadowColor: "#000",
								borderRadius: 50,
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
							className="bg-lime-50 border-4 border-b-8 border-t-8 border-lime-800"
						>
							{/* Header */}
							<View style={{ marginBottom: 0, alignItems: "center" }}>
								<Image
									style={{
										width: 340,
										height: 300,
										marginTop: -200,
									}}
									source={require("../assets/images/levelUp.svg")}
									contentFit="contain"
								/>
								<Text
									style={{
										fontFamily: "handjetBold",
									}}
									className="text-9xl text-lime-950 text-center"
								>
									{level}
								</Text>
							</View>

							{/* Body */}
							<View style={{ marginBottom: 20, alignItems: "center" }}>
								<Text
									style={{
										fontFamily: "handjetMedium",
									}}
									className="text-3xl text-lime-950 text-center px-5 p-4"
								>
									You've impressed Bolt by solving equations like a pro. The
									challenge just got tougher as you level up
								</Text>
							</View>

							{/* Footer with Buttons */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-evenly",
									width: "100%",
									marginBottom: 10,
								}}
							>
								<TouchableHighlight
									activeOpacity={0.6}
									underlayColor={"#84cc16"}
									onPress={async () => {
										const { question, answer } = generateEquation(level);
										setQuestion(question);
										setQuestionAnswer(answer);
										setRoboFeedback(
											"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
										);
										setLevelUp(false);
										setShowLevelUp(false);
										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/replay.wav")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Warning
										);
									}}
									style={{
										paddingVertical: 12,
										paddingHorizontal: 30,

										justifyContent: "center",
										alignItems: "center",
										minWidth: 150,
									}}
									className="bg-lime-600 rounded-lg"
								>
									<Text
										style={{
											fontFamily: "petitCochon",
											fontSize: 18,
										}}
										className="text-lime-900 flex-row text-center items-center"
									>
										WOO-HOO{"  >"}
									</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</Modal>

				{/* Complete modal */}
				<Modal
					statusBarTranslucent={true}
					animationType="fade"
					transparent={true}
					visible={complete}
					onRequestClose={async () => {
						if (levelUp) {
							setTimeout(() => {
								setShowLevelUp(true);
							}, 1000);
						}
						const { question, answer } = generateEquation(level);
						setQuestion(question);
						setQuestionAnswer(answer);
						setRoboFeedback(
							"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
						);
						setAttempt(1);

						const { sound } = await Audio.Sound.createAsync(
							require("../assets/sfx/replay.wav")
						);
						setSound(sound);
						await sound.playAsync();
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
						setComplete(false);
					}}
					style={{ margin: 0 }}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						}}
					>
						<View
							style={{
								width: 340,
								padding: 20,

								alignItems: "center",
								shadowColor: "#000",
								borderRadius: 50,
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}}
							className="bg-lime-50 border-4 border-b-8 border-t-8 border-lime-900"
						>
							{/* Header */}
							<View style={{ marginBottom: 0, alignItems: "center" }}>
								<Image
									style={{
										width: 300,
										height: 170,
										marginTop: -140,
									}}
									source={require("../assets/images/completed.svg")}
									contentFit="contain"
								/>
								<Text
									style={{
										fontFamily: "handjetMedium",
									}}
									className="text-3xl text-lime-950 text-center px-5 p-4"
								>
									You've cracked the equation in just {attempt} attempt
								</Text>
							</View>

							{/* Body */}
							<View style={{ marginBottom: 50, alignItems: "center" }}>
								<Text
									style={{
										fontFamily: "handjetMedium",
									}}
									className="text-3xl text-lime-950 text-center px-5 p-4"
								>
									You’ve earned
								</Text>

								<View className="flex-row items-center">
									<View className="border-2 border-lime-700 flex items-center justify-center h-24 w-24 rounded-lg mr-4">
										<Image
											style={{
												width: 40,
												height: 40,
											}}
											source={require("../assets/images/coins.svg")}
											contentFit="contain"
										/>
										<Text
											style={{ fontFamily: "handjetMedium" }}
											className="text-lime-950 text-2xl"
										>
											+{coinsEarned}
										</Text>
									</View>
									<View className="border-2 border-lime-700 flex items-center justify-center h-24 w-24 rounded-lg ml-4">
										<Image
											style={{
												width: 40,
												height: 40,
											}}
											source={require("../assets/images/xp.svg")}
											contentFit="contain"
										/>
										<Text
											style={{ fontFamily: "handjetMedium" }}
											className="text-lime-950 text-2xl"
										>
											+{xpEarned}
										</Text>
									</View>
								</View>
							</View>

							{/* Footer with Buttons */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-evenly",
									width: "100%",
									marginBottom: 10,
								}}
							>
								{/* Home Button (Secondary with border) */}
								<TouchableHighlight
									activeOpacity={0.6}
									underlayColor={"transparent"}
									onPress={() => {
										setComplete(false);
										router.push("/");
									}}
									style={{
										borderWidth: 2,

										paddingVertical: 12,
										paddingHorizontal: 20,

										justifyContent: "center",
										alignItems: "center",
									}}
									className="border-2 border-lime-700 rounded-lg"
								>
									<Text
										style={{
											fontFamily: "petitCochon",
											fontSize: 18,
										}}
										className="text-lime-700"
									>
										{"<"} HOME
									</Text>
								</TouchableHighlight>

								{/* Next Button (CTA with larger width) */}
								<TouchableHighlight
									activeOpacity={0.6}
									underlayColor={"#a3e635"}
									onPress={async () => {
										if (levelUp) {
											setTimeout(() => {
												setShowLevelUp(true);
											}, 1000);
										}

										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/replay.wav")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Warning
										);
										const { question, answer } = generateEquation(level);
										setQuestion(question);
										setQuestionAnswer(answer);
										setRoboFeedback(
											"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
										);
										setAttempt(1);
										setComplete(false);
									}}
									style={{
										paddingVertical: 12,
										paddingHorizontal: 30,

										justifyContent: "center",
										alignItems: "center",
										minWidth: 150,
									}}
									className="bg-lime-600 rounded-lg"
								>
									<Text
										style={{
											fontFamily: "petitCochon",
											fontSize: 18,
										}}
										className="text-lime-900 flex-row text-center items-center"
									>
										PLAY NEXT {">"}
									</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</Modal>

				{/* Header */}
				<View className="flex flex-row justify-evenly items-center pt-6">
					<TouchableHighlight
						activeOpacity={0.6}
						underlayColor={"transparent"}
						onPress={() => router.replace("/")}
					>
						<Image
							style={{
								width: 40,
								height: 40,
							}}
							source={require("../assets/images/home.svg")}
							contentFit="cover"
						/>
					</TouchableHighlight>

					<View className="flex flex-row justify-center items-center -mt-3">
						<View className="flex flex-col justify-center items-center">
							<Image
								style={{
									width: 40,
									height: 40,
									zIndex: 2,
								}}
								source={require("../assets/images/level.svg")}
								contentFit="contain"
							/>
							<Text
								style={{
									fontFamily: "petitCochon",
									zIndex: 3,
									marginTop: -28,
									textShadowColor: "#0E7490",
									textShadowOffset: { width: 20, height: 20 },
								}}
								className={"text-sky-50 text-base font-semibold"}
							>
								{level}
							</Text>
						</View>
						<View
							style={{ marginLeft: -18, paddingTop: 2 }}
							className="flex flex-col items-center justify-center "
						>
							<Image
								style={{
									width: 80,
									height: 30,
								}}
								source={require("../assets/images/levelHolder.svg")}
								contentFit="fill"
							/>
							<Progress.Bar
								progress={xp / 5000}
								width={50}
								color="#F0F9FF"
								unfilledColor="#0E7490"
								borderColor="#0E7490"
								height={10}
								style={{ marginTop: -22, marginLeft: 10 }}
							/>
						</View>
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
								width: 40,
								height: 40,
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
									width: 90,
									height: 30,
								}}
								source={require("../assets/images/coinHolder.svg")}
								contentFit="fill"
							/>
							<Text
								style={{ fontFamily: "petitCochon", zIndex: 2, marginTop: -25 }}
								className={"text-yellow-50 text-base font-semibold pl-4"}
							>
								{coins}
							</Text>
						</View>
					</View>

					<TouchableHighlight
						activeOpacity={0.6}
						underlayColor={"transparent"}
						onPress={async () => {
							const { question, answer } = generateEquation(level);
							setQuestion(question);
							setQuestionAnswer(answer);
							setRoboFeedback(
								"Below is a new math puzzle. Analyze the equation, solve it, and type your answer in the box."
							);
							setGuess("");
							setAttempt(1);

							const { sound } = await Audio.Sound.createAsync(
								require("../assets/sfx/replay.wav")
							);
							setSound(sound);
							await sound.playAsync();
							Haptics.notificationAsync(
								Haptics.NotificationFeedbackType.Success
							);
						}}
					>
						<Image
							style={{
								width: 40,
								height: 40,
							}}
							source={require("../assets/images/replay.svg")}
							contentFit="cover"
						/>
					</TouchableHighlight>
					<TouchableHighlight activeOpacity={0.6} underlayColor={"transparent"}>
						<Image
							style={{
								width: 40,
								height: 40,
							}}
							source={require("../assets/images/settings.svg")}
							contentFit="cover"
						/>
					</TouchableHighlight>
				</View>

				{/* Robot Dialouge */}
				{showRoboFeedback && (
					<View className=" flex flex-row justify-center items-center bg-cyan-700  mt-10 m-5 px-5 py-3 rounded-lg">
						<View>
							<Image
								style={{
									width: 70,
									height: 87,
									marginTop: -25,
								}}
								source={require("../assets/images/robot.svg")}
								contentFit="cover"
							/>
						</View>
						<View>
							<Text
								style={{
									fontFamily: "handjetMedium",
									marginLeft: 15,
									width: 240,
								}}
								className="text-cyan-50 text-2xl	"
							>
								{roboFeedback}
							</Text>
						</View>
					</View>
				)}

				{/* Input box */}
				{showInputBox && (
					<View className="flex flex-col items-end self-center mt-5">
						<View
							style={{ width: 330, height: 280 }}
							className="bg-cyan-50 border-4 border-cyan-700 rounded-2xl flex justify-center items-center"
						>
							<Text
								style={{ fontFamily: "handjetMedium" }}
								className="text-5xl font-semibold text-end text-cyan-950"
							>
								{question}

								<Text className="text-lime-700">{guess ? guess : "?"}</Text>
							</Text>
						</View>
					</View>
				)}

				{/* Keyboard */}
				{showNumberPad && (
					<View
						style={{
							position: "absolute",
							bottom: 0,
							width: "100%",
							backgroundColor: "#083344",
							padding: 10,
							paddingBottom: 25,
						}}
					>
						{/* Row 1 */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginVertical: 5,
							}}
						>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(1);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									1{" "}
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(2);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									2
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(3);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									3
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(0);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									0{" "}
								</Text>
							</TouchableHighlight>
						</View>

						{/* Row 2 */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginVertical: 5,
							}}
						>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(4);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									4
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(5);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									5
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(6);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									6
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#9f1239",
									borderRadius: 10,
								}}
								underlayColor="#f43f5e"
								onPress={async () => {
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
									deleteLastNumber();
								}}
								onLongPress={() => {
									setGuess("");
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									<FontAwesome6 name="delete-left" size={24} color="ECFEFF" />
								</Text>
							</TouchableHighlight>
						</View>

						{/* Row 3 */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginVertical: 5,
							}}
						>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								onLongPress={async () => {
									appendNumber(".");
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(7);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									7
									<Text
										style={{ fontFamily: "roboto" }}
										className="text-gray-300"
									>
										.
									</Text>
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(8);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									8
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#164E63",
									borderRadius: 10,
								}}
								onLongPress={async () => {
									appendNumber("-");
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
								underlayColor="#0E7490"
								onPress={async () => {
									appendNumber(9);
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									9
									<Text
										style={{ fontFamily: "roboto" }}
										className="text-gray-300"
									>
										{" "}
										-
									</Text>
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style={{
									flex: 1,
									margin: 5,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#4d7c0f",
									borderRadius: 10,
								}}
								underlayColor="#65a30d"
								onPress={async () => {
									const { sound } = await Audio.Sound.createAsync(
										require("../assets/sfx/ballTap.wav")
									);
									setSound(sound);
									await sound.playAsync();
									const usersGuess = parseInt(guess, 10);

									if (usersGuess === questionAnswer) {
										setXpEarned(500);
										addXp(500);
										if (attempt === 1) {
											setCoinsEarned(500 * level);
											addCoins(500 * level);

											const { sound } = await Audio.Sound.createAsync(
												require("../assets/sfx/win2.wav")
											);
											setSound(sound);
											await sound.playAsync();

											Haptics.notificationAsync(
												Haptics.NotificationFeedbackType.Success
											);
											setGuess("");
											setComplete(true);
										} else if (attempt === 2) {
											setCoinsEarned(250 * level);
											addCoins(250 * level);

											const { sound } = await Audio.Sound.createAsync(
												require("../assets/sfx/win2.wav")
											);
											setSound(sound);
											await sound.playAsync();
											Haptics.notificationAsync(
												Haptics.NotificationFeedbackType.Success
											);
											setGuess("");
											setComplete(true);
										} else if (attempt === 3) {
											setCoinsEarned(125 * level);
											addCoins(125 * level);

											const { sound } = await Audio.Sound.createAsync(
												require("../assets/sfx/win2.wav")
											);
											setSound(sound);
											await sound.playAsync();
											Haptics.notificationAsync(
												Haptics.NotificationFeedbackType.Success
											);
											setGuess("");
											setComplete(true);
										}
									} else if (attempt == 3) {
										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/gameOver.mp3")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Error
										);
										setGameOver(true);
									} else if (usersGuess > questionAnswer) {
										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/wrongAnswer.mp3")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Warning
										);
										setAttempt(attempt + 1);
										setRoboFeedback("The number is lower than your guess.");
										setGuess("");
									} else if (usersGuess < questionAnswer) {
										const { sound } = await Audio.Sound.createAsync(
											require("../assets/sfx/wrongAnswer.mp3")
										);
										setSound(sound);
										await sound.playAsync();
										Haptics.notificationAsync(
											Haptics.NotificationFeedbackType.Warning
										);
										setAttempt(attempt + 1);
										setRoboFeedback("The number is higher than your guess");
										setGuess("");
									}
								}}
							>
								<Text
									style={{
										fontFamily: "petitCochon",
										fontSize: 24,
										color: "#ECFEFF",
									}}
								>
									&#10003;
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				)}
			</LinearGradient>
		</SafeAreaView>
	);
};

export default GuessEquation;