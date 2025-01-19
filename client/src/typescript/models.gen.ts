import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, CairoOption, CairoOptionVariant, BigNumberish } from 'starknet';

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `dojo_starter::models::Ball` struct
export interface Ball {
	player: string;
	vec: Vec2;
	size: BigNumberish;
	speed: BigNumberish;
	dx: BigNumberish;
	dy: BigNumberish;
	dxnegative: boolean;
	dynegative: boolean;
	visible: boolean;
}

// Type definition for `dojo_starter::models::BallValue` struct
export interface BallValue {
	vec: Vec2;
	size: BigNumberish;
	speed: BigNumberish;
	dx: BigNumberish;
	dy: BigNumberish;
	dxnegative: boolean;
	dynegative: boolean;
	visible: boolean;
}

// Type definition for `dojo_starter::models::Brick` struct
export interface Brick {
	player: string;
	vec: Vec2;
	w: BigNumberish;
	h: BigNumberish;
	visible: boolean;
}

// Type definition for `dojo_starter::models::BrickValue` struct
export interface BrickValue {
	vec: Vec2;
	w: BigNumberish;
	h: BigNumberish;
	visible: boolean;
}

// Type definition for `dojo_starter::models::DirectionsAvailable` struct
export interface DirectionsAvailable {
	player: string;
	directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::DirectionsAvailableValue` struct
export interface DirectionsAvailableValue {
	directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::Game` struct
export interface Game {
	player: string;
	ticks: BigNumberish;
}

// Type definition for `dojo_starter::models::GameValue` struct
export interface GameValue {
	ticks: BigNumberish;
}

// Type definition for `dojo_starter::models::Moves` struct
export interface Moves {
	player: string;
	remaining: BigNumberish;
	last_direction: CairoOption<DirectionEnum>;
	can_move: boolean;
}

// Type definition for `dojo_starter::models::MovesValue` struct
export interface MovesValue {
	remaining: BigNumberish;
	last_direction: CairoOption<DirectionEnum>;
	can_move: boolean;
}

// Type definition for `dojo_starter::models::Paddle` struct
export interface Paddle {
	player: string;
	vec: Vec2;
	w: BigNumberish;
	h: BigNumberish;
	speed: BigNumberish;
	dx: BigNumberish;
	dxnegative: boolean;
	visible: boolean;
}

// Type definition for `dojo_starter::models::PaddleValue` struct
export interface PaddleValue {
	vec: Vec2;
	w: BigNumberish;
	h: BigNumberish;
	speed: BigNumberish;
	dx: BigNumberish;
	dxnegative: boolean;
	visible: boolean;
}

// Type definition for `dojo_starter::models::Position` struct
export interface Position {
	player: string;
	vec: Vec2;
}

// Type definition for `dojo_starter::models::PositionValue` struct
export interface PositionValue {
	vec: Vec2;
}

// Type definition for `dojo_starter::models::Vec2` struct
export interface Vec2 {
	x: BigNumberish;
	y: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::Moved` struct
export interface Moved {
	player: string;
	direction: DirectionEnum;
}

// Type definition for `dojo_starter::systems::actions::actions::MovedValue` struct
export interface MovedValue {
	direction: DirectionEnum;
}

// Type definition for `dojo_starter::models::Direction` enum
export type Direction = {
	Left: string;
	Right: string;
	Up: string;
	Down: string;
}
export type DirectionEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		Ball: WithFieldOrder<Ball>,
		BallValue: WithFieldOrder<BallValue>,
		Brick: WithFieldOrder<Brick>,
		BrickValue: WithFieldOrder<BrickValue>,
		DirectionsAvailable: WithFieldOrder<DirectionsAvailable>,
		DirectionsAvailableValue: WithFieldOrder<DirectionsAvailableValue>,
		Game: WithFieldOrder<Game>,
		GameValue: WithFieldOrder<GameValue>,
		Moves: WithFieldOrder<Moves>,
		MovesValue: WithFieldOrder<MovesValue>,
		Paddle: WithFieldOrder<Paddle>,
		PaddleValue: WithFieldOrder<PaddleValue>,
		Position: WithFieldOrder<Position>,
		PositionValue: WithFieldOrder<PositionValue>,
		Vec2: WithFieldOrder<Vec2>,
		Moved: WithFieldOrder<Moved>,
		MovedValue: WithFieldOrder<MovedValue>,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		Ball: {
			fieldOrder: ['player', 'vec', 'size', 'speed', 'dx', 'dy', 'dxnegative', 'dynegative', 'visible'],
			player: "",
		vec: { x: 0, y: 0, },
			size: 0,
			speed: 0,
			dx: 0,
			dy: 0,
			dxnegative: false,
			dynegative: false,
			visible: false,
		},
		BallValue: {
			fieldOrder: ['vec', 'size', 'speed', 'dx', 'dy', 'dxnegative', 'dynegative', 'visible'],
		vec: { x: 0, y: 0, },
			size: 0,
			speed: 0,
			dx: 0,
			dy: 0,
			dxnegative: false,
			dynegative: false,
			visible: false,
		},
		Brick: {
			fieldOrder: ['player', 'vec', 'w', 'h', 'visible'],
			player: "",
		vec: { x: 0, y: 0, },
			w: 0,
			h: 0,
			visible: false,
		},
		BrickValue: {
			fieldOrder: ['vec', 'w', 'h', 'visible'],
		vec: { x: 0, y: 0, },
			w: 0,
			h: 0,
			visible: false,
		},
		DirectionsAvailable: {
			fieldOrder: ['player', 'directions'],
			player: "",
			directions: [new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, })],
		},
		DirectionsAvailableValue: {
			fieldOrder: ['directions'],
			directions: [new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, })],
		},
		Game: {
			fieldOrder: ['player', 'ticks'],
			player: "",
			ticks: 0,
		},
		GameValue: {
			fieldOrder: ['ticks'],
			ticks: 0,
		},
		Moves: {
			fieldOrder: ['player', 'remaining', 'last_direction', 'can_move'],
			player: "",
			remaining: 0,
		last_direction: new CairoOption(CairoOptionVariant.None),
			can_move: false,
		},
		MovesValue: {
			fieldOrder: ['remaining', 'last_direction', 'can_move'],
			remaining: 0,
		last_direction: new CairoOption(CairoOptionVariant.None),
			can_move: false,
		},
		Paddle: {
			fieldOrder: ['player', 'vec', 'w', 'h', 'speed', 'dx', 'dxnegative', 'visible'],
			player: "",
		vec: { x: 0, y: 0, },
			w: 0,
			h: 0,
			speed: 0,
			dx: 0,
			dxnegative: false,
			visible: false,
		},
		PaddleValue: {
			fieldOrder: ['vec', 'w', 'h', 'speed', 'dx', 'dxnegative', 'visible'],
		vec: { x: 0, y: 0, },
			w: 0,
			h: 0,
			speed: 0,
			dx: 0,
			dxnegative: false,
			visible: false,
		},
		Position: {
			fieldOrder: ['player', 'vec'],
			player: "",
		vec: { x: 0, y: 0, },
		},
		PositionValue: {
			fieldOrder: ['vec'],
		vec: { x: 0, y: 0, },
		},
		Vec2: {
			fieldOrder: ['x', 'y'],
			x: 0,
			y: 0,
		},
		Moved: {
			fieldOrder: ['player', 'direction'],
			player: "",
		direction: new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, }),
		},
		MovedValue: {
			fieldOrder: ['direction'],
		direction: new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, }),
		},
	},
};
export enum ModelsMapping {
	Ball = 'dojo_starter-Ball',
	BallValue = 'dojo_starter-BallValue',
	Brick = 'dojo_starter-Brick',
	BrickValue = 'dojo_starter-BrickValue',
	Direction = 'dojo_starter-Direction',
	DirectionsAvailable = 'dojo_starter-DirectionsAvailable',
	DirectionsAvailableValue = 'dojo_starter-DirectionsAvailableValue',
	Game = 'dojo_starter-Game',
	GameValue = 'dojo_starter-GameValue',
	Moves = 'dojo_starter-Moves',
	MovesValue = 'dojo_starter-MovesValue',
	Paddle = 'dojo_starter-Paddle',
	PaddleValue = 'dojo_starter-PaddleValue',
	Position = 'dojo_starter-Position',
	PositionValue = 'dojo_starter-PositionValue',
	Vec2 = 'dojo_starter-Vec2',
	Moved = 'dojo_starter-Moved',
	MovedValue = 'dojo_starter-MovedValue',
}