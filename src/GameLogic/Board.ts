import { Piece } from "./Piece";
import Utils, { Direction, Ability, Type, Side, sameSide, oppositeSide } from "./Utils";

export class Board {
    private fen: string;
    private rows: number;
    private columns: number;
    private boardSetup: Array<Array<Piece>>;
    private movesList: Array<[[number, number], [number, number], Piece, Piece]>; // [from coordinates, to coordinates, piece that moved, piece that was landed on]
    private halfMoveCounter: number;

    constructor(fen: string) {
        this.fen = fen;
        this.rows = 0;
        this.columns = 0;
        this.boardSetup = [];
        this.movesList = [];
        this.halfMoveCounter = 0;
        this.convertFen();
    }

    getBoardSetup(): Piece[][] {
        return this.boardSetup;
    }

    private convertFen() {
        //TODO Find a way to include the times an ability was used and its total move counter in the fen code
        //TODO Find a way to include updated piece ranges in the fen code 
        /*
            Piece information example:
            r[Xa102103x13l5] 
            X - if this character appears, the piece can't level up
            a102102 - piece has abilities with codes 102 and 103
            x13 - piece has 13 XP
            l5 - piece is level 5
            TODO below (WIP ideas)
            +, X, L, P, C, K - Line, Diagonal, L, Pawn, Camel, Castling
            +2X$L1 - range 2 for lines, infinite for diagonals, 1 for L
        */
        this.fen.split("/").forEach((row, rowIndex) => {
            if (rowIndex === 0) {
                let line = row.split(" ");
                this.rows = Number(line[0]);
                this.columns = Number(line[1]);

                this.boardSetup = [];
                for (let i = 0; i < this.rows; i++) {
                    this.boardSetup[i] = [];
                    for (let j = 0; j < this.columns; j++)
                        this.boardSetup[i][j] = new Piece();
                }
            }
            else {
                let column = 0, emptySquares = 0;
                for (let i = 0; i < row.length; i++) {
                    let [type, side]: [Type, Side] = Utils.stringToPiece(row[i]);
                    if (type !== Type.EMPTY) {
                        column += emptySquares;
                        emptySquares = 0;
                        let canLevelUp: Boolean = true;
                        let abilities: Array<[Ability, number]> = [];
                        let XP: number = 0, level: number = 0;

                        if (row[i + 1] === "[") {
                            i += 2;
                            while (row[i] !== "]") {
                                if (row[i] === "X") {
                                    canLevelUp = false;
                                    i++;
                                    continue;
                                }
                                if (row[i] === "a") {
                                    while (row[i + 1] >= '0' && row[i + 1] <= '9') {
                                        let abilityNumber = parseInt(row[i + 1] + row[i + 2] + row[i + 3]);
                                        abilities.push([abilityNumber, 0]);
                                        i += 3;
                                    }
                                    i++;
                                    continue;
                                }
                                if (row[i] === "x") {
                                    let stringXP = "";
                                    while (row[i + 1] >= '0' && row[i + 1] <= '9') {
                                        stringXP += row[i + 1];
                                        i++;
                                    }
                                    XP = parseInt(stringXP);
                                    i++;
                                    continue;
                                }
                                if (row[i] === "l") {
                                    let stringLevel = "";
                                    while (row[i + 1] >= '0' && row[i + 1] <= '9') {
                                        stringLevel += row[i + 1];
                                        i++;
                                    }
                                    level = parseInt(stringLevel);
                                    i++;
                                    continue;
                                }
                            }
                        }

                        this.boardSetup[rowIndex - 1][column] = new Piece(side, type, [rowIndex - 1, column], canLevelUp, abilities, XP, level);

                        column++;
                    }
                    else {
                        emptySquares = 10 * emptySquares + Number(row[i]);
                    }
                }
            }
        });
    }

    private updateFen() {
        let newFen: string = "";
        this.fen.split("/").forEach((row, rowIndex) => {
            //TODO might have to look through every single row instead of just the ones where a piece moved to be compatible with pieces affecting other pieces (for example a piece applying a disability to another piece)
        });
    }

