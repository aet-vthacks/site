import { Spinner, Text } from "@chakra-ui/react";
import ky from "ky";
import { ReactElement } from "react";
import useSWR, { KeyedMutator } from "swr";

interface Props<T> {
	url: string
	method?: "get" | "post" | "put" | "patch" | "head" | "delete"
	body?: Record<string, any>
	children: (data: T, mutate: KeyedMutator<T>) => ReactElement
}

export default function Fetcher<T>(props: Props<T>) {
	const fetcher = async (props: Props<T>) => {
		return await ky(props.url, {
			timeout: 10_000,
			json: props.body,
			method: props.method ?? "get"
		})
			.json<T>();
	};

	const { data, error, isValidating, mutate } = useSWR<T>(props, fetcher);
	if ((!data && !error) || isValidating) {
		return <Spinner />;
	}

	if (error) {
		return <Text>An error has occurred</Text>;
	}

	return <>{props.children(data!, mutate)}</>;
}
