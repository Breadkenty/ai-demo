import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import { CircularProgress, PaletteColorOptions, ThemeProvider, createTheme } from '@mui/material';

export default function Home() {
	const [userInput, setUserInput] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const [loading, setLoading] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const completeResponse = async (userInput: string) => {
		await setLoading(true);

		const gptResponse = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: userInput }],
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
				},
			}
		);

		await setAiResponse(gptResponse.data.choices[0].message.content);
		await setUserInput('');
		await setLoading(false);
	};

	const theme = createTheme({
		palette: {
			primary: {
				main: '#fafafa',
			},
		},
	});

	useEffect(() => {
		if (!loading) {
			inputRef.current?.focus();
		}
	}, [loading]);

	return (
		<main className={styles.main}>
			<ThemeProvider theme={theme}>
				<input
					placeholder="Type in your message then press enter"
					ref={inputRef}
					className={styles.userInput}
					value={userInput}
					disabled={loading}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							completeResponse(userInput);
						}
					}}
					onChange={(event) => setUserInput(event.target.value)}
				/>
				{loading ? <CircularProgress color="primary" size="1rem"/> : <h2 className={styles.aiResponse}>{aiResponse}</h2>}
			</ThemeProvider>
		</main>
	);
}
