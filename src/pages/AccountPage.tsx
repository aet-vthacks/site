import { Button, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { makeSnake, Pet } from "pets/Pet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountData } from "types";
import { http } from "utils";
import { PetBlock } from "./PetPage";

export default function AccountPage() {
	const navigate = useNavigate();
	const [loading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);

	const [pets] = useState<Pet[]>([
		makeSnake("Slizzy"), makeSnake("Slinky"), makeSnake("Slippy")
	]);

	useEffect(() => {
		http.get("me")
			.json<AccountData>()
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
		<>
			{(!data?.pets || data.pets.length === 0) ? (
				<Flex
					alignItems={"center"}
					justifyContent={"center"}
					flexDirection={"row"}
				>
					{pets.map((pet, i) =>
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
			) : <Text>Account</Text>}
		</>
	);
}
