import { Piece } from "./Piece";
import Utils, { Direction, Ability, Type, Side } from "./Utils";


export class Board {
    private fen: string;
    private rows: number;
    private columns: number;
    private boardSetup: Array<Array<Piece>>;
    private movesList: Array<[[number, number], [number, number], Piece, Piece]>; // [from coordinates, to coordinates, piece that moved, piece that was landed on]
    private whiteKingPosition: [number, number];
    private blackKingPosition: [number, number];
    private mustLevelUpCoordinates: [number, number];
    private halfMoveCounter: number;

    constructor(fen: string) {
        this.fen = fen;
        this.rows = 0;
        this.columns = 0;
        this.boardSetup = [];
        this.movesList = [[[-1, -1], [-1, -1], new Piece(), new Piece()]];
        this.whiteKingPosition = [-1, -1];
        this.blackKingPosition = [-1, -1];
        this.mustLevelUpCoordinates = [-1, -1];
        this.halfMoveCounter = 0;
        this.convertFen();
    }

    getBoardSetup(): Piece[][] {
        return this.boardSetup;
    }

    getFen(): string {
        return this.fen;
    }

    private convertFen() {
        //TODO Find a way to include the times an ability was used and its total move counter in the fen code
        //TODO Find a way to include updated piece ranges in the fen code 
        /*
            Piece information example:
            r[Xa102103x13l5] 
            X - if this character appears, the piece can't level up
            a102103 - piece has abilities with codes 102 and 103
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

    updateFen() {
        let newFen: string = "";
        this.fen.split("/").forEach((row, rowIndex) => {
            if (rowIndex)
                for (let piece of this.boardSetup[rowIndex - 1]) {
                    if (Utils.isNotEmpty(piece)) {
                        newFen += piece.getSide() === Side.WHITE ? piece.getType().toUpperCase() : piece.getType();
                        let pieceInformation: string = "";

                        if (!piece.getCanLevelUp())
                            pieceInformation += "X";
                        if (piece.getAbilities().length > 0) {
                            pieceInformation += "a";
                            for (let ability of piece.getAbilities())
                                pieceInformation += ability[0].toString();
                        }
                        if (piece.getXP())
                            pieceInformation += "x" + piece.getXP().toString();
                        if (piece.getLevel())
                            pieceInformation += "l" + piece.getLevel().toString();

                        if (pieceInformation.length > 0)
                            pieceInformation = "[" + pieceInformation + "]";

                        newFen += pieceInformation;
                    }
                    else {
                        if (isNaN(Number(newFen.slice(-1))))
                            newFen += "1";
                        else {
                            let next: string = (Number(newFen.slice(-1)) + 1).toString();
                            newFen = newFen.slice(0, -1) + next;
                        }
                    }
                }
            else
                newFen += row;
            newFen += "/";
        })
        this.fen = newFen.slice(0, -1);
    }

    movePiece([fromRow, fromColumn]: [number, number], [toRow, toColumn]: [number, number]): Boolean {
        if (Utils.isEmpty(this.boardSetup[fromRow][fromColumn]))
            return false; //Exit if empty square is moved

        let moves: Array<[number, number, Ability]> = this.validMoves([fromRow, fromColumn]);
        let moveIndex: number = Utils.coordinateInList([toRow, toColumn], moves);

        if (moveIndex === -1)
            return false; //Exit if target square is not in the list of valid moves

        if (this.getLastMove()[0].toString() !== [-1, -1].toString())
            //If there's a last move source square, unhighlight
            this.boardSetup[this.getLastMove()[0][0]][this.getLastMove()[0][1]].unhighlight();

        if (this.getLastMove()[1].toString() !== [-1, -1].toString())
            //If there's a last move destination square, unhighlight
            this.boardSetup[this.getLastMove()[1][0]][this.getLastMove()[1][1]].unhighlight();

        this.movesList.push([[fromRow, fromColumn], [toRow, toColumn], this.boardSetup[fromRow][fromColumn], this.boardSetup[toRow][toColumn]]);

        //If certain special conditions aren't met before the move is made, exit without executing the move
        // if (this.checkSpecialConditionsBeforeMove([fromRow, fromColumn]))
        //     return true;

        let capturedPieceXP: number = this.boardSetup[toRow][toColumn].getTotalXP();

        this.boardSetup[toRow][toColumn] = this.boardSetup[fromRow][fromColumn]; //Move the piece to target square

        this.mustLevelUpCoordinates = this.boardSetup[toRow][toColumn].addXP(capturedPieceXP) ? [toRow, toColumn] : [-1, -1];

        //TODO check for pawn promotion

        if (fromRow !== toRow || fromColumn !== toColumn)
            this.boardSetup[fromRow][fromColumn] = new Piece(); //Create empty square on the square the piece moved from

        if (this.boardSetup[toRow][toColumn].getType() === Type.KING)
            this.boardSetup[toRow][toColumn].getSide() === Side.WHITE ? this.whiteKingPosition = [toRow, toColumn] : this.blackKingPosition = [toRow, toColumn];

        //If the move was made using an ability, increment the piece's move counter as long as the times used of that ability
        let abilityUsed: Ability = moves[moveIndex][2];
        abilityUsed === Ability.NONE ? this.boardSetup[toRow][toColumn].incrementMoveCounter() : this.boardSetup[toRow][toColumn].incrementMoveCounter(abilityUsed);

        //Highlight this move's source and destination squares
        this.boardSetup[fromRow][fromColumn].highlight();
        this.boardSetup[toRow][toColumn].highlight();
        this.halfMoveCounter++;

        this.checkSpecialConditionsAfterMove([toRow, toColumn]);

        this.updateFen();

        return true;
    }

    //Make private when done with testing
    validMoves([row, column]: [number, number]): Array<[number, number, Ability]> {
        let moves: Array<[number, number, Ability]> = [];
        let piece: Piece = this.boardSetup[row][column];
        let side: Side = piece.getSide();
        let abilities: Array<Ability> = piece.getAbilitiesNames();
        let attacks: Array<[Direction, number]> = piece.getAttacks();

        if (this.checkPassiveAbilities([row, column]))
            return [];

        for (let ability of abilities)
            moves.push(...this.checkAbility([row, column], side, ability));

        for (let attack of attacks)
            moves.push(...this.checkAttacks([row, column], side, attack));

        return moves;
    }

    // private checkSpecialConditionsBeforeMove([row, column]: [number, number]): Boolean {
    //     return false;
    // }

    private checkSpecialConditionsAfterMove([row, column]: [number, number]) {
        if (this.boardSetup[row][column].hasAbility(Ability.BOOST_ADJACENT_PIECES)) {
            let delta: Array<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
            for (let [deltaRow, deltaColumn] of delta)
                if (row + deltaRow >= 0 &&
                    row + deltaRow < this.rows &&
                    column + deltaColumn >= 0 &&
                    column + deltaColumn < this.columns &&
                    Utils.sameSidePiece(this.boardSetup[row][column], this.boardSetup[row + deltaRow][column + deltaColumn]))
                    this.boardSetup[row + deltaRow][column + deltaColumn].increaseCaptureMultiplier(0.1);
        }
    }

    private checkPassiveAbilities([row, column]: [number, number]): Boolean {
        //Check if passive abilities affect the piece that is moving (so far only passive interaction is queens being frozen by knights with smoldering)
        if (Utils.isQueen(this.boardSetup[row][column]) &&
            this.getLastMove()[2].hasAbility(Ability.SMOLDERING))
            return true;

        return false;
    }

    private checkAbility([row, column]: [number, number], side: Side, ability: Ability): Array<[number, number, Ability]> {
        let moves: Array<[number, number, Ability]> = [];

        switch (ability) {
            case Ability.SCOUT: {
                let deltaRow: number = side === Side.WHITE ? -1 : 1;
                if (row > 1 && row < this.rows - 2 &&
                    Utils.isEmpty(this.boardSetup[row + deltaRow][column]) &&
                    Utils.isEmpty(this.boardSetup[row + 2 * deltaRow][column]))
                    moves.push([row + 2 * deltaRow, column, ability]);
                return moves;
            }
            case Ability.QUANTUM_TUNNELING: {
                let deltaRow: number = side === Side.WHITE ? -1 : 1;
                if (row > 1 && row < this.rows - 2 &&
                    Utils.isPawn(this.boardSetup[row + deltaRow][column]) &&
                    Utils.oppositeSide(this.boardSetup[row + deltaRow][column], side) &&
                    Utils.isEmpty(this.boardSetup[row + 2 * deltaRow][column]))
                    moves.push([row + 2 * deltaRow, column, ability]);
                return moves;
            }
            case Ability.COLOR_COMPLEX: {
                for (let deltaColumn of [-1, 1])
                    if (column > 0 && column < this.columns - 1 &&
                        Utils.isEmpty(this.boardSetup[row][column + deltaColumn]))
                        moves.push([row, column + deltaColumn, ability]);
                return moves;
            }
            case Ability.ARCHBISHOP || Ability.CHANCELLOR || Ability.ON_HORSE: {
                return this.checkAttacks([row, column], side, [Direction.L, 1], ability);
            }
            case Ability.CAMEL || Ability.ON_CAMEL: {
                return this.checkAttacks([row, column], side, [Direction.CAMEL, 1], ability)
            }
            case Ability.HAS_PAWN: {
                return this.checkAttacks([row, column], side, [Direction.PAWN, 1], ability)
            }
            case Ability.SKIP: {
                return [[row, column, ability]];
            }
            case Ability.BACKWARDS: {
                let deltaRow: number = side === Side.WHITE ? 1 : -1;
                if (row + deltaRow < 0 || row + deltaRow >= this.rows || Utils.isNotEmpty(this.boardSetup[row + deltaRow][column]))
                    return [];
                return [[row + deltaRow, column, ability]];
            }
            default: {
                break;
            }
        }

        return moves;
    }

    private checkAttacks([row, column]: [number, number], side: Side, [direction, range]: [Direction, number], ability: Ability = Ability.NONE) {
        let moves: Array<[number, number, Ability]> = [];
        let delta: Array<[number, number]> = [];

        switch (direction) {
            case Direction.LINE: {
                delta = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                break;
            }
            case Direction.DIAGONAL: {
                delta = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
                break;
            }
            case Direction.L: {
                delta = [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2]];
                break;
            }
            case Direction.PAWN: {
                return this.checkPawn([row, column], side, range);
            }
            case Direction.CAMEL: {
                delta = [[-3, -1], [-3, 1], [-1, 3], [1, 3], [3, 1], [3, -1], [1, -3], [-1, -3]];
                break;
            }
            default: {
                break;
            }
        }

        for (let [deltaRow, deltaColumn] of delta)
            for (let i = 1; row + i * deltaRow >= 0 &&
                row + i * deltaRow < this.rows &&
                column + i * deltaColumn >= 0 &&
                column + i * deltaColumn < this.columns &&
                i <= range; i++) {
                if (Utils.sameSide(this.boardSetup[row + i * deltaRow][column + i * deltaColumn], side))
                    break;
                moves.push([row + i * deltaRow, column + i * deltaColumn, ability]);
                if (Utils.oppositeSide(this.boardSetup[row + i * deltaRow][column + i * deltaColumn], side))
                    break;
            }

        return moves;
    }

    private checkPawn([row, column]: [number, number], side: Side, range: number): Array<[number, number, Ability]> {
        let moves: Array<[number, number, Ability]> = [];
        let deltaRow: number = side === Side.WHITE ? -1 : 1;
        if (side === Side.WHITE && row === 0 ||
            side === Side.BLACK && row === this.rows - 1)
            return [];

        if (this.boardSetup[row][column].getMoveCounter() === 0 && range === 1)
            range = 2;

        for (let i = 1; row + i * deltaRow >= 0 &&
            row + i * deltaRow < this.rows &&
            i <= range; i++) {
            if (Utils.isNotEmpty(this.boardSetup[row + i * deltaRow][column]))
                break;
            moves.push([row + i * deltaRow, column, Ability.NONE]);
        }

        for (let deltaColumn of [-1, 1])
            if (column + deltaColumn >= 0 &&
                column + deltaColumn < this.columns &&
                Utils.oppositeSide(this.boardSetup[row + deltaRow][column + deltaColumn], side))
                moves.push([row + deltaRow, column + deltaColumn, Ability.NONE]);

        return moves;
    }

    getLastMove(): [[number, number], [number, number], Piece, Piece] {
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
        let moves = this.validMoves([row, column]);
        for (let i = 0; i < this.rows; i++) {
            let rowString: string = "";
            for (let j = 0; j < this.columns; j++) {
                if ([i, j].toString() == [row, column].toString())
                    rowString += "@ ";
                else
                    rowString += Utils.coordinateInList([i, j], moves) !== -1 ? "x " : ". ";
            }
            board += rowString + "\n";
        }
        console.log(board);
    }

    getLevelUpCoordinates(): [number, number] {
        return this.mustLevelUpCoordinates;
    }

    mustLevelUp(): Boolean {
        return this.mustLevelUpCoordinates[0] !== -1 && this.mustLevelUpCoordinates[1] !== -1;
    }

    levelUpDone() {
        this.mustLevelUpCoordinates = [-1, -1];
    }

}
//"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
//"8 8/n5P1/2p2r2/1P6/5k2/2QB4/1q6/1PP5/8"

// var board: Board = new Board("8 8/8/8/3BR3/8/4Q[a602]3/8/8/8");

// var queen: Piece = board.getBoardSetup()[4][4];
// var bishop: Piece = board.getBoardSetup()[2][3];
// var rook: Piece = board.getBoardSetup()[2][4];

// board.printBoard();
// console.log(queen.getAbilities());
// console.log(bishop.getCaptureMultiplier(), rook.getCaptureMultiplier());

// console.log(board.movePiece([4, 4], [2, 2]));

// board.printBoard();
// console.log(queen.getAbilities());
// console.log(bishop.getCaptureMultiplier(), rook.getCaptureMultiplier());

// console.log(board.movePiece([2, 2], [5, 5]));

// board.printBoard();
// console.log(queen.getAbilities());
// console.log(bishop.getCaptureMultiplier(), rook.getCaptureMultiplier());


