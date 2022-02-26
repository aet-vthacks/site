import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "utils";

export default function AccountPage() {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		http.get("me")
			.then(res => {
				if (res.status !== 200) {
					navigate("/login");
				}
			})
			.catch(() => navigate("/login"));

		onOpen();
	}, [navigate, onOpen]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Pick your Companion!</ModalHeader>
					<ModalBody textAlign="center">
						Before you can get started on your Python journey, you need to pick your companion!
					</ModalBody>
					<Button variant='ghost'>Secondary Action</Button>

					<ModalFooter />
				</ModalContent>
			</Modal>
		</>
	);
}
