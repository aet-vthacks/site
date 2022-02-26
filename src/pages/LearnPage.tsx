import { Button, Flex, Heading, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import GFM from "remark-gfm";
import { ExerciseData } from "types";
import { http } from "utils";


export default function LearnPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	function handleEditorChange(value: string | undefined) {
		console.log("here is the current model value:", value);
	}

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ExerciseData | undefined>(undefined);

	useEffect(() => {
		http.get(`me/exercise/${id}`)
			.json<ExerciseData>()
			.then(res => setData(res))
			.catch(() => setLoading(false));
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
				<Flex>
					<Editor
						width="50vw"
						height="65vh"
						defaultLanguage="python"
						defaultValue={data?.exercise.shellCode}
						onChange={handleEditorChange}
					/>
					<Flex flexDir="column" p={4} maxW="50%">
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
