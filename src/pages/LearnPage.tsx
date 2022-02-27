import { Button, Center, Flex, Heading, Spacer, Spinner, Stack, Text, useColorMode } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import GFM from "remark-gfm";
import { CodeData, ExerciseData, FailedRaw, SuccessfulRaw } from "types";
import { http } from "utils";


export default function LearnPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { colorMode } = useColorMode();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ExerciseData | undefined>(undefined);

	const [codeLoading, setCodeLoading] = useState(false);
	const [code, setCode] = useState<CodeData | undefined>(undefined);

	function handleEditorChange(value: string | undefined) {
		if (!value) {
			return;
		}

		setCodeLoading(true);

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
							navigate("/learn");
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
				<Flex maxH="100%" overflowY="hidden">
					<Flex flexDir="column" maxW="60%" borderRight="1px">
						<Editor
							width="60vw"
							height="60vh"
							loading={<Center>
								<Spinner />
							</Center>}
							theme={colorMode === "light" ? "light" : "vs-dark"}
							defaultLanguage="python"
							defaultValue={data?.exercise.shellCode}
							onChange={handleEditorChange}
						/>
						<Flex bg="gray.700" h="30vh" p={4} fontFamily="monospace" fontSize={16} justifyContent="space-between">
							<Text color="white">
								{"> "}{code?.data.map(c => {
									if (c.raw.success) {
										const raw = c.raw as SuccessfulRaw;
										return raw.stdout;
									}

									const raw = c.raw as FailedRaw;
									return (
										<Flex key="error" color="red.400" flexDir="column">
											<Text mb={4}>{raw.message}</Text>
											<Text>{raw.trace}</Text>
											<Text ml={8}>{raw.error}</Text>
										</Flex>
									);
								})}
							</Text>
							{codeLoading ? (
								<Spinner color="white" />
							) : undefined}
						</Flex>
					</Flex>
					<Flex flexDir="column" p={8} maxW="40%" h="100%" overflowY="scroll">
						<ReactMarkdown
							remarkPlugins={[GFM]}
							rehypePlugins={[rehypeHighlight]}
							components={ChakraUIRenderer()}
						>
							{data.exercise.markdown.replaceAll("{{TITLE}}", data.exercise.title)
								.replaceAll("{{OBJECTIVE}}", data.exercise.objective)
								.replaceAll("<br>", "\n\n")}
						</ReactMarkdown>
					</Flex>
				</Flex>
			) : undefined}
		</>
	);
}