    movePiece([fromRow, fromColumn]: [number, number], [toRow, toColumn]: [number, number]): Boolean {
        if (Utils.isEmpty(this.boardSetup[fromRow][fromColumn]))
            return false;

        //check if move is valid else return false


        if (this.getLastMove())

            this.movesList.push([[fromRow, fromColumn], [toRow, toColumn], this.boardSetup[fromRow][fromColumn], this.boardSetup[toRow][toColumn]]);
        this.boardSetup[toRow][toColumn] = this.boardSetup[fromRow][fromColumn];

        return true;
    }

    pseudoLegalMoves([row, column]: [number, number]): Array<[number, number]> {
        let moves: Array<[number, number]> = [];
        let piece: Piece = this.boardSetup[row][column];

        let attackDirections: Array<Direction> = piece.getAttackDirections();
        for (let attack of attackDirections) {
            let range: number = piece.rangeOf(attack);
            switch (attack) {
                case Direction.LINE: {
                    moves.push(...this.checkDirections([row, column], piece.getSide(), range, [[1, 0], [-1, 0], [0, 1], [0, -1]]));
                    break;
                }
                case Direction.DIAGONAL: {
                    moves.push(...this.checkDirections([row, column], piece.getSide(), range, [[1, 1], [-1, 1], [1, -1], [-1, -1]]));
                    break;
                }
                case Direction.L: {
                    moves.push(...this.checkDirections([row, column], piece.getSide(), range, [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2]]));
                    break;
                }
                case Direction.PAWN: {
                    //WIP
                    break;
                }
                case Direction.CAMEL: {
                    moves.push(...this.checkDirections([row, column], piece.getSide(), range, [[-3, -1], [-3, 1], [-1, 3], [1, 3], [3, 1], [3, -1], [1, -3], [-1, -3]]));
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return moves;
    }

    private checkDirections([row, column]: [number, number], side: Side, range: number, delta: Array<[number, number]>): Array<[number, number]> {
        let moves: Array<[number, number]> = [];
        for (let [deltaRow, deltaColumn] of delta)
            for (let i = 1; row + i * deltaRow >= 0 &&
                row + i * deltaRow < this.rows &&
                column + i * deltaColumn >= 0 &&
                column + i * deltaColumn < this.columns &&
                i <= range; i++) {
                if (sameSide(this.boardSetup[row + i * deltaRow][column + i * deltaColumn], side))
                    break;
                moves.push([row + i * deltaRow, column + i * deltaColumn]);
                if (oppositeSide(this.boardSetup[row + i * deltaRow][column + i * deltaColumn], side))
                    break;
            }
        return moves;
    }

    getLastMove(): [[number, number], [number, number], Piece | null, Piece | null] {
        return this.movesList[this.movesList.length - 1];
    }

    printBoard() {
        for (let row of this.boardSetup) {
            let rowString: string = "";
            for (let piece of row)
                rowString += piece.getSide() === Side.WHITE ? piece.getType().toString().toUpperCase() + " " : piece.getType().toString() + " ";
            console.log(rowString);
        }
    }

    printValidSquares([row, column]: [number, number]) {
        //only for testing
        let board: string = "";
        let moves = this.pseudoLegalMoves([row, column]);
        for (let i = 0; i < this.rows; i++) {
            let rowString: string = "";
            for (let j = 0; j < this.columns; j++) {
                if ([i, j].toString() == [row, column].toString())
                    rowString += "@ ";
                else
                    rowString += moves.some(tuple => tuple.toString() === [i, j].toString()) ? "x " : ". ";
            }
            board += rowString + "\n";
        }
        console.log(board);
    }
}

//"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
//"8 8/r[102500501510]n[300]6/w" -> fen notation concept for when abilities get implemented (each ability is a 3 digit number)
//"8 8/n5P1/2p2r2/1P6/5k2/2QB4/1q6/1PP5/8"



