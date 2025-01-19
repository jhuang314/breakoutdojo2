import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_move_calldata = (direction: CairoCustomEnum): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "move",
			calldata: [direction],
		};
	};

	const actions_move = async (snAccount: Account | AccountInterface, direction: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_move_calldata(direction),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_movePaddle_calldata = (direction: CairoCustomEnum): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "move_paddle",
			calldata: [direction],
		};
	};

	const actions_movePaddle = async (snAccount: Account | AccountInterface, direction: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_movePaddle_calldata(direction),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spawn_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "spawn",
			calldata: [],
		};
	};

	const actions_spawn = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spawn_calldata(),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_start_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "start",
			calldata: [],
		};
	};

	const actions_start = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_start_calldata(),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_tick_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "tick",
			calldata: [],
		};
	};

	const actions_tick = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_tick_calldata(),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			move: actions_move,
			buildMoveCalldata: build_actions_move_calldata,
			movePaddle: actions_movePaddle,
			buildMovePaddleCalldata: build_actions_movePaddle_calldata,
			spawn: actions_spawn,
			buildSpawnCalldata: build_actions_spawn_calldata,
			start: actions_start,
			buildStartCalldata: build_actions_start_calldata,
			tick: actions_tick,
			buildTickCalldata: build_actions_tick_calldata,
		},
	};
}