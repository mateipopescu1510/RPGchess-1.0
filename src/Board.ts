import { BulkOperationBase } from "mongodb";
import { Piece } from "./Piece";
import Utils, { Direction, Ability, Type, Side } from "./Utils";

export class Board {
    private fen: string;
    private rows: number;
    private columns: number;
    private boardSetup: Piece[][];
    private movesList: [[number, number], [number, number], Piece | null, Piece | null][];

    constructor(fen: string) {
        this.fen = fen;
        this.rows = 0;
        this.columns = 0;
        this.boardSetup = [];
        this.movesList = [];
        this.convertFen();
    }

    private convertFen() {
        this.fen.split("/").forEach((rowInfo, rowIndex) => {
            if (rowIndex === 0) {
                let line = rowInfo.split(" ");
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
                for (let i = 0; i < rowInfo.length; i++) {
                    let type: Type = Utils.stringToPiece(rowInfo[i].toLowerCase());
                    if (type !== Type.EMPTY) {
                        column += emptySquares;
                        emptySquares = 0;

                        let side: Side = (rowInfo[i] === rowInfo[i].toLowerCase() ? Side.BLACK : Side.WHITE);
                        this.boardSetup[rowIndex - 1][column] = new Piece(side, type, [rowIndex - 1, column]);

                        let abilities: Ability[] = [];
                        if (rowInfo[i + 1] === "[") {
                            i += 2;
                            while (rowInfo[i] !== "]") {
                                let abilityNumber = parseInt(rowInfo[i] + rowInfo[i + 1] + rowInfo[i + 2]);
                                if (Ability[abilityNumber] !== undefined)
                                    abilities.push(abilityNumber);
                                i += 3;
                            }
                        }
                        this.boardSetup[rowIndex - 1][column].setAbilities(abilities);
                        switch (type) {
                            //Set the directions and ranges for each piece type (currently only for the base chess game)
                            case Type.KING: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.LINE, 1], [Direction.DIAGONAL, 1]]);
                                break;
                            }
                            case Type.QUEEN: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.LINE, Utils.INFINITE_RANGE], [Direction.DIAGONAL, Utils.INFINITE_RANGE]]);
                                break;
                            }
                            case Type.BISHOP: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.DIAGONAL, Utils.INFINITE_RANGE]]);
                                break;
                            }
                            case Type.ROOK: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.LINE, Utils.INFINITE_RANGE]]);
                                break;
                            }
                            case Type.KNIGHT: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.L, 1]]);
                                break;
                            }
                            case Type.PAWN: {
                                this.boardSetup[rowIndex - 1][column].setAttacks([[Direction.PAWN, 1]]);
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        column++;
                    }
                    else {
                        emptySquares = 10 * emptySquares + Number(rowInfo[i]);
                    }
                }
            }
        });
    }

    movePiece([fromRow, fromColumn]: [number, number], [toRow, toColumn]: [number, number]): Boolean {
        if (this.boardSetup[fromRow][fromColumn].isEmpty())
            return false;

        //check if move is valid else return false
        //unhighlight last move if there was any

        this.movesList.push([[fromRow, fromColumn], [toRow, toColumn], this.boardSetup[fromRow][fromColumn], this.boardSetup[toRow][toColumn]]);
        this.boardSetup[toRow][toColumn] = this.boardSetup[fromRow][fromColumn];

        return true;
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

// var board: Board = new Board("8 8/rnbqkbnr/pppppppp/8/r[102500501510]n[300]6/8/8/PPPPPPPP/RNBQKBNR");
// board.printBoard();

// board.movePiece([4, 4], [0, 0]);
// board.printBoard();

