use starknet::{ContractAddress};

#[derive( Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player: ContractAddress,
    pub ticks: u32,
    pub bricks: Array<Array<Brick>>,
    pub score: u32,
    pub active: bool,
    pub paddle: Paddle,
    pub ball: Ball,
   
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
pub struct Ball {
    pub vec: Vec2,
    pub size: u32,
    pub speed: u32,
    pub dx: u32,
    pub dy: u32,
    pub dxnegative: bool,
    pub dynegative: bool,
    pub visible: bool,
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
pub struct Paddle {
    pub vec: Vec2,
    pub w: u32,
    pub h: u32,
    pub speed: u32,
    pub dx: u32,
    pub dxnegative: bool,
    pub visible: bool,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Brick2 {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub row: u32,
    #[key]
    pub col: u32,
    pub vec: Vec2,
    pub w: u32,
    pub h: u32,
    pub visible: bool,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Moves {
    #[key]
    pub player: ContractAddress,
    pub remaining: u8,
    pub last_direction: Option<Direction>,
    pub can_move: bool,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct DirectionsAvailable {
    #[key]
    pub player: ContractAddress,
    pub directions: Array<Direction>,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Position {
    #[key]
    pub player: ContractAddress,
    pub vec: Vec2,
}


#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
}


#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
pub struct Vec2 {
    pub x: u32,
    pub y: u32
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
pub struct Brick {
    pub row: u32,
    pub col: u32,
    pub vec: Vec2,
    pub w: u32,
    pub h: u32,
    pub visible: bool,
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
pub struct Veci2 {
    pub x: i32,
    pub y: i32
}

impl DirectionIntoFelt252 of Into<Direction, felt252> {
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::Left => 1,
            Direction::Right => 2,
            Direction::Up => 3,
            Direction::Down => 4,
        }
    }
}

impl OptionDirectionIntoFelt252 of Into<Option<Direction>, felt252> {
    fn into(self: Option<Direction>) -> felt252 {
        match self {
            Option::None => 0,
            Option::Some(d) => d.into(),
        }
    }
}

#[generate_trait]
impl Vec2Impl of Vec2Trait {
    fn is_zero(self: Vec2) -> bool {
        if self.x - self.y == 0 {
            return true;
        }
        false
    }

    fn is_equal(self: Vec2, b: Vec2) -> bool {
        self.x == b.x && self.y == b.y
    }
}

#[cfg(test)]
mod tests {
    use super::{Position, Vec2, Vec2Trait};

    #[test]
    fn test_vec_is_zero() {
        assert(Vec2Trait::is_zero(Vec2 { x: 0, y: 0 }), 'not zero');
    }

    #[test]
    fn test_vec_is_equal() {
        let position = Vec2 { x: 420, y: 0 };
        assert(position.is_equal(Vec2 { x: 420, y: 0 }), 'not equal');
    }
}
