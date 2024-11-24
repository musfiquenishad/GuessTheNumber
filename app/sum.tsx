import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const generatePuzzle = (level: number) => {
	// Increase the difficulty based on the level
	const maxNum = 10 + level * 5; // Increase the number range with each level
	const operations = ["+", "-", "*", "/"];
	const operation = operations[Math.floor(Math.random() * operations.length)];

	const num1 = Math.floor(Math.random() * maxNum) + 1;
	const num2 = Math.floor(Math.random() * maxNum) + 1;

	let equation = "";
	let answer = 0;

	switch (operation) {
		case "+":
			equation = `${num1} + ? = ${num1 + num2}`;
			answer = num2;
			break;
		case "-":
			equation = `${num1} - ? = ${num2}`;
			answer = num1 - num2;
			break;
		case "*":
			equation = `${num1} * ? = ${num1 * num2}`;
			answer = num2;
			break;
		case "/":
			// To ensure we have integer results, we make the first number a multiple of num2
			equation = `${num1 * num2} / ? = ${num1}`;
			answer = num2;
			break;
		default:
			break;
	}

	return { equation, answer };
};

const MathPuzzleGame = () => {
	const [userAnswer, setUserAnswer] = useState<string>("");
	const [puzzle, setPuzzle] = useState<any>(generatePuzzle(1)); // Start at level 1
	const [feedback, setFeedback] = useState<string>("");
	const [coins, setCoins] = useState<number>(0);
	const [xp, setXp] = useState<number>(0);
	const [level, setLevel] = useState<number>(1);

	// Function to check the answer and update XP, coins, and level
	const checkAnswer = () => {
		if (parseInt(userAnswer) === puzzle.answer) {
			setFeedback("Correct! Well done.");
			setCoins(coins + 10); // Award coins
			setXp(xp + 50); // Award XP

			// Check if the user has enough XP to level up
			if (xp + 50 >= level * 100) {
				// Increase XP requirement with each level
				setLevel(level + 1);
			}

			setPuzzle(generatePuzzle(level)); // Generate a new puzzle based on the current level
		} else {
			setFeedback(`Oops! The correct answer was ${puzzle.answer}.`);
		}
		setUserAnswer("");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Math Puzzle Game</Text>
			<Text style={styles.puzzle}>{puzzle.equation}</Text>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Enter your answer"
				value={userAnswer}
				onChangeText={setUserAnswer}
			/>
			<Button title="Check Answer" onPress={checkAnswer} />
			<Text style={styles.feedback}>{feedback}</Text>
			<Text style={styles.stats}>Coins: {coins}</Text>
			<Text style={styles.stats}>XP: {xp}</Text>
			<Text style={styles.stats}>Level: {level}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	puzzle: {
		fontSize: 24,
		fontWeight: "500",
		marginVertical: 20,
	},
	input: {
		width: 200,
		textAlign: "center",
		fontSize: 18,
		borderBottomWidth: 1,
		marginVertical: 10,
	},
	feedback: {
		fontSize: 18,
		color: "green",
		marginVertical: 10,
	},
	stats: {
		fontSize: 18,
	},
});

export default MathPuzzleGame;
