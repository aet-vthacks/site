import { Box, Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { makeSnake, Pet } from "pets/Pet";
import { useState } from "react";

export default function PetTestingPage() {


	const [pet, setPet] = useState<Pet>(makeSnake("Slinky"));

	return (
		<Flex
			align={"center"}
			justify={"center"}
		>
			<Stack spacing={8} mx={"auto"} w={"lg"} p={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						{pet.name}
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						species: {pet.species}
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					{pet.genUI()}
				</Box>
				<Button onClick={() => {
					pet.triggerEmotionFunc?.("happy");
				}}>
					Happy
				</Button>
				<Button onClick={() => {
					pet.triggerEmotionFunc?.("surprised");
				}}>
					Surprised
				</Button>
				<Button onClick={() => {
					pet.triggerEmotionFunc?.("sad");
				}}>
					Sad
				</Button>
			</Stack>
		</Flex>
	);
}