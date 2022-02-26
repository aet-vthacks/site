import { animated, easings, useSpring } from "@react-spring/web";
import happyState from "assets/happy_data.svg?raw";
import normal2State from "assets/idle_2_data.svg?raw";
import normalState from "assets/normal_data.svg?raw";
import sadState from "assets/sad_data.svg?raw";
import slimeIdle1State from "assets/slime0_data.svg?raw";
import slimeIdle2State from "assets/slime1_data.svg?raw";
import surpriseState from "assets/surprise_data.svg?raw";
import talkCloseState from "assets/talk_close_data.svg?raw";
import talkOpenState from "assets/talk_open_data.svg?raw";
import interpolate from "color-interpolate";
import "pets/pets.css";
import { useEffect, useRef, useState } from "react";






type Rarity = "common" | "rare" | "super rare" | "uber rare";

type Emotion = "surprised" | "happy" | "sad" | "talk";
type Vec2 = [number, number];

type Species = "snake-mon" | "slime";

type PetStateSet = {[key: string]: PetState[]};
type PetState = string[];

interface LayerDescriptor {
	className: string;
}

const genRarity = (): Rarity => {
	const rng = Math.random();
	if (rng < 0.025) return "uber rare";
	if (rng < 0.1) return "super rare";
	if (rng < 0.4) return "rare";
	return "common";
};

const genSpeciesColors = (species: Species, rarity: Rarity, rng: number = Math.random()): (string | null)[] => {
	switch (species) {
		case "snake-mon": {
			if (rarity === "uber rare") {
				const yellow = "yellow";
				return [null, interpolate(["gray", "black"])(rng), yellow, yellow];
			}
			if (rarity === "super rare") { // shiny
				return [null, interpolate(["#806780", "palevioletred"])(rng), null, null];
			}
			if (rarity === "rare") {
				return [null, interpolate(["#437558", "cadetblue"])(rng), null, null];
			}
			return [null, interpolate(["greenyellow", "#426344"])(rng), null, null];
		}
		case "slime": {
			if (rarity === "uber rare") {
				const yellow = "yellow";
				return [null, interpolate(["gray", "black"])(rng), yellow, yellow];
			}
			if (rarity === "super rare") { // shiny
				return [null, interpolate(["#806780", "palevioletred"])(rng), null, null];
			}
			if (rarity === "rare") {
				return [null, interpolate(["#437558", "cadetblue"])(rng), null, null];
			}
			return [null, interpolate(["greenyellow", "#426344"])(rng), null, null];
		}
	}
	return [];
};

export class Pet {
	name: string;
	species: Species;
	states: PetStateSet;
	layerDescriptors: LayerDescriptor[];
	colors: (string | null)[];
	rarity: Rarity;
	triggerEmotionFunc: ((emotion: Emotion) => void) = (emotion: Emotion) => {};
	speakFunc: ((str: string, time: number) => void) = (str: string, time: number) => {};

	constructor(name: string, species: Species, rarity: Rarity, colors: (string | null)[]) {
		this.rarity = rarity;
		this.name = name;
		this.species = species;
		this.states = genLayerStates(species);
		this.layerDescriptors = genLayerDescriptors(species);
		this.colors = colors;
	}
	
	initIdleState = (): PetState[] => {
		return Object.values(this.states)[0];
	};

	finalIdleState = (): PetState[] => {
		return Object.values(this.states)[1];
	};

