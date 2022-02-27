import { Box, Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { animated, config, useSpring } from "@react-spring/web";
import { genPet, Pet, Species } from "pets/Pet";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import { AccountData } from "types";
import { http } from "utils";
import { petsFromDataPets } from "./AccountPage";


const possibleNames = [
	"Jerard", "Samuel", "Eugene"
];

const genRandomPet = () => {
	const species: Species = (() => {
		const rng = Math.random();
		if (rng < 0.5) return "snake-mon";
		return "slime";
	})();

	return genPet(species, possibleNames[Math.floor(Math.random() * possibleNames.length)]);
};

export default function PetPage() {

	const navigate = useNavigate();
	const [loading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);

	const [petOptions] = useState<Pet[]>([
		genPet("snake-mon", "Slizzy"), genPet("snake-mon", "Slinky"), genPet("snake-mon", "Slippy")
	]);

	const [pets, setPets] = useState<Pet[]>([]);

	const { width, height } = useWindowSize();


	useEffect(() => {
		http.get("me")
			.json<AccountData>()
			.then(res => setData(res))
			.catch(() => navigate("/login"));
	}, [navigate]);

	useEffect(() => {
		if (!data) return;

		setPets(petsFromDataPets(data.pets));
	}, [data, setPets]);

	const [pet] = useState<Pet>(genRandomPet());

	useEffect(() => {
		if (!pet) return;
		http.post("me/pet", {
			json: pet
		});
	}, [pet]);

	const [{y}] = useSpring(() => ({
		from: {
			y: "translateY(0vh)"
		},
		to: {
			y: "translateY(100vh)"
		},
		config: config.molasses,
		delay: 1000
	}));

	return (
		<Flex
			align={"center"}
			justify={"center"}
		>
			<Stack spacing={8} mt={10} mx={"auto"} w={"lg"} p={6}>
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
				<Button onClick={() => navigate("/")}>
					Continue
				</Button>
			</Stack>

			<animated.div className="Revealer" style={{transform: y}}  />
			<Confetti width={width} height={height} />
		</Flex>
	);
}

export const PetBlock = ({ pet, textBoxHeight = 220 }: { pet: Pet, textBoxHeight?: number }) => {
	return (
		<Box
			rounded={"lg"}
			bg={useColorModeValue("white", "gray.700")}
			boxShadow={"lg"}
			h="auto"
			p={8}
		>
			{pet.genUI(textBoxHeight)}
		</Box>
	);
};
