/* eslint-disable unicorn/prefer-at */
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Heading, Spacer, Spinner, Stack, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Editor, { useMonaco } from "@monaco-editor/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { PetBlock } from "pages/PetPage";
import { Pet } from "pets/Pet";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import GFM from "remark-gfm";
import { CodeData, ExerciseData, FailedRaw, SuccessfulRaw } from "types";
import { http } from "utils";
import { v4 } from "uuid";
import { petsFromDataPets } from "./AccountPage";

export default function LearnPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { colorMode } = useColorMode();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ExerciseData | undefined>(undefined);

	const [codeLoading, setCodeLoading] = useState(false);
	const [code, setCode] = useState<CodeData | undefined>(undefined);

	const [text, setText] = useState("");
	const [submit, setSubmit] = useState(false);

	const color = useColorModeValue("white", "gray.700");
	const background = useColorModeValue("gray.500", "gray.800");

	const [pet, setPet] = useState<Pet | undefined>(undefined);

	function handleEditorChange(value: string | undefined) {
		if (!value) {
			return;
		}

		setText(value);
		setCodeLoading(true);

		http.post(`me/exercise/${id}/save`, {
			json: {
				completed: code?.data[0].status,
				status: code?.data[0].raw,
				code: value
			}
		});

		http.post("code", {
			json: {
				number: id,
				code: value
			}
		})
			.json<CodeData>()
			.then(res => {
				setCode(res);
				setCodeLoading(false);
			})
			.catch(() => setCodeLoading(false));
	}

	useEffect(() => {
		http.get(`me/exercise/${id}`)
			.json<ExerciseData>()
			.then(res => setData(res))
			.catch(() => setLoading(false));

		http.get("me")
			.then(res => {
				if (res.status !== 200) {
					navigate("/login");
				}
			})
			.catch(() => navigate("/login"));
	}, [id, navigate]);

	useEffect(() => {
		if (!(data?.user?.pets)) return;
		setPet(petsFromDataPets(data.user.pets)[data.user.preferredPet]);
	}, [data]);


	const monaco = useMonaco();
	monaco?.editor.defineTheme("dark", {
		base: "vs-dark",
		inherit: true,
		rules: [],
		colors: {
			"editor.background": "#2D3748"
		}
	});

	if (!id) {
		return <Text>Not Found</Text>;
	}

	if (loading && !data) {
		return (
			<Flex alignContent="center" justifyContent="center" my={16}>
				<Spinner />
			</Flex>
		);
	}

	if (!loading && !data) {
		return (
			<Flex alignContent="center" alignItems="center" my={16} flexDir="column">
				<Heading>We couldn't find the Exercise.</Heading>
				<Text>Lost? Click the button below to go back.</Text>
				<Spacer />
				<Stack spacing={16} pt={2}>
					<Button
						my={8}
						onClick={() => {
							navigate("/");
						}}
						size="lg"
						variant="outline"
						colorScheme="green"
					>
						Go back
					</Button>
				</Stack>
			</Flex>
		);
	}

	return (
		<>
			{data ? (
				<Flex h="100vh" gap={1.5} p={1.5} bg={background}>
					<Flex flex={3} gap={1.5} flexDir="column">
						<Box flex={4} rounded="lg" overflow="hidden"
							bg={color}
						>
							<Editor
								height="100%"
								options={{
									wordWrap: "on",
									minimap: {
										enabled: false
									},
									fontSize: 16
								}}
								loading={<Center>
									<Spinner />
								</Center>}
								theme={colorMode === "light" ? "light" : "dark"}
								defaultLanguage="python"
								defaultValue={`# Objective: ${data.exercise.objective}\n# =====\n\n${data.exercise.shellCode}`}
								onChange={handleEditorChange} />
						</Box>
						<Flex columnGap={1.5} flex={3}>
							<Flex
								bg="gray.700"
								flex={5}
								rounded="lg"
								p={4}
								fontFamily="monospace"
								justifyContent="space-between"
							>
								<Stack fontSize="sm" overflow="hidden"> {/* CONSOLE */}
									<Text color="gray.400">Python Output {">"}</Text>
									<Text color="white">
										{code?.data.map(c => {
											console.log(code);
											if (c.raw.success) {

												const raw = c.raw as SuccessfulRaw;
												return raw.stdout.split("\n")
													.map(v => {
														return <Text key={v4()}>{v}</Text>;
													});
											}

											const raw = c.raw as FailedRaw;
											return (
												<Flex key={v4()} color="red.400" flexDir="column">
													<Text mb={4}>{raw.message}</Text>
													<Text>{raw.trace}</Text>
													<Text ml={8}>{raw.error}</Text>
												</Flex>
											);
										})}
									</Text>
									{code ? code.data.map(entry =>
										(!entry.status ? <Text color="#FF4141" >{entry.reason}</Text> : null)
									) : null}
								</Stack>
								{codeLoading ? (
									<Spinner color="white" />
								) : <Button
									size="sm"
									rightIcon={<CheckCircleIcon />}
									variant="solid"
									onClick={() => {
										setSubmit(true);
										http.post("code", {
											json: {
												number: id,
												code: text
											}
										})
											.json<CodeData>()
											.then(res => {
												let truthy = true;
												for (const data of res.data) {
													if (!data.status) {
														truthy = false;
													}
												}

												if (truthy) {
													http.post(`me/exercise/${id}/save`, {
														json: {
															completed: true,
															status: code?.data[0].raw,
															code: text
														}
													});

													pet?.triggerEmotionFunc("happy");
													setTimeout(() => {
														navigate("/");
													}, 3000);
												} else {
													// failed submission
													const rng = Math.random();
													if (rng < 0.5) {
														pet?.triggerEmotionFunc("sad");
													} else if (rng < 0.8) {
														pet?.triggerEmotionFunc("surprised");
													} else {
														pet?.speakFunc("Uh oh, it looks like you had an error!", 5);
													}
												}
											})
											.catch(() => setCodeLoading(false));
									}}
								>
								Submit
								</Button>}
							</Flex>
							<Box flex={3} rounded="lg">
								{pet ?
										<PetSegment pet={pet} /> : null}
							</Box>
						</Flex>
					</Flex>
					<Box bg={color} flex={2} px={4} rounded="lg" overflowY="scroll" maxH="94%">
						<ReactMarkdown
							remarkPlugins={[GFM]}
							rehypePlugins={[rehypeHighlight]}
							components={ChakraUIRenderer()}
						>
							{data.exercise.markdown
								.replaceAll("{{NUMBER}}", data.exercise.number.toString())
								.replaceAll("{{TITLE}}", data.exercise.title)
								.replaceAll("{{OBJECTIVE}}", data.exercise.objective)}
						</ReactMarkdown>
					</Box>
				</Flex>
			) : undefined}
		</>
	);
}


export const PetSegment = ({pet}: {pet: Pet}) => {
	return (
		<PetBlock pet={pet} textBoxHeight={150} />
	);
};
