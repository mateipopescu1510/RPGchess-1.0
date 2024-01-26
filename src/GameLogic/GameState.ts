import { Board } from "./Board";
import { Piece } from "./Piece";
import Utils, { Direction, Ability, Type, Side, GameResult } from "./Utils";

export class GameState {
    private board: Board;
    private currentTurn: number;
    private timeWhite: number;
    private timeBlack: number;
    private gameResult: GameResult;

    constructor(fen: string, currentTurn: number, timeWhite: number, timeBlack: number, pseudoLegal: Boolean = false) {
        this.board = new Board(fen);
        this.currentTurn = currentTurn;
        this.timeWhite = timeWhite;
        this.timeBlack = timeBlack;
        this.gameResult = GameResult.IN_PROGRESS;
    }

    movePiece(from: [number, number], to: [number, number]): Boolean {
        if (this.gameResult !== GameResult.IN_PROGRESS)
            return false;

        if (this.board.mustLevelUp())
            return false;

        if (!this.board.movePiece(from, to))
            return false;

        this.changeTurn();

        //TODO finish checkmate()
        if (this.checkmate())
            this.gameResult = this.currentTurn === 0 ? GameResult.BLACK_WIN : GameResult.WHITE_WIN;

        return true;
    }

    levelUp(abilityName: string): Boolean {
        let [row, column]: [number, number] = this.board.getLevelUpCoordinates();
        let piece: Piece = this.board.getBoardSetup()[row][column];
        let ability: Ability = Ability[abilityName];

        if (row === -1 || column === -1)
            return false;

        if (ability === Ability.NONE) {
            piece.increaseLevel();
            this.board.levelUpDone();
            return true;
        }

        if (piece.addAbility(ability)) {
            piece.increaseLevel();
            this.board.updateFen();
            this.board.levelUpDone();
            return true;
        }
        return false;
    }

    getBoard(): Board {
        return this.board;
    }

    getTurn(): number {
        return this.currentTurn;
    }

    private changeTurn() {
        this.currentTurn = 1 - this.currentTurn;
    }

    //TODO finish checkmate()
    private checkmate(): Boolean {
        return false;
    }

}