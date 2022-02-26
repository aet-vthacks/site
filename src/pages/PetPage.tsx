import { Box, Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { genPet, Pet } from "pets/Pet";
import { useState } from "react";

export default function PetPage() {

	const [pet] = useState<Pet>(genPet("slime", "Slimy"));

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
					<Text fontSize={"lg"} color={"gray.600"}>
						rarity: {pet.rarity}
					</Text>
				</Stack>
				<PetBlock pet={pet} />
				<Button onClick={() => {
					pet.triggerEmotionFunc("happy");
				}}>
					Happy
				</Button>
				<Button onClick={() => {
					pet.triggerEmotionFunc("surprised");
				}}>
					Surprised
				</Button>
				<Button onClick={() => {
					pet.triggerEmotionFunc("sad");
				}}>
					Sad
				</Button>
				<Button onClick={() => {
					pet.triggerEmotionFunc("talk");
				}}>
					Talk
				</Button>
			</Stack>
		</Flex>
	);
}

export const PetBlock = ({ pet }: { pet: Pet }) => {
	return (
		<Box
			rounded={"lg"}
			bg={useColorModeValue("white", "gray.700")}
			boxShadow={"lg"}
			h="auto"
			p={8}
		>
			{pet.genUI()}
		</Box>
	);
};