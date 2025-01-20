# breakoutdojo2
A simple Atari-Breakout clone powered by Dojo Game Engine on StarkNet.

## Overview
BreakoutDojo is a provable game that can be played in the browser. It's based on the original Atari Breakout game and uses the Dojo Game Engine to compute the game state completely on-chain. The provable mechanics ensure that all actions, scores, and other game data are verifiable.

## Features
- Provable game mechanics: All game states are computed on-chain.
- Verifiable scoring system: Players can prove their score is correct.
- Fun gameplay. Come on, this game is a classic!

## How to play
1. Visit https://dub.sh/breakoutdojo to play the game.
2. Connect your wallet.
3. Start playing! Click on Start to begin.
4. Use the on-screen arrow buttons to move the paddle left or right or stop the paddle.
5. Try to avoid the ball from hitting the bottom of the screen. If you do, it is game over!
6. Try to hit as many bricks as you can.
7. Good Luck!


## Tech Stack

- Frontend:
    
    React + Vite: Used for building a fast, modern, and interactive user interface.
    
    Dojoclient: Easy integration for subscribing to game events, integration with wallets, and sending user actions to the contract.
    
- Backend:
    
    Dojo Stack: Provable game engine running entirely on StarkNet.

    Slots: Uses Slots to deploy both Katana (https://api.cartridge.gg/x/breakoutdojo2/katana) and Torii (https://api.cartridge.gg/x/breakoutdojo2/torii) to cartridge. 
    
    Cairo Language: Implements the entire game logic (ball movement, paddle movement, brick collision detection, scoring, etc).
    
- Database:
    
    On-Chain Storage: All core game data (ball position and velocity, paddle position, bricks, score, etc.).

## How to run (backend)
1. Clone this repository.
2. Go in to the contract directory.
3. In 2 terminals:
    1. Terminal 1 Run: `katana --dev --dev.no-fee --http.cors_origins '*'`
    2. Terminal 2 Run: `sozo build; sozo migrate`
    3. Terminal 2 Get the torii address from the previous command. 
    4. Terminal 2 Run: `torii -w <torii address> --http.cors_origins '*'`


## How to run (frontend)

1. Clone this repository.
2. Install the dependencies by running `npm install` in the client directory.
3. Start the development server by running `npm run dev`.
4. In dojoConfig.ts comment out the last 3 lines of the config.
5. Open http://localhost:5173/ in your browser to see the game.
