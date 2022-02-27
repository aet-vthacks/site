import { Button, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { genPet, Pet, Rarity, Species } from "pets/Pet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountData } from "types";
import { http } from "utils";
import { PetBlock } from "./PetPage";

export default function AccountPage() {
	const navigate = useNavigate();
	const [loading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);

	const [petOptions] = useState<Pet[]>([
		genPet("snake-mon", "Slizzy"), genPet("snake-mon", "Slinky"), genPet("snake-mon", "Slippy")
	]);

	const [pets, setPets] = useState<Pet[]>([]);

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

	if (loading && !data) {
		return (
			<Flex alignContent="center" justifyContent="center" my={16}>
				<Spinner />
			</Flex>
		);
	}

	return (
		<>
			{(!data?.pets || data.pets.length === 0) ? (
				<Flex
					alignItems={"center"}
					justifyContent={"center"}
					flexDirection={"row"}
				>
					{petOptions.map((pet, i) =>
						<Stack spacing={8} mx={"auto"} w={"lg"} p={6} key={`selection_${i}`}>
							<PetBlock pet={pet} />
							<Button
								onClick={() => {
									http.post("me/pet", {
										json: pet
									});
								}}
							>Select {pet.name}</Button>
						</Stack>
					)}
				</Flex>
			) :
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
						flexDirection={"row"}
					>
						{pets.map((pet: Pet, i: number) =>
							<Stack spacing={8} mx={"auto"} w={"lg"} p={6} key={`selection_${i}`} onClick={()=>{
								console.log("sent change", i);
								http.post("me/pet/change", {
									json: {position: i}
								});
							}}>
								<PetBlock pet={pet} />
								<Text>{pet.name}</Text>
							</Stack>
						)}
					</Flex>}
		</>
	);
}

// TODO: fix types
export const petsFromDataPets = (pets: any) => {
	return pets.map((petData: any) => new Pet(petData.name, petData.species as Species, petData.rarity as Rarity, petData.colors.map((elem: any) => elem === undefined ? null : elem)));
};
