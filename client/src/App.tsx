import { useEffect, useMemo, useState } from "react";
import { ParsedEntity, QueryBuilder } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface, addAddressPadding, CairoCustomEnum } from "starknet";

import { ModelsMapping, SchemaType, Ball } from "./typescript/models.gen.ts";
import { useSystemCalls } from "./useSystemCalls.ts";
import { useAccount } from "@starknet-react/core";
import { WalletAccount } from "./wallet-account.tsx";
import { HistoricalEvents } from "./historical-events.tsx";
import { useDojoSDK, useModel } from "@dojoengine/sdk/react";
import retry  from "async-retry";


/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */
function App() {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const { account } = useAccount();
    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);


    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [intervalId, setIntervalId] = useState<number>(0);

    const { spawn, start } = useSystemCalls();

    const entityId = useMemo(() => {
        if (account) {
            return getEntityIdFromKeys([BigInt(account.address)]);
        }
        return BigInt(0);
    }, [account]);

    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        setCanvas(canvas);
        const ctx = canvas.getContext('2d');
        setCtx(ctx);

        console.log('canvas loaded');
        // document.addEventListener('keydown', keyDown);
        // document.addEventListener('keyup', keyUp);
    }, [client]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async (account: AccountInterface) => {
            const subscription = await sdk.subscribeEntityQuery({
                query: new QueryBuilder<SchemaType>()
                    .namespace("dojo_starter", (n) =>
                        n
                            .entity("Moves", (e) =>
                                e.eq(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("Position", (e) =>
                                e.is(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("Ball", (e) =>
                                e.is(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("Paddle", (e) =>
                                e.is(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("Game", (e) =>
                                e.is(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                    )
                    .build(),
                callback: ({ error, data }) => {
                    if (error) {
                        console.error("Error setting up entity sync:", error);
                    } else if (
                        data &&
                        (data[0] as ParsedEntity<SchemaType>).entityId !== "0x0"
                    ) {
                        state.updateEntity(data[0] as ParsedEntity<SchemaType>);
                        console.log(data);

                        if (ctx && canvas) {

                            draw(ctx, canvas);
                        }

                    }
                },
            });

            unsubscribe = () => subscription.cancel();
        };

        if (account) {
            subscribe(account);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sdk, account, entities]);

    useEffect(() => {
        const fetchEntities = async (account: AccountInterface) => {
            try {
                await sdk.getEntities({
                    query: new QueryBuilder<SchemaType>()
                        .namespace("dojo_starter", (n) =>
                            n.entity("Moves", (e) =>
                                e.eq(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                        )
                        .build(),
                    callback: (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            state.setEntities(
                                resp.data as ParsedEntity<SchemaType>[]
                            );
                        }
                    },
                });
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        if (account) {
            fetchEntities(account);
        }
    }, [sdk, account]);

    const moves = useModel(entityId as string, ModelsMapping.Moves);
    const position = useModel(entityId as string, ModelsMapping.Position);
    const game = useModel(entityId as string, ModelsMapping.Game);
    const paddle = useModel(entityId as string, ModelsMapping.Paddle);
    const ball = useModel(entityId as string, ModelsMapping.Ball);


    // Canvas drawing logic.

    // Draw ball
    const drawBall = (ctx: CanvasRenderingContext2D) => {
        if (!ball) {
            return;
        }
        ctx.beginPath();
        ctx.arc(Number(ball.vec.x), Number(ball.vec.y), Number(ball.size), 0, Math.PI * 2);
        ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();

        // console.log('ball cords', Number(ball.vec.x), Number(ball.vec.y));
    }

    // Draw Bricks
    const drawBricks = (ctx: CanvasRenderingContext2D) => {
        if (!game) {
            return;
        }
        game.bricks.forEach(column => {
            column.forEach(brick => {
                ctx.beginPath();
                ctx.rect(brick.vec.x, brick.vec.y, brick.w, brick.h);
                ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
                ctx.fill();
                ctx.closePath();
            });
        });
    }

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawScore(ctx);
        drawBall(ctx);
        drawPaddle(ctx);
        drawBricks(ctx);
        console.log(game, game.active);
        if (game && game.active === false) {
            drawGameOver(ctx);
        }
        
        // console.log('brick', game);
        // console.log('brick entity', Object.values(entities)[0]);
    }

    // Draw Paddle
    const drawPaddle = (ctx: CanvasRenderingContext2D) => {
        if (!paddle) {
            return;
        }
        ctx.beginPath();
        ctx.rect(Number(paddle.vec.x), Number(paddle.vec.y), Number(paddle.w), Number(paddle.h));
        ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
    }

    // Draw Score
    function drawScore(ctx: CanvasRenderingContext2D) {
        if (!game) {
            return;
        }

        const score = game.score || 0;
        ctx.font = "20px Arial";
        ctx.fillStyle = "#0095dd";
        ctx.fillText(`Score: ${score}`, 30, 30);
    }

    // Draw Game Over
    function drawGameOver(ctx: CanvasRenderingContext2D) {
        if (!game) {
            return;
        }
        if (game.active) {
            return;
        }

        const score = game.score || 0;
        ctx.font = "40px Arial";
        ctx.fillStyle = "#0095dd";
        ctx.fillText(`Game Over! Score: ${score}`, 200, 300);
    }


    // NOTE: for some reason the client.actions.movePaddle action is not working (returns undefined txn).
    const keyDown = async (e) => {
        const left = new CairoCustomEnum({
            Left: "()",
        });
        const right = new CairoCustomEnum({
            Right: "()",
        });

        if (e.key === 'Right' || e.key === 'ArrowRight') {
            const txn = await client.actions.movePaddle(
                account!,
                right
            );
            console.log('right', e.key, txn);
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            await client.actions.movePaddle(
                account!,
                left
            );
            console.log('left', e.key, e);
        } else {
            console.log('other key', e.key);
        }


    }

    const keyUp = async (e) => {
        if (
            e.key === 'Right' ||
            e.key === 'ArrowRight' ||
            e.key === 'Left' ||
            e.key === 'ArrowLeft'
        ) {
            // Up stops the paddle.
            const up = new CairoCustomEnum({
                Up: "()",
            });
            await client.actions.movePaddle(
                account!,
                up
            );
            console.log('up', e.key, 'asdf');

        }
    }

    const loop = async () => {
        if (intervalId !== 0) {
            clearInterval(intervalId);
            setIntervalId(0);
            return;
        }
        
        const i = setInterval(async () => {
            const txn = await client.actions.tick(
                account!
            );
            console.log('ticking', txn, intervalId);
        }, 1000);
        setIntervalId(i);
    
        // await client.actions.tick(
        //     account!
        // );

        // // Sleep for 10ms
        // setTimeout(loop, 100);
    }



    return (
        <div className="bg-black min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />
                <div className="mt-8 overflow-x-auto">
                    <canvas id="canvas" width="800" height="600"></canvas>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            <div className="col-start-2">
                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={async () => await start()}
                                >
                                    +Start
                                </button>

                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={async () => {
                                        await client.actions.tick(
                                            account!
                                        );
                                    }}>Tick</button>

                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={loop}>Loop</button>
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                Ticks:{" "}
                                {game ? `${game.ticks}` : "Need to Start"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {position
                                    ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                                    : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {moves && moves.last_direction.isSome()
                                    ? moves.last_direction.unwrap()
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            {[
                                {
                                    direction: new CairoCustomEnum({
                                        Up: "()",
                                    }),
                                    label: "↑",
                                    col: "col-start-2",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Left: "()",
                                    }),
                                    label: "←",
                                    col: "col-start-1",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Right: "()",
                                    }),
                                    label: "→",
                                    col: "col-start-3",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Down: "()",
                                    }),
                                    label: "↓",
                                    col: "col-start-2",
                                },
                            ].map(({ direction, label, col }, idx) => (
                                <button
                                    className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                                    key={idx}
                                    onMouseDown={async () => {
                                        console.log('mousedown', direction);
                                        retry(async () => {
                                            const txn = await client.actions.movePaddle(
                                                account!,
                                                direction
                                            );
                                            console.log('button hold click txn', txn);
                                        }, {retries: 100});
                                    }}
                                    onMouseUp={async () => {
                                        console.log('mouseup', direction);
                                        retry(async () => {
                                            const txn = await client.actions.movePaddle(
                                                account!,
                                                new CairoCustomEnum({
                                                    Up: "()",
                                                }),
                                            );
                                            console.log('button hold click txn', txn);
                                        }, {retries: 100});                                        
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            <div className="col-start-2">
                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={async () => await spawn()}
                                >
                                    +
                                </button>
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                Moves Left:{" "}
                                {moves ? `${moves.remaining}` : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {position
                                    ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                                    : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {moves && moves.last_direction.isSome()
                                    ? moves.last_direction.unwrap()
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            {[
                                {
                                    direction: new CairoCustomEnum({
                                        Up: "()",
                                    }),
                                    label: "↑",
                                    col: "col-start-2",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Left: "()",
                                    }),
                                    label: "←",
                                    col: "col-start-1",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Right: "()",
                                    }),
                                    label: "→",
                                    col: "col-start-3",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Down: "()",
                                    }),
                                    label: "↓",
                                    col: "col-start-2",
                                },
                            ].map(({ direction, label, col }, idx) => (
                                <button
                                    className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                                    key={idx}
                                    onClick={async () => {
                                        await client.actions.move(
                                            account!,
                                            direction
                                        );
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">
                                    Entity ID
                                </th>
                                {/* <th className="border border-gray-700 p-2">
                                    Player
                                </th> */}
                                <th className="border border-gray-700 p-2">
                                    Ticks
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Ball X
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Ball Y
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Paddle X
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities).map(
                                ([entityId, entity]) => {
                                    const game =
                                        entity.models.dojo_starter.Game;
                                    const ball =
                                        entity.models.dojo_starter.Ball;


                                    return (
                                        <tr
                                            key={entityId}
                                            className="text-gray-300"
                                        >
                                            <td className="border border-gray-700 p-2">
                                                {entityId}
                                            </td>
                                            {/* <td className="border border-gray-700 p-2">
                                                {position?.player ?? "N/A"}
                                            </td> */}
                                            <td className="border border-gray-700 p-2">
                                                {game?.ticks ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {ball?.vec?.x.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {ball?.vec?.y.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {paddle?.vec?.x.toString() ??
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">
                                    Entity ID
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Player
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position X
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position Y
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Can Move
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Last Direction
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Remaining Moves
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities).map(
                                ([entityId, entity]) => {
                                    const position =
                                        entity.models.dojo_starter.Position;
                                    const moves =
                                        entity.models.dojo_starter.Moves;
                                    const lastDirection =
                                        moves?.last_direction?.isSome()
                                            ? moves.last_direction?.unwrap()
                                            : "N/A";

                                    return (
                                        <tr
                                            key={entityId}
                                            className="text-gray-300"
                                        >
                                            <td className="border border-gray-700 p-2">
                                                {entityId}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.player ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.x.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.y.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.can_move?.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {lastDirection}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.remaining?.toString() ??
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                {/* // Here sdk is passed as props but this can be done via contexts */}
                <HistoricalEvents />
            </div>
        </div>
    );
}

export default App;
