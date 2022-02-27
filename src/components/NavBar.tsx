import { ArrowLeftIcon, AtSignIcon, LockIcon } from "@chakra-ui/icons";
import {
	Avatar, Box, Button, Flex, Image, Menu,
	MenuButton, MenuDivider, MenuItem, MenuList, Spinner,
	useToast
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountData } from "types";
import { http } from "utils";

export default function NavBar({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const location = useLocation();
	const toast = useToast();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);
	// const [submitButtonFunc] = useContext(SubmitButtonContext);

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

	const navHeight = location.pathname.startsWith("/learn/") ? 10 : 14;
	const iconScale = location.pathname.startsWith("/learn/") ? 6 : 8;
	const overflow = location.pathname.startsWith("/learn/") ? "hidden" : "initial";

	return (
		<Box h="100vh" w="100vw" overflowY={overflow} overflowX="hidden">
			<Box bg="green.300" px={4}>
				<Flex h={navHeight} alignItems={"center"} justifyContent={"space-between"}>
					<Flex alignItems={"center"} textAlign={"end"}>
						{location.pathname.startsWith("/learn/") ? (
							<>
								<Button
									size="sm"
									leftIcon={<ArrowLeftIcon />}
									onClick={() => navigate("/")}
									color="gray.800"
								>
									Back to Learn
								</Button>
							</>
						) : <Button
							variant="unstyled"
							onClick={() => navigate("/")}
						>
							<Image src="/safari-pinned-tab.svg" h={iconScale} w="auto" />
						</Button>}
					</Flex>
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
										size="sm"
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
			{children}
		</Box>
	);
}