	genUI = () => {

		const [emotion, setEmotion] = useState<Emotion>("happy");
		const [pos, setPos] = useState<Vec2>([0, 0]);
		const [emotionTriggerCount, setEmotionTriggerCount] = useState(0);
		const textID = useRef(0);
		const [text, setText] = useState("");

		this.speakFunc = (str: string, time: number) => {
			const thisTextID: number = textID.current + 1;
			setText(str);
			textID.current = thisTextID;
			this.triggerEmotionFunc("talk");
			setTimeout(() => {
				if (textID.current <= thisTextID) {
					setText("");
					textID.current = thisTextID + 1;
				}
			}, time * 1000);
		};

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
				case "talk": {
					const talkTime = 3;
					const arr = [0, 1, 2, 3, 4,4 ,5];
					api.start({to: [
						{time: 200,
							rotY: "rotateY(0deg)",
							rotZ: "rotateZ(0deg)",
							config: {
								duration: 500,
								easing: easings.easeOutSine
							}},
						...arr.map((i: number) =>
							({time: i % 2 === 0 ? 150 : 200, 
								config: {
									duration: 125,
									easing: easings.easeOutSine
								}})
						),
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

		const genFinalState = (emotion: Emotion): PetState[] => {
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
			<animated.div style={{transform: x}}>
				<animated.div style={{transform: y}}>
					<animated.div style={{transform: rotY}}>
						<animated.div style={{transform: rotZ}}>
							<svg viewBox="0 0 200 200" 
								onClick={() => {
									randomMove();
									this.speakFunc("Ow, you meanie!", 4);
								}}
							>
								{Object.values(this.initIdleState()[0])
									.map((path: string, i: number) => {
										const states = genFinalState(emotion);
										const range = states.length === 1 ? [0, 100, 200] : [0, 100, 150, 200]; // TODO: yikes
										const output = [
											path, this.finalIdleState()[0][i], ...states.map((state: PetState) => state[i])
										];
										return <animated.path key={`${this.name}_state_${i}`} className={this.layerDescriptors[i].className}
											style={this.colors[i] !== null ? {fill: this.colors[i] as string} : {}}	
											d={time.to({
												range, output
											})}
										/>;
									})}
							</svg>
						</animated.div>
					</animated.div>

					{text === "" ? null :
							<div className="SpeechBubble">
								{text.split("\n")
									.map((line: string, i: number) => 
										<span key={`text-line_${i}`}>
											{line}
										</span>
									)}
							</div>
					}
				</animated.div>
			</animated.div>

		);
	};
}

const noStyle: LayerDescriptor = {className: "Basic"};

export const genLayerDescriptors = (species: Species) => {
	switch (species) {
		case "snake-mon": {
			return [{className: "SnakeTounge"}, {className: "Snake"}, noStyle, noStyle];
		}
		case "slime": {
			return [{className: "Basic"}, {className: "Basic"}, noStyle, noStyle];
		}
	}
	return [];
};

export const genLayerStates = (species: Species): PetStateSet => {
	switch (species) {
		case "snake-mon": {
			return {
				normal: [readState(normalState)],
				normal2: [readState(normal2State)],
				happy: [readState(happyState)],
				surprised: [readState(surpriseState)],
				sad: [readState(sadState)],
				talk: [readState(talkOpenState), readState(talkCloseState)]
			};
		}
		case "slime": {
			return {
				normal: [readState(slimeIdle1State)],
				normal2: [readState(slimeIdle2State)],
				happy: [readState(slimeIdle1State)],
				surprised: [readState(slimeIdle1State)],
				sad: [readState(slimeIdle1State)],
				talk: [readState(slimeIdle1State), readState(slimeIdle1State)]
			};
		}
	}
	return {
		normal: [readState(normalState)],
		normal2: [readState(normal2State)],
		happy: [readState(happyState)],
		surprised: [readState(surpriseState)],
		sad: [readState(sadState)],
		talk: [readState(talkOpenState), readState(talkCloseState)]
	};
};



const readState = (fileContents: string): PetState => {
	const state: PetState = [];

	const lookFor = " d=";
	while (fileContents.includes(lookFor)) {
		fileContents = fileContents.slice(fileContents.indexOf(lookFor) + lookFor.length + 1);
		state.push(fileContents.slice(0, fileContents.indexOf("\"")));
	}

	return state;
};

export const genPet = (species: Species, name: string) => {
	const rarity = genRarity();

	return new Pet(name, species, rarity, genSpeciesColors(species, rarity));
};