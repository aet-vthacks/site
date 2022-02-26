import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box, Button, Flex, FormControl,
	FormLabel, Heading, HStack, Input,
	InputGroup, InputRightElement, Link, Stack, Text,
	useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { http } from "utils";
import { z } from "zod";

export default function SignupPage() {
	const nav = useColorModeValue("gray.50", "gray.800");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleEmailChange = (e: any) => setEmail(e.target.value);
	const handlePasswordChange = (e: any) => setPassword(e.target.value);
	const handleFirstnameChange = (e: any) => setFirstname(e.target.value);
	const handleLastnameChange = (e: any) => setLastname(e.target.value);

	const isEmailValid = z.string()
		.email()
		.safeParse(email).success;

	const isPasswordValid = z.string()
		.min(8)
		.safeParse(password).success;

	const isFormValid = isEmailValid && isPasswordValid
		&& email.length > 0
		&& password.length > 0
		&& firstname.length > 0
		&& lastname.length > 0;

	const navigate = useNavigate();
	const onSubmit = async () => {
		const { status } = await http.post("signup", {
			json: {
				firstname,
				lastname,
				email,
				password
			}
		});

		if (status === 200) {
			navigate("/account");
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
			<Stack spacing={8} mx={"auto"} maxW={"lg"} p={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						Get started with Learn.py 🐍
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl id="firstName" isRequired>
									<FormLabel>First Name</FormLabel>
									<Input
										type="text"
										value={firstname}
										placeholder="John"
										onChange={handleFirstnameChange}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="lastName" isRequired>
									<FormLabel>Last Name</FormLabel>
									<Input
										type="text"
										value={lastname}
										placeholder="Doe"
										onChange={handleLastnameChange}
									/>
								</FormControl>
							</Box>
						</HStack>
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
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already signed up?
								{" "}
								<Link
									as={RouterLink}
									color={"blue.400"}
									to='/login'
								>Login</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
