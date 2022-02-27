import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { genSpeciesColors, Pet } from "pets/Pet";
import { useState } from "react";
import { PetBlock } from "./PetPage";

export default function HomePage() {
	const [pet] = useState<Pet>(new Pet("Slinky", "snake-mon", "common", genSpeciesColors("snake-mon", "common", 0)));

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
