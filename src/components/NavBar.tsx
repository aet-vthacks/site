import {
	Avatar, Box, Button, Flex, Link, Menu,
	MenuButton, MenuDivider, MenuItem, MenuList, Spinner, useColorModeValue
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { AccountData } from "types";
import { http } from "utils";

export default function NavBar({ children }: { children: ReactNode }) {
	const background = useColorModeValue("gray.100", "gray.900");
	const link = useColorModeValue("gray.200", "gray.700");

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<AccountData | undefined>(undefined);

	http.get("me")
		.json<AccountData>()
		.then(res => setData(res))
		.catch(() => setLoading(false));

	if (loading && !data) {
		return (
			<Flex alignContent="center" justifyContent="center" my={16}>
				<Spinner />
			</Flex>
		);
	}

	return (
		<>
			<Box bg={background} px={4}>
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
									<MenuItem>My Account</MenuItem>
									<MenuDivider />
									<MenuItem color="red">Sign Out</MenuItem>
								</MenuList>
							</Menu>
						) : <Link
							px={4}
							py={2}
							rounded={"md"}
							_hover={{
								textDecoration: "none",
								bg: link
							}}
							href={"/login"}>
									Sign In
						</Link>}
					</Flex>
				</Flex>
			</Box>

			<Box>
				{children}
			</Box>

		</>
	);
}
