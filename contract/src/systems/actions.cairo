use dojo_starter::models::{Direction, Position, Ball, Veci2, Game, Paddle, Brick};

const MAX_WIDTH: u32 = 800;
const MAX_HEIGHT: u32 = 600;
const BRICK_OFFSET_X: u32 = 45;
const BRICK_OFFSET_Y: u32 = 60;
const BRICK_ROWS: u32 = 9;
const BRICK_COLS: u32 = 5;
const BRICK_WIDTH: u32 = 70;
const BRICK_HEIGHT: u32 = 20;
const BRICK_PADDING: u32 = 10;

// define the interface
#[starknet::interface]
trait IActions<T> {
    fn start(ref self: T);
    fn tick(ref self: T);
    fn move_paddle(ref self: T, direction: Direction);
    fn spawn(ref self: T);
    fn move(ref self: T, direction: Direction);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{
        IActions, Direction, Position, next_position, next_ball, next_game, next_paddle,
        next_paddle_dx
    };
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{Vec2, Moves, DirectionsAvailable, Ball, Veci2, Game, Paddle, Brick};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Moved {
        #[key]
        pub player: ContractAddress,
        pub direction: Direction,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn start(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

            let game = Game { player, ticks: 1 };

            world.write_model(@game);

            let new_ball = Ball {
                player,
                vec: Vec2 { x: 400, y: 300 },
                size: 10,
                speed: 4,
                dx: 4,
                dy: 4,
                dxnegative: false,
                dynegative: true,
                visible: true,
            };

            // Write the new entities to the world.
            world.write_model(@new_ball);

            let new_paddle = Paddle {
                player,
                vec: Vec2 { x: 360, y: 580 },
                w: 80,
                h: 10,
                speed: 8,
                dx: 0,
                dxnegative: false,
                visible: true,
            };

            world.write_model(@new_paddle);

            for row in 0
                ..9_u32 {
                    for col in 0
                        ..5_u32 {
                            let x = row * (80) + 45;
                            let y = col * (30) + 60;

                            let brick = Brick {
                                player, row, col, vec: Vec2 { x, y }, w: 70, h: 20, visible: true
                            };
                            world.write_model(@brick);
                        }
                }
        }

        fn tick(ref self: ContractState) {
            let mut world = self.world_default();

            let player = get_caller_address();

            let game: Game = world.read_model(player);
            let next_game = next_game(game);
            world.write_model(@next_game);

            let ball: Ball = world.read_model(player);
            let next_ball = next_ball(ball);
            world.write_model(@next_ball);

            let paddle: Paddle = world.read_model(player);
            let next_paddle = next_paddle(paddle);
            world.write_model(@next_paddle);
        }

        fn move_paddle(ref self: ContractState, direction: Direction) {
            let mut world = self.world_default();

            let player = get_caller_address();

            let paddle: Paddle = world.read_model(player);

            let next_paddle = next_paddle_dx(paddle, Option::Some(direction));

            // Write the new position to the world.
            world.write_model(@next_paddle);
        }

        fn spawn(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
            // Retrieve the player's current position from the world.
            let position: Position = world.read_model(player);

            // Update the world state with the new data.

            // 1. Move the player's position 10 units in both the x and y direction.
            let new_position = Position {
                player, vec: Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 }
            };

            // Write the new position to the world.
            world.write_model(@new_position);

            // 2. Set the player's remaining moves to 100.
            let moves = Moves {
                player, remaining: 100, last_direction: Option::None, can_move: true
            };

            // Write the new moves to the world.
            world.write_model(@moves);
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref self: ContractState, direction: Direction) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player = get_caller_address();

            // Retrieve the player's current position and moves data from the world.
            let position: Position = world.read_model(player);
            let mut moves: Moves = world.read_model(player);
            // if player hasn't spawn, read returns model default values. This leads to sub overflow
            // afterwards.
            // Plus it's generally considered as a good pratice to fast-return on matching
            // conditions.
            if !moves.can_move {
                return;
            }

            // Deduct one from the player's remaining moves.
            moves.remaining -= 1;

            // Update the last direction the player moved in.
            moves.last_direction = Option::Some(direction);

            // Calculate the player's next position based on the provided direction.
            let next = next_position(position, moves.last_direction);

            // Write the new position to the world.
            world.write_model(@next);

            // Write the new moves to the world.
            world.write_model(@moves);

            // Emit an event to the world to notify about the player's move.
            world.emit_event(@Moved { player, direction });
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

// Define function like this:
fn next_position(mut position: Position, direction: Option<Direction>) -> Position {
    match direction {
        Option::None => { return position; },
        Option::Some(d) => match d {
            Direction::Left => { position.vec.x -= 1; },
            Direction::Right => { position.vec.x += 1; },
            Direction::Up => { position.vec.y -= 1; },
            Direction::Down => { position.vec.y += 1; },
        }
    };
    position
}

fn next_game(mut game: Game) -> Game {
    let mut new_game = game;
    new_game.ticks += 1;
    new_game
}


fn next_ball(mut ball: Ball) -> Ball {
    // Calculate the new position of the ball based on its current motion.

    if (ball.dxnegative) {
        // Left wall collsion.
        if (ball.vec.x < ball.dx + ball.size) {
            ball.dxnegative = false;
        } else {
            ball.vec.x -= ball.dx;
        }
    } else {
        // Right wall collsion.
        if (ball.vec.x + ball.size > MAX_WIDTH) {
            ball.dxnegative = true;
        } else {
            ball.vec.x += ball.dx;
        }
    }

    if (ball.dynegative) {
        // Top wall collsion.
        if (ball.vec.y < ball.dy + ball.size) {
            ball.dynegative = false;
        } else {
            ball.vec.y -= ball.dy;
        }
    } else {
        // Bottom wall collsion.
        if (ball.vec.y + ball.size > MAX_HEIGHT) {
            ball.dynegative = true;
        } else {
            ball.vec.y += ball.dy;
        }
    }
    ball
}


fn next_paddle(mut paddle: Paddle) -> Paddle {
    // Calculate the new position of the paddle based on its current motion.
    if (paddle.dxnegative) {
        // Left wall collsion.
        if (paddle.vec.x < paddle.dx) {
            paddle.vec.x = 0;
        } else {
            paddle.vec.x -= paddle.dx;
        }
    } else {
        // Right wall collsion.
        if (paddle.vec.x + paddle.w > MAX_WIDTH) {
            paddle.vec.x = MAX_WIDTH - paddle.w;
        } else {
            paddle.vec.x += paddle.dx;
        }
    }
    paddle
}

fn next_paddle_dx(mut paddle: Paddle, direction: Option<Direction>) -> Paddle {
    match direction {
        Option::None => {
            paddle.dx = 0;
            paddle.dxnegative = false;
        },
        Option::Some(d) => match d {
            Direction::Left => {
                paddle.dx = paddle.speed;
                paddle.dxnegative = true;
            },
            Direction::Right => {
                paddle.dx = paddle.speed;
                paddle.dxnegative = false;
            },
            Direction::Up => {
                paddle.dx = 0;
                paddle.dxnegative = false;
            },
            Direction::Down => {
                paddle.dx = 0;
                paddle.dxnegative = false;
            },
        },
    };
    paddle
}
