/*
    A bunch of helper constants and functions
*/
import { Piece } from "./Piece";

export const INFINITE_RANGE: number = 65535;
export const INFINITE_TIME: number = -1;

// These will all have different values once balancing becomes important
export const PAWN_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];
export const BISHOP_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];
export const KNIGHT_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];
export const ROOK_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];
export const QUEEN_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];
export const KING_LEVELUP_XP: number[] = [10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 35, 40, 45, 50, 55, 60, 66, 72, 80];

export const PAWN_CAPTURE_MULTIPLIER = 0.7;
export const BISHOP_CAPTURE_MULTIPLIER = 0.4;
export const KNIGHT_CAPTURE_MULTIPLIER = 0.5;
export const ROOK_CAPTURE_MULTIPLIER = 0.3;
export const QUEEN_CAPTURE_MULTIPLIER = 0.2;
export const KING_CAPTURE_MULTIPLIER = 0.6;

export const PAWN_MAX_CAPTURE_MULTIPLIER = 2;
export const BISHOP_MAX_CAPTURE_MULTIPLIER = 1.5;
export const KNIGHT_MAX_CAPTURE_MULTIPLIER = 1.5;
export const ROOK_MAX_CAPTURE_MULTIPLIER = 1.3;
export const QUEEN_MAX_CAPTURE_MULTIPLIER = 1;
export const KING_MAX_CAPTURE_MULTIPLIER = 1.7;

export const PAWN_DEFAULT_ABILITY_CAPACITY = 2;
export const BISHOP_DEFAULT_ABILITY_CAPACITY = 2;
export const KNIGHT_DEFAULT_ABILITY_CAPACITY = 1;
export const ROOK_DEFAULT_ABILITY_CAPACITY = 1;
export const QUEEN_DEFAULT_ABILITY_CAPACITY = 1;
export const KING_DEFAULT_ABILITY_CAPACITY = 1;

export const PAWN_MAX_LEVEL = 10;
export const BISHOP_MAX_LEVEL = 10;
export const KNIGHT_MAX_LEVEL = 10;
export const ROOK_MAX_LEVEL = 10;
export const QUEEN_MAX_LEVEL = 10;
export const KING_MAX_LEVEL = 10;

export const PER_MOVE_XP: number = 5;
export const ABILITY_MAX_TIMES_USED: number = 5;
export const PASSIVE_ABILITY_MAX_TIMES_USED: number = 5;


export enum GameResult {
    BLACK_WIN = -1,
    DRAW = 0,
    WHITE_WIN = 1,
    IN_PROGRESS = 2
}

export enum Direction {
    LINE = "LINE",
    DIAGONAL = "DIAGONAL",
    L = "L",
    PAWN = "PAWN",
    CAMEL = "CAMEL",
    CASTLING = "CASTLING",
}

export enum Side {
    WHITE = "WHITE",
    BLACK = "BLACK",
    NONE = "NONE"
}

export enum Type {
    EMPTY = ".",
    PAWN = "p",
    BISHOP = "b",
    KNIGHT = "n",
    ROOK = "r",
    QUEEN = "q",
    KING = "k"
}


export enum Ability {
    //Generic abilities that any piece can have [100-199]
    NONE = 0, // in case player chooses not to apply a new ability 
    INCREASE_CAPACITY = 101, // increases ability capacity by 1
    INCREASE_CAPTURE_MULTIPLIER = 102, // increases capture multiplier by 0.2
    SHIELD = 103, // piece survives being captured (move doesn't happen, shield drops) - one time use per piece

    //Pawn abilities [200-299]
    SCOUT = 200, // can advance twice in one turn
    QUANTUM_TUNNELING = 203, // can move through an enemy pawn (only through a pawn) behind it if the square is empty
    BACKWARDS = 204, // can move one square backwards

    //Knight abilities [300-399]
    SMOLDERING = 301, // freezes enemy queen for a move
    CAMEL = 302, // can also move like a camel (3 steps in one direction and 1 to the side, long knight)
    LEAPER = 303, // increases range of L attack by 1

    //Bishop abilities [400-499]
    CHANGE_COLOR = 402, // can change color complex by moving one sqaure to the side, can't capture to the side, one time use
    ARCHBISHOP = 403, // can also move like a knight

    //Rook abilities [500-599]
    HAS_PAWN = 501, // has a pawn that can guard its front left and right
    CHANCELLOR = 502, // can also move like a knight

    //Queen abilities [600-699]
    SWEEPER = 601, // can also move like a knight but lines and diagonals have reduced range
    BOOST_ADJACENT_PIECES = 602, // adjacent friendly pieces get a 0.1 capture multiplier increase

