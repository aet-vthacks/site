import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import {
	Avatar, Box, Button, Flex, Menu,
	MenuButton, MenuDivider, MenuItem, MenuList, Spinner,
	useToast
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountData } from "types";
import { http } from "utils";

export default function NavBar({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const toast = useToast();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);

	useEffect(() => {
		http.get("me")
			.json<AccountData>()
			.then(res => setData(res))
			.catch(() => setLoading(false));
	}, []);

	if (loading && !data) {
		return (
			<Flex alignContent="center" justifyContent="center" my={16}>
				<Spinner />
			</Flex>
		);
	}

	return (
		<>
			<Box bg="green.300" px={4}>
				<Flex h={16} alignItems={"center"} justifyContent={"flex-end"}>
					<Flex alignItems={"center"} textAlign={"end"}>
						{data ? (
							<Menu>
								<MenuButton
									as={Button}
									rounded={"full"}
									variant={"link"}
									cursor={"pointer"}
									minW={0}>
									<Avatar
										size={"sm"}
										name={`${data.name.first} ${data.name.last}`}
									/>
								</MenuButton>
								<MenuList>
									<MenuItem
										icon={<AtSignIcon />}
										onClick={() => navigate("/account")}
									>
										My Account
									</MenuItem>
									<MenuDivider />
									<MenuItem
										icon={<LockIcon />}
										color="red.400"
										onClick={() => http.get("logout")
											.then(() => {
												navigate("/account");
											})
											.catch(() => toast({
												title: "Uh Oh!",
												description: "An unknown error has occured",
												status: "error"
											}))}
									>
										Sign Out
									</MenuItem>
								</MenuList>
							</Menu>
						) : <>
							<Button
								variant="solid"
								onClick={() => navigate("/login")}
							>
							Sign In
							</Button>
						</>}
					</Flex>
				</Flex>
			</Box>

			<Box>
				{children}
			</Box>

		</>
	);
}
