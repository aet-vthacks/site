import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { http } from "utils";

export default function LoginPage() {
	const bg = useColorModeValue("white", "gray.700");
	const nav = useColorModeValue("gray.50", "gray.800");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleUsernameChange = (e: any) => setUsername(e.target.value);
	const handlePasswordChange = (e: any) => setPassword(e.target.value);

	const isFormValid = username.length > 3 && password.length > 6;

	const navigate = useNavigate();
	const onSubmit = async () => {
		const { status } = await http.post("login", {
			json: {
				username,
				password
			}
		});

		if (status === 200) {
			navigate("/");
		}
	};

	useEffect(() => {
		http.get("me")
			.then(res => {
				if (res.status === 200) {
					navigate("/account");
				}
			})
			.catch(() => {});
	}, [navigate]);

	return (
		<Flex
			bg={nav}
			align={"center"}
			justify={"center"}
		>
			<Stack spacing={8} mx={"auto"} w={"lg"} p={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Welcome Back
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						Your pet missed you 🐍
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={bg}
					boxShadow={"lg"}
					p={8}>
					<Stack spacing={4}>
						<FormControl id="username" isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={username}
								placeholder="slippy777"
								onChange={handleUsernameChange}
							/>
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									placeholder="Enter your password"
									onChange={handlePasswordChange}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant="ghost"
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								isDisabled={!isFormValid}
								onClick={onSubmit}
								size="lg"
								colorScheme="green"
							>
								Login
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Not signed up?
								{" "}
								<Link
									as={RouterLink}
									color={"blue.400"}
									to='/signup'
								>Sign Up</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