    //King abilities [700-799]
    SKIP = 700, // can skip a turn by moving on its own square
    ON_HORSE = 702, // can also move like a knight
    ON_CAMEL = 705, // can also move like a camel
}

export const GENERIC_ABILITIES: Ability[] = [Ability.NONE, Ability.INCREASE_CAPACITY, Ability.INCREASE_CAPTURE_MULTIPLIER]; //SHIELD is WIP
export const INSTANT_ABILITIES: Ability[] = [Ability.NONE, Ability.INCREASE_CAPACITY, Ability.INCREASE_CAPTURE_MULTIPLIER];
export const PASSIVE_ABILITIES: Ability[] = [Ability.SMOLDERING, Ability.SWEEPER, Ability.LEAPER, Ability.BOOST_ADJACENT_PIECES];

export const PAWN_ABILITIES: Ability[] = [Ability.SCOUT, Ability.QUANTUM_TUNNELING, Ability.BACKWARDS];
export const BISHOP_ABILITIES: Ability[] = [Ability.CHANGE_COLOR, Ability.ARCHBISHOP];
export const KNIGHT_ABILITIES: Ability[] = [Ability.SMOLDERING, Ability.CAMEL, Ability.LEAPER];
export const ROOK_ABILITIES: Ability[] = [Ability.HAS_PAWN, Ability.CHANCELLOR];
export const QUEEN_ABILITIES: Ability[] = [Ability.SWEEPER, Ability.BOOST_ADJACENT_PIECES];
export const KING_ABILITIES: Ability[] = [Ability.SKIP, Ability.ON_HORSE, Ability.ON_CAMEL];

export const PAWN_MAX_ABILITY_CAPACITY = PAWN_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;
export const BISHOP_MAX_ABILITY_CAPACITY = BISHOP_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;
export const KNIGHT_MAX_ABILITY_CAPACITY = KNIGHT_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;
export const ROOK_MAX_ABILITY_CAPACITY = ROOK_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;
export const QUEEN_MAX_ABILITY_CAPACITY = QUEEN_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;
export const KING_MAX_ABILITY_CAPACITY = KING_ABILITIES.length + GENERIC_ABILITIES.length - INSTANT_ABILITIES.length;

export function coordinateInList(coordinate: [number, number], list: Array<[number, number, Ability]>): number {
    //Returns index of the coordinate if it is in the list
    for (let i = 0; i < list.length; i++)
        if (list[i][0] === coordinate[0] &&
            list[i][1] === coordinate[1])
            return i;
    return -1;
}

export function oppositeSidePiece(piece1: Piece, piece2: Piece): Boolean {
    // True if the pieces' sides are opposite
    return piece1.getSide() === Side.WHITE && piece2.getSide() === Side.BLACK ||
        piece1.getSide() === Side.BLACK && piece2.getSide() === Side.WHITE;
}

export function sameSidePiece(piece1: Piece, piece2: Piece): Boolean {
    return piece1.getSide() === Side.WHITE && piece2.getSide() === Side.WHITE ||
        piece1.getSide() === Side.BLACK && piece2.getSide() === Side.BLACK;
}

export function sameSide(piece: Piece, side: Side): Boolean {
    // True if the piece's side is same as the input side
    return piece.getSide() === side;
}

export function oppositeSide(piece: Piece, side: Side): Boolean {
    // True if the piece's side is opposite to the input side
    return piece.getSide() === Side.WHITE && side === Side.BLACK ||
        piece.getSide() === Side.BLACK && side === Side.WHITE;
}

export function oppositeColor(side: Side): Side {
    if (side === Side.NONE)
        return Side.NONE;
    return side === Side.WHITE ? Side.BLACK : Side.WHITE;
}

export function stringToPiece(piece: string): [Type, Side] {
    let side: Side = piece === piece.toLowerCase() ? Side.BLACK : Side.WHITE;
    for (let type in Type) {
        if (Type[type] === piece.toLowerCase())
            return [Type[type], side];
    }
    return [Type.EMPTY, Side.NONE];
}

