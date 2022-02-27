import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Button, Center, Flex, Heading, Spinner, Stack, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExercisesData } from "types";
import { http } from "utils";

export default function LearnOverviewPage() {
	const navigate = useNavigate();
	const maxW = useBreakpointValue({ base: "lg", md: "md", lg: "lg" });

	const [loading] = useState(true);
	const [data, setData] = useState<ExercisesData | undefined>(undefined);

	const cardBg = useColorModeValue("white", "gray.900");
	const title = useColorModeValue("gray.700", "white");

	useEffect(() => {
		http.get("me/exercise")
			.json<ExercisesData>()
			.then(res => setData(res))
			.catch(() => navigate("/login"));
	}, [navigate]);

	if (loading && !data) {
		return (
			<Flex alignContent="center" justifyContent="center" my={16}>
				<Spinner />
			</Flex>
		);
	}

	return (
		<Flex
			align={"center"}
			justify={"center"}
			flexDir="column"
		>
			<Center p={10} maxW="2xl">
				<Flex flexDir="column" textAlign="center" rowGap={8}>
					<Heading>
						Welcome to Slinky.codes!
					</Heading>
					<Text fontSize="lg">
						In this tutorial you'll become familiar with the basic concepts of Python unlocking your imagination and helping you build your own creative and unique ideas!
					</Text>
				</Flex>
			</Center>
			<Center py={6}>
				<Flex flexWrap="wrap" gap={8} justifyContent="center" m={4}>
					{data ? data.data.map((exercise, i) => (
						<Flex
							key={exercise.number}
							justifyContent="space-between"
							maxW={maxW}
							w="sm"
							direction="column"
							bg={cardBg}
							boxShadow={"2xl"}
							rounded={"md"}
							p={6}
						>
							<Stack>
								<Heading
									color={title}
									fontSize={"2xl"}
									fontFamily={"body"}>
									{exercise.number}. {exercise.title}
								</Heading>
								<Text color={"gray.500"}>
									{exercise.objective}
								</Text>
							</Stack>
							<Flex mt={4} justifyContent="space-between">
								{data.user.progress?.find(e => e.exerciseUUID === exercise.number)?.completed ? <Flex columnGap={2} alignItems="center" color="green.300">
									<CheckCircleIcon />
									<Text>Complete</Text>
									{data?.user?.progress?.some((entry) => entry.claimed && entry.exerciseUUID === i + 1) ? null : <Button onClick={()=>{
										// TODO: claim
										console.log(data);
										http.post("me/exercise/claim", {
											json: {number: exercise.number}
										});
										navigate("/unbox");
									}}>Claim Prize</Button>}
								</Flex> : <Flex columnGap={2} alignItems="center" color="red.300">
									<WarningIcon />
									<Text>Incomplete</Text>
								</Flex> }
								<Button
									onClick={() => navigate(`/learn/${exercise.number}`)}
								>
								Attempt
								</Button>
							</Flex>

						</Flex>
					)) : undefined}
				</Flex>
			</Center>
		</Flex>
	);
}
