import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { http } from "utils";
import { z } from "zod";

export default function LoginPage() {
	const bg = useColorModeValue("white", "gray.700");
	const nav = useColorModeValue("gray.50", "gray.800");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleEmailChange = (e: any) => setEmail(e.target.value);
	const handlePasswordChange = (e: any) => setPassword(e.target.value);

	const isEmailValid = z.string()
		.email()
		.safeParse(email).success;

	const isPasswordValid = z.string()
		.min(8)
		.safeParse(password).success;

	const isFormValid = isEmailValid && isPasswordValid
		&& email.length > 0
		&& password.length > 0;

	const navigate = useNavigate();
	const onSubmit = async () => {
		const { status } = await http.post("login", {
			json: {
				email,
				password
			}
		});

		if (status === 200) {
			navigate("/learn");
		}
	};

	http.get("me")
		.then(res => {
			if (res.status === 200) {
				navigate("/account");
			}
		})
		.catch(() => {});

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
						<FormControl id="email" isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								placeholder="john.doe@example.com"
								onChange={handleEmailChange}
							/>
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									placeholder="8+ Characters"
									onChange={handlePasswordChange}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
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
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500"
								}}>
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
