import { animated, easings, useSpring } from "@react-spring/web";
import happyState from "assets/happy_data.svg?raw";
import normal2State from "assets/idle_2_data.svg?raw";
import normalState from "assets/normal_data.svg?raw";
import sadState from "assets/sad_data.svg?raw";
import surpriseState from "assets/surprise_data.svg?raw";
import interpolate from "color-interpolate";
import "pets/pets.css";
import { useEffect, useState } from "react";


type Emotion = "surprised" | "happy" | "spin" | "sad";
type Vec2 = [number, number];

type Species = "snake-mon" | "bean";

const speciesColor = (species: Species): string => {
	switch (species) {
		case "snake-mon": {
			const rng = Math.random();
			if (rng < 0.1) { // shiny
				return interpolate(["#806780", "palevioletred"])(Math.random());
			}
			return interpolate(["greenyellow", "cadetblue"])(Math.random());
			// return "greenyellow";
		}
	}
	return "red";
};

export class Pet {
	name: string;
	species: Species;
	states: PetStateSet;
	layerDescriptors: LayerDescriptor[];
	color: string;
	triggerEmotionFunc: ((emotion: Emotion) => void) | null = null;

	constructor(name: string, species: Species, states: PetStateSet, layerDescriptors: LayerDescriptor[]) {
		this.name = name;
		this.species = species;
		this.states = states;
		this.layerDescriptors = layerDescriptors;
		this.color = speciesColor(species);
	}
	
	initState = (): PetState => {
		return Object.values(this.states)[0]; // TODO:
	};

	finalState = (): PetState => {
		return Object.values(this.states)[1]; // TODO:
	};

	genUI = () => {

		const [emotion, setEmotion] = useState<Emotion>("happy");
		const [pos, setPos] = useState<Vec2>([0, 0]);
		const [emotionTriggerCount, setEmotionTriggerCount] = useState(0);

		const randomMove = () => {
			setPos([Math.random() * 140 - 50, -Math.random() * 100]);
		};

		const randomMoveSetup = () => {
			setTimeout(()=> {
				randomMove();
				randomMoveSetup();
			}, 750 + Math.random() * 10_000);
		};

		useEffect(() => {
			randomMoveSetup();
		}, []);

		const [{x, y}, moveApi] = useSpring(() => ({
			from: {
				x: `translateX(0px)`,
				y: `translateY(0px)`
			},
			config: { mass: 1, tension: 280, friction: 240 }
		}));

		const [{ time, rotY, rotZ}, api] = useSpring(() => ({
			from: {
				time: 0,
				rotY: "rotateY(0deg)",
				rotZ: "rotateZ(0deg)"
			},
			to: {
				time: 100
			},
			config: {
				duration: 500,
				easing: easings.easeOutSine
			},
			loop: {reverse: true}
		}));	

		const resumeIdle = () => {
			api.stop();
			api.start({
				from: {
					time: 0,
					rotY: "rotateY(0deg)",
					rotZ: "rotateZ(0deg)"
				},
				to: {
					time: 100
				},
				config: {
					duration: 500,
					easing: easings.easeOutSine
				},
				loop: {reverse: true}
			});
		};

		const triggerEmotion = () => {
			api.stop();
			console.log("start", emotion);
			switch (emotion) {
				case "surprised": {
					api.start({to: [
						{time: 200,
							rotY: "rotateY(0deg)",
							rotZ: "rotateZ(0deg)",
							config: {
								duration: 1000,
								easing: easings.easeOutElastic
							}},
						{time: 100, 
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}},
						{time: 0, 
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}}
					], 
					config: {
						duration: 500,
						easing: easings.easeOutElastic
					}, 
					onRest: resumeIdle});
					break;
				}
				case "sad": {
					api.start({to: [
						{time: 200,
							rotY: "rotateY(0deg)",
							rotZ: "rotateZ(0deg)",
							config: {
								duration: 1000,
								easing: easings.easeOutSine
							}},
						{time: 201,
							config: {
								duration: 1000,
								easing: easings.easeOutSine
							}},
						{time: 100, 
							config: {
								duration: 800,
								easing: easings.easeOutSine
							}},
						{time: 0, 
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}}
					], 
					config: {
						duration: 500,
						easing: easings.easeOutElastic
					}, 
					onRest: resumeIdle});
					break;
				}
				case "happy": {
					api.start({to: [
						{time: 200,
							rotY: "rotateY(360deg)",
							rotZ: "rotateZ(0deg)",
							config: {
								duration: 400,
								easing: easings.easeInBounce
							}},
						{time: 201,
							rotZ: "rotateZ(30deg)",
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}},
						{time: 200,
							rotZ: "rotateZ(-30deg)",
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}},
						{time: 100, 
							rotZ: "rotateZ(0deg)",
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}},
						{time: 0, 
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}}
					], 
					config: {
						duration: 500,
						easing: easings.easeOutElastic
					}, 
					onRest: resumeIdle});
					break;
				}
			}
		};


		useEffect(() => {
			if (emotionTriggerCount !== 0) {
				triggerEmotion();
			}
		}, [emotionTriggerCount]);

		this.triggerEmotionFunc = (emotion: Emotion) => {
			setEmotion(emotion);
			setEmotionTriggerCount(emotionTriggerCount + 1);
			// triggerEmotion();
		};

		const genFinalState = (emotion: Emotion): PetState => {
			return this.states[emotion];
		};

		useEffect(() => {
			moveApi.stop();
			moveApi.start(
				{to: {
					x: `translateX(${pos[0]}px)`,
					y: `translateY(${pos[1]}px)`}
				});
		}, [pos]);

		return (
			<animated.div style={{transform: rotZ}}>
				<animated.div style={{transform: rotY}}>
					<animated.div style={{transform: x}}>
						<animated.div style={{transform: y}}>
							<svg viewBox="0 0 200 200" 
								onClick={() => {
									randomMove();
									// resumeIdle();
								}}
							>
								{Object.values(this.initState())
									.map((path: string, i: number) => 
										<animated.path key={`${this.name}_state_${i}`} className={this.layerDescriptors[i].className}
											style={this.layerDescriptors[i].base ? {fill: this.color} : {}}	
											d={time.to({
												range: [0, 100, 200],
												output: [
													path, this.finalState()[i], genFinalState(emotion)[i]
												]
											})}
										/>
									)}
							</svg>
						</animated.div>
					</animated.div>
				</animated.div>
			</animated.div>

		);
	};
}

type PetStateSet = {[key: string]: PetState};
type PetState = string[];

interface LayerDescriptor {
	className: string;
	base?: boolean;
}

const noStyle: LayerDescriptor = {className: "Basic"};

export const makeSnake = (name: string): Pet => {

	readState(normalState);

	const states: PetStateSet = {
		normal: readState(normalState),
		normal2: readState(normal2State),
		happy: readState(happyState),
		surprised: readState(surpriseState),
		sad: readState(sadState)
	};
	return new Pet(name, "snake-mon", states, [{className: "SnakeTounge"}, {className: "Snake", base: true}, noStyle, noStyle]);
};

export const readState = (fileContents: string): PetState => {
	const state: PetState = [];

	const lookFor = " d=";
	while (fileContents.includes(lookFor)) {
		fileContents = fileContents.slice(fileContents.indexOf(lookFor) + lookFor.length + 1);
		state.push(fileContents.slice(0, fileContents.indexOf("\"")));
	}

	return state;
};