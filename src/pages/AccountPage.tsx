import { Button, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { makeSnake, Pet } from "pets/Pet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetBlock } from "./PetPage";

export default function AccountPage() {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		// http.get("me")
		// 	.then(res => {
		// 		if (res.status !== 200) {
		// 			navigate("/login");
		// 		}
		// 	})
		// 	.catch(() => navigate("/login"));

		onOpen();
	}, [navigate, onOpen]);

	const [pets, setPets] = useState<Pet[]>([
		makeSnake("Slizzy"), makeSnake("Slinky"), makeSnake("Slippy")
	]);

	return (
		<>
			<Flex
				alignItems={"center"}
				justifyContent={"center"}
				flexDirection={"row"}
			>
				{pets.map((pet, i) => 
					<Stack spacing={8} mx={"auto"} w={"lg"} p={6} key={`selection_${i}`}
						onClick={()=>{}}
					>
						<PetBlock pet={pet} />
						<Button>Select {pet.name}</Button>

					</Stack>
				)}
			</Flex>
		</>
	);
}
