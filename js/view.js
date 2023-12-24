export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menubtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$.grid = this.#qs('[data-id="grid"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI only event listner is handled by View itself
    this.$.menubtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;

    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;
    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? winner.name + " wins!" : "Tie!");
    }
    this.#setTurnIdicator(currentPlayer);
  }

  /*
    Event Listners
   */

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
  }

  /*
    Dom Helper Methods
  */
  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = p1Wins + " wins";
    this.$.p2Wins.innerText = p2Wins + " wins";
    this.$.ties.innerText = ties + " ties";
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((moves) => moves.squareId === +square.id);

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }
  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menubtn.classList.remove("border");

    const icon = this.$.menubtn.querySelector("i");

    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menubtn.classList.toggle("border");

    const icon = this.$.menubtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #handlePlayerMove(squareEl, players) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", players.iconClass, players.colorClass);
    squareEl.replaceChildren(icon);
  }

  // player = 1|2
  #setTurnIdicator(players) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", players.colorClass, players.iconClass);
    label.classList.add(players.colorClass);
    label.innerText = players.name + " you are up!";

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("Could not find element");

    return el;
  }
  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");

    return elList;
  }

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