export function isEmpty(piece: Piece): Boolean {
    return piece.getType() === Type.EMPTY;
}
export function isNotEmpty(piece: Piece): Boolean {
    return piece.getType() !== Type.EMPTY;
}
export function isWhite(piece: Piece): Boolean {
    return piece.getSide() === Side.WHITE;
}
export function isBlack(piece: Piece): Boolean {
    return piece.getSide() === Side.BLACK;
}
export function isPawn(piece: Piece): Boolean {
    return piece.getType() === Type.PAWN;
}
export function isBishop(piece: Piece): Boolean {
    return piece.getType() === Type.BISHOP;
}
export function isKnight(piece: Piece): Boolean {
    return piece.getType() === Type.KNIGHT;
}
export function isRook(piece: Piece): Boolean {
    return piece.getType() === Type.ROOK;
}
export function isQueen(piece: Piece): Boolean {
    return piece.getType() === Type.QUEEN;
}
export function isKing(piece: Piece): Boolean {
    return piece.getType() === Type.KING;
}

export function hasLineAttack(piece: Piece): Boolean {
    return piece.getAttackDirections().indexOf(Direction.LINE) !== -1;
}
export function hasDiagonalAttack(piece: Piece): Boolean {
    return piece.getAttackDirections().indexOf(Direction.DIAGONAL) !== -1;
}
export function hasKnightAttack(piece: Piece): Boolean {
    return piece.getAttackDirections().indexOf(Direction.L) !== -1;
}
export function hasPawnAttack(piece: Piece): Boolean {
    return piece.getAttackDirections().indexOf(Direction.PAWN) !== -1;
}
export function hasCamelAttack(piece: Piece): Boolean {
    return piece.getAttackDirections().indexOf(Direction.CAMEL) !== -1;
}

export default {
    INFINITE_RANGE,
    INFINITE_TIME,

    PAWN_LEVELUP_XP,
    BISHOP_LEVELUP_XP,
    KNIGHT_LEVELUP_XP,
    ROOK_LEVELUP_XP,
    QUEEN_LEVELUP_XP,
    KING_LEVELUP_XP,

    PAWN_CAPTURE_MULTIPLIER,
    BISHOP_CAPTURE_MULTIPLIER,
    KNIGHT_CAPTURE_MULTIPLIER,
    ROOK_CAPTURE_MULTIPLIER,
    QUEEN_CAPTURE_MULTIPLIER,
    KING_CAPTURE_MULTIPLIER,

    PAWN_MAX_CAPTURE_MULTIPLIER,
    BISHOP_MAX_CAPTURE_MULTIPLIER,
    KNIGHT_MAX_CAPTURE_MULTIPLIER,
    ROOK_MAX_CAPTURE_MULTIPLIER,
    QUEEN_MAX_CAPTURE_MULTIPLIER,
    KING_MAX_CAPTURE_MULTIPLIER,

    PAWN_DEFAULT_ABILITY_CAPACITY,
    BISHOP_DEFAULT_ABILITY_CAPACITY,
    KNIGHT_DEFAULT_ABILITY_CAPACITY,
    ROOK_DEFAULT_ABILITY_CAPACITY,
    QUEEN_DEFAULT_ABILITY_CAPACITY,
    KING_DEFAULT_ABILITY_CAPACITY,

    PAWN_MAX_LEVEL,
    BISHOP_MAX_LEVEL,
    KNIGHT_MAX_LEVEL,
    ROOK_MAX_LEVEL,
    QUEEN_MAX_LEVEL,
    KING_MAX_LEVEL,

    PER_MOVE_XP,
    ABILITY_MAX_TIMES_USED,
    PASSIVE_ABILITY_MAX_TIMES_USED,

    GameResult,
    Direction,
    Side,
    Type,
    Ability,

    GENERIC_ABILITIES,
    INSTANT_ABILITIES,
    PASSIVE_ABILITIES,

    PAWN_ABILITIES,
    BISHOP_ABILITIES,
    KNIGHT_ABILITIES,
    ROOK_ABILITIES,
    QUEEN_ABILITIES,
    KING_ABILITIES,

    PAWN_MAX_ABILITY_CAPACITY,
    BISHOP_MAX_ABILITY_CAPACITY,
    KNIGHT_MAX_ABILITY_CAPACITY,
    ROOK_MAX_ABILITY_CAPACITY,
    QUEEN_MAX_ABILITY_CAPACITY,
    KING_MAX_ABILITY_CAPACITY,

    coordinateInList,
    oppositeSidePiece,
    sameSidePiece,
    sameSide,
    oppositeSide,
    oppositeColor,
    stringToPiece,

    isEmpty,
    isNotEmpty,
    isWhite,
    isBlack,
    isPawn,
    isBishop,
    isKnight,
    isRook,
    isQueen,
    isKing,

    hasLineAttack,
    hasDiagonalAttack,
    hasKnightAttack,
    hasPawnAttack,
    hasCamelAttack,
}