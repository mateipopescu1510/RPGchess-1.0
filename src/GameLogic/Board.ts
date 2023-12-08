import { Piece } from "./Piece";
import Utils, { Direction, Ability, Type, Side } from "./Utils";

export class Board {
    private fen: string;
    private rows: number;
    private columns: number;
    private boardSetup: Piece[][];
    private movesList: [[number, number], [number, number], Piece, Piece][]; // [from coordinates, to coordinates, piece that moved, piece that was landed on]
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
        //TODO Find a way to include the times an ability was used in the fen code
        /*
            Piece information example:
            r[Xa102103x13l5] 
            X - if this character appears, the piece can't level up
            a102102 - piece has abilities with codes 102 and 103
            x13 - piece has 13 XP
            l5 - piece is level 5
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
                        let abilities: [Ability, number][] = [];
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
}

//"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
//"8 8/r[102500501510]n[300]6/w" -> fen notation concept for when abilities get implemented (each ability is a 3 digit number)
//"8 8/n5P1/2p2r2/1P6/5k2/2QB4/1q6/1PP5/8"

// var board: Board = new Board("8 8/rnbqkbnr/pppppppp/8/3r[Xa200202x13l4]4/8/8/PPPPPPPP/RNBQKBNR");
// board.printBoard();

// console.log(board.getBoardSetup()[3][3].getCanLevelUp());
// console.log(board.getBoardSetup()[3][3].getAbilities());
// console.log(board.getBoardSetup()[3][3].getXP());
// console.log(board.getBoardSetup()[3][3].getLevel());
// console.log(board.getBoardSetup()[3][3].getTotalXP());


