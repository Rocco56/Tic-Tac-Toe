import Store from "./store.js";
import View from "./view.js";
// const App = {
//   // All of our selected HTML elements
//   $: {
//     menu: document.querySelector('[data-id="menu"]'),
//     menuItems: document.querySelector('[data-id="menu-items"]'),
//     resetBtn: document.querySelector('[data-id="resetBtn"]'),
//     newRoundBtn: document.querySelector('[data-id="newRoundBtn"]'),
//     squares: document.querySelectorAll('[data-id="square"]'),
//     modal: document.querySelector('[data-id="modal"]'),
//     modalText: document.querySelector('[data-id="modal-text"]'),
//     modalBtn: document.querySelector('[data-id="modal-btn"]'),
//     turn: document.querySelector('[data-id="turn"]'),
//   },
//   state: {
//     moves: [],
//   },

//   getGameStatus(moves) {
//     const p1Moves = App.state.moves
//       .filter((move) => move.playerId === 1)
//       .map((move) => +move.squareId);
//     const p2Moves = App.state.moves
//       .filter((move) => move.playerId === 2)
//       .map((move) => +move.squareId);

//     const winningPatterns = [
//       [1, 2, 3],
//       [1, 5, 9],
//       [1, 4, 7],
//       [2, 5, 8],
//       [3, 5, 7],
//       [3, 6, 9],
//       [4, 5, 6],
//       [7, 8, 9],
//     ];
//     let winner = null;
//     winningPatterns.forEach((pattern) => {
//       const p1Wins = pattern.every((v) => p1Moves.includes(v));
//       const p2Wins = pattern.every((v) => p2Moves.includes(v));

//       if (p1Wins) winner = 1;
//       if (p2Wins) winner = 2;
//     });

//     return {
//       status: moves.length === 9 || winner != null ? "complete" : "in-progress",
//       winner, //1|2|null
//     };
//   },

//   init() {
//     App.registerEventListener();
//   },
//   registerEventListener() {
//     //Done
//     App.$.menu.addEventListener("click", (event) => {
//       App.$.menuItems.classList.toggle("hidden");
//     });

//     //ToDo
//     App.$.resetBtn.addEventListener("click", (event) => {
//       console.log("Reset the game");
//     });

//     //ToDo
//     App.$.newRoundBtn.addEventListener("click", (event) => {
//       console.log("Add a new Round");
//     });

//     App.$.modalBtn.addEventListener("click", (event) => {
//       App.state.moves = [];
//       App.$.squares.forEach((square) => square.replaceChildren());
//       App.$.modal.classList.add("hidden");
//     });

//     //ToDo
//     App.$.squares.forEach((square) => {
//       square.addEventListener("click", (event) => {
//         // Check if there is already a play,if so, return early
//         const hasMoves = (squareId) => {
//           const existingMove = App.state.moves.find(
//             (move) => move.squareId === squareId
//           );
//           return existingMove !== undefined;
//         };

//         if (hasMoves(+square.id)) {
//           return;
//         }
//         // if (square.hasChildNodes()) {
//         //   return;
//         // }

//         // Determine wich player icon to add to the square
//         const lastMove = App.state.moves.at(-1); //gives last current player of moves array

//         const getOppositePlayerId = (playerId) => (playerId === 1 ? 2 : 1);

//         const currentPlayer =
//           App.state.moves.length === 0
//             ? 1
//             : getOppositePlayerId(lastMove.playerId);
//         const nextPlayer = getOppositePlayerId(currentPlayer);
//         const squareIcon = document.createElement("i");
//         const turnIcon = document.createElement("i");
//         const turnLabel = document.createElement("p");
//         turnLabel.innerText = "Player " + nextPlayer + " you are up!";
//         if (currentPlayer === 1) {
//           squareIcon.classList.add("fa-solid", "fa-x", "yellow");
//           turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
//           turnLabel.classList = "turquoise";
//         } else {
//           squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
//           turnIcon.classList.add("fa-solid", "fa-x", "yellow");
//           turnLabel.classList = "yellow";
//         }
//         App.$.turn.replaceChildren(turnIcon, turnLabel);
//         App.state.moves.push({
//           squareId: +square.id,
//           playerId: currentPlayer,
//         });

//         square.replaceChildren(squareIcon);

//         // Check if there is a winner or tie game
//         const game = App.getGameStatus(App.state.moves);
//         let message = "";
//         if (game.status === "complete") {
//           App.$.modal.classList.remove("hidden");
//           if (game.winner === 1) {
//             message = "Player 1 wins!";
//           } else if (game.winner === 2) {
//             message = "Player 2 wins!";
//           } else {
//             message = "Tie!";
//           }
//           App.$.modalText.textContent = message;
//         }
//       });
//     });
//   },
// };

// window.addEventListener("load", App.init);

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const store = new Store("live-t3-storage-key", players);
  const view = new View();
  // Current tab state change
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });
  // function initView() {
  //   view.closeAll();
  //   view.clearMoves();
  //   view.setTurnIdicator(store.game.currentPlayer);
  //   view.updateScoreboard(
  //     store.stats.playerWithStats[0].wins,
  //     store.stats.playerWithStats[1].wins,
  //     store.stats.ties
  //   );
  //   view.initializeMoves(store.game.moves);
  // }

  // A different tab state changes
  window.addEventListener("storage", () => {
    console.log("state changed from other tab");
    //initView();
    view.render(store.game, store.stats);
  });

  // initView();
  // The first load of the document
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();

    //initView();
    //view.render(store.game, store.stats);
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();

    //initView();
    //view.render(store.game, store.stats);
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    // Place an icon of the current player in a square
    // view.handlePlayerMove(square, store.game.currentPlayer); //moves current state

    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id); //push value into move basically update state

    // if (store.game.status.isComplete) {
    //   view.openModal(
    //     store.game.status.winner
    //       ? store.game.status.winner.name + " wins!"
    //       : "Tie!"
    //   );
    //   return;
    // }
    // Set the next player's turn indicator
    //view.setTurnIdicator(store.game.currentPlayer); //new state moves currentplayer

    //view.render(store.game, store.stats);
  });
}
window.addEventListener("load", init);
