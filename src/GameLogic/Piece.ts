import Utils, { Direction, Ability, Type, Side } from "./Utils";

export class Piece {
    private side: Side;
    private type: Type;
    private initialSquare: [number, number];
    private attacks: Array<[Direction, number]>;
    private canLevelUp: Boolean;
    private captureMultiplier: number;
    private abilityCapacity: number;
    private abilities: Array<[Ability, number]>;
    private possibleAbilities: Array<Ability>;
    private XP: number;
    private level: number;
    private levelUpXP: number[];
    private totalXP: number;
    private moveCounter: number;
    private maxLevel: number;
    private isMaxLevel: Boolean;
    private highlighted: Boolean;

    constructor(side: Side = Side.NONE,
        type: Type = Type.EMPTY,
        initialSquare: [number, number] = [-1, -1],
        canLevelUp: Boolean = false,
        abilities: Array<[Ability, number]> = [],
        XP: number = 0,
        level: number = 0,
        attacks: Array<[Direction, number]> = []
    ) {

        this.side = side;
        this.type = type;
        this.initialSquare = initialSquare;
        this.canLevelUp = canLevelUp;
        this.XP = XP;
        this.level = level;

        switch (this.type) {
            case Type.PAWN: {
                this.attacks = [[Direction.PAWN, 1]];
                this.levelUpXP = Utils.PAWN_LEVELUP_XP;
                this.captureMultiplier = Utils.PAWN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.PAWN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.PAWN_MAX_LEVEL;
                this.possibleAbilities = Utils.PAWN_ABILITIES;
                break;
            }
            case Type.BISHOP: {
                this.attacks = [[Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.BISHOP_LEVELUP_XP;
                this.captureMultiplier = Utils.BISHOP_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.BISHOP_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.BISHOP_MAX_LEVEL;
                this.possibleAbilities = Utils.BISHOP_ABILITIES;
                break;
            }
            case Type.KNIGHT: {
                this.attacks = [[Direction.L, 1]];
                this.levelUpXP = Utils.KNIGHT_LEVELUP_XP;
                this.captureMultiplier = Utils.KNIGHT_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KNIGHT_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KNIGHT_MAX_LEVEL;
                this.possibleAbilities = Utils.KNIGHT_ABILITIES;
                break;
            }
            case Type.ROOK: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.ROOK_LEVELUP_XP;
                this.captureMultiplier = Utils.ROOK_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.ROOK_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.ROOK_MAX_LEVEL;
                this.possibleAbilities = Utils.ROOK_ABILITIES;
                break;
            }
            case Type.QUEEN: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE], [Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.QUEEN_LEVELUP_XP;
                this.captureMultiplier = Utils.QUEEN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.QUEEN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.QUEEN_MAX_LEVEL;
                this.possibleAbilities = Utils.QUEEN_ABILITIES;
                break;
            }
            case Type.KING: {
                this.attacks = [[Direction.LINE, 1], [Direction.DIAGONAL, 1], [Direction.CASTLING, 1]];
                this.levelUpXP = Utils.KING_LEVELUP_XP;
                this.captureMultiplier = Utils.KING_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KING_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KING_MAX_LEVEL;
                this.possibleAbilities = Utils.KING_ABILITIES;
                break;
            }
            default: {
                this.attacks = [];
                this.levelUpXP = [];
                this.captureMultiplier = 0;
                this.abilityCapacity = 0;
                this.maxLevel = 0;
                this.possibleAbilities = [];
                break;
            }
        }

        if (Utils.isNotEmpty(this))
            this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);

        this.abilities = [];
        this.setAbilities(abilities);
        this.totalXP = 0;
        for (let lvl = 0; lvl < this.level; lvl++)
            this.totalXP += this.levelUpXP[lvl];
        this.totalXP += this.XP;

        this.moveCounter = 0;
        this.isMaxLevel = level >= this.maxLevel;
        this.highlighted = false;
    }

    //*SIDE
    setSide(side: Side) {
        this.side = side;
    }
    getSide(): Side {
        return this.side;
    }

    //*TYPE
    setType(type: Type) {
        this.type = type;
    }
    getType(): Type {
        return this.type;
    }

    //*INITIAL SQUARE
    getInitialSquare(): [number, number] {
        return this.initialSquare;
    }

    //*ATTACKS
    setAttacks(attacks: [Direction, number][]) {
        this.attacks = attacks;
    }
    getAttacks(): [Direction, number][] {
        return this.attacks;
    }
    addAttack(attack: [Direction, number]): Boolean {
        if (this.attacks.indexOf(attack) !== -1)
            return false;

        this.attacks.push(attack);
        return true;
    }
    removeAttack(direction: Direction): Boolean {
        let index: number = this.getAttackDirections().indexOf(direction);
        if (index === -1)
            return false;

        this.attacks.splice(index, 1);
        return true;
    }

    getAttackDirections(): Direction[] {
        return this.attacks.map(([direction, _]) => direction);
    }
    getAttackRanges(): number[] {
        return this.attacks.map(([_, range]) => range);
    }

    rangeOf(direction: Direction): number {
        let index: number = this.getAttackDirections().indexOf(direction);
        if (index === -1)
            return 0;

        return this.getAttackRanges()[index];
    }
    hasAttack(direction: Direction): Boolean {
        let index: number = this.getAttackDirections().indexOf(direction);
        if (index === -1)
            return false;

        return true;
    }
    updateAttackRange(direction: Direction, range: number): Boolean {
        let index: number = this.getAttackDirections().indexOf(direction);
        if (index === -1)
            return false;

        this.attacks[index][1] = range;
        return true;
    }

    //*CAN LEVEL UP
    getCanLevelUp(): Boolean {
        return this.canLevelUp;
    }
    enableLevelUp() {
        this.canLevelUp = true;
    }
    disableLevelUp() {
        this.canLevelUp = false;
    }

    //*CAPTURE MULTIPLIER
    setCaptureMultiplier(captureMultiplier: number) {
        this.captureMultiplier = captureMultiplier;
    }
    increaseCaptureMultiplier(increment: number = 0.1) {
        this.captureMultiplier += increment;
    }
    getCaptureMultiplier(): number {
        return this.captureMultiplier;
    }

    //*ABILITY CAPACITY
    setAbilityCapacity(abilityCapacity: number) {
        this.abilityCapacity = abilityCapacity;
    }
    getAbilityCapacity(): number {
        return this.abilityCapacity;
    }
    increaseAbilityCapacity(increment: number = 1) {
        this.abilityCapacity += increment;
    }
    decrementAbilityCapacity(): Boolean {
        if (this.abilityCapacity <= this.abilities.length)
            return false;

        this.abilityCapacity--;
        return true;
    }

    //*ABILITIES
    setAbilities(abilities: [Ability, number][]) {
        for (let [ability, timesUsed] of abilities)
            this.addAbility(ability, timesUsed);
    }
    getAbilities(): [Ability, number][] {
        return this.abilities;
    }
    hasAbility(ability: Ability): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        return index !== -1;
    }

    getAbilitiesNames(): Ability[] {
        return this.abilities.map(([ability, _]) => ability);
    }
    getAbilitiesTimesUsed(): number[] {
        return this.abilities.map(([_, timesUsed]) => timesUsed);
    }
    setTimesUsed(ability: Ability, timesUsed: number): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        if (index === -1)
            return false;

        this.abilities[index][1] = timesUsed;
        return true;
    }
    timesUsed(ability: Ability): number {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        if (index === -1)
            return -1;

        return this.abilities[index][1];
    }
    private increaseTimesUsed(ability: Ability): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        if (index === -1)
            return false;

        this.abilities[index][1]++;

        if (Utils.PASSIVE_ABILITIES.indexOf(ability) !== -1 &&
            this.timesUsed(ability) >= Utils.PASSIVE_ABILITY_MAX_TIMES_USED ||
            Utils.DISABILITIES.indexOf(ability) !== -1 &&
            this.timesUsed(ability) >= Utils.DISABILITY_MAX_TIMES_USED)
            this.removeAbility(ability);

        return true;
    }

    //*ADD/REMOVE ABILITY
    addAbility(ability: Ability, timesUsed: number = 0): Boolean {
        if (this.abilities.length === this.abilityCapacity && ability !== Ability.INCREASE_CAPACITY)
            return false;
        if (this.getAbilitiesNames().indexOf(ability) !== -1 || this.possibleAbilities.indexOf(ability) === -1)
            return false;

        switch (ability) {
            case Ability.INCREASE_CAPACITY: {
                this.increaseAbilityCapacity();
                return true;
            }
            case Ability.INCREASE_CAPTURE_MULTIPLIER: {
                this.increaseCaptureMultiplier();
                return true;
            }
            case Ability.SWEEPER: {
                this.addAttack([Direction.L, 1]);
                this.updateAttackRange(Direction.LINE, 2);
                this.updateAttackRange(Direction.DIAGONAL, 2);
                break;
            }
            case Ability.LEAPER: {
                this.updateAttackRange(Direction.L, 2);
                break;
            }
            default: {
                break;
            }
        }

        this.abilities.push([ability, timesUsed]);
        this.possibleAbilities.splice(this.possibleAbilities.indexOf(ability), 1);
        return true;
    }
    removeAbility(ability: Ability): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        if (index === -1)
            return false;

        switch (ability) {
            case Ability.SWEEPER: {
                this.removeAttack(Direction.L);
                this.updateAttackRange(Direction.LINE, Utils.INFINITE_RANGE);
                this.updateAttackRange(Direction.DIAGONAL, Utils.INFINITE_RANGE);
                break;
            }
            case Ability.LEAPER: {
                this.updateAttackRange(Direction.L, 1);
                break;
            }
            default: {
                break;
            }
        }

        this.abilities.splice(index, 1);
        this.possibleAbilities.push(ability);
        return true;
    }

    //*POSSIBLE ABILITIES
    getPossibleAbilities(): Array<Ability> {
        return this.possibleAbilities;
    }

    //*XP
    setXP(XP: number) {
        this.XP = XP;
    }
    getXP(): number {
        return this.XP;
    }
    addXP(capturedXP: number): Boolean {
        this.XP += Utils.PER_MOVE_XP + Math.floor(this.captureMultiplier * capturedXP);
        this.totalXP += Utils.PER_MOVE_XP + Math.floor(this.captureMultiplier * capturedXP);

        return this.levelUpXP[this.level] <= this.XP;
    }

    //*LEVEL UP XP
    setLevelUpXP(levelUpXP: number[]) {
        this.levelUpXP = levelUpXP;
    }
    getLevelUpXP(): number[] {
        return this.levelUpXP;
    }

    //*TOTAL XP
    getTotalXP(): number {
        return this.totalXP;
    }

    //*LEVEL
    setLevel(level: number) {
        this.level = level;
    }
    getLevel(): number {
        return this.level;
    }
    increaseLevel(): Boolean {
        if (!this.canLevelUp || this.isMaxLevel)
            return false;

        this.XP -= this.levelUpXP[this.level];
        this.level++;

        return true;
    }

    //*MOVE COUNTER
    setMoveCounter(moveCounter: number) {
        this.moveCounter = moveCounter;
    }
    getMoveCounter(): number {
        return this.moveCounter;
    }
    incrementMoveCounter(ability: Ability = Ability.NONE) {
        this.moveCounter++;

        for (let disability of Utils.DISABILITIES)
            if (this.hasAbility(disability))
                this.increaseTimesUsed(disability);

        for (let passiveAbility of Utils.PASSIVE_ABILITIES)
            if (this.hasAbility(passiveAbility))
                this.increaseTimesUsed(passiveAbility);

        if (ability !== Ability.NONE)
            this.increaseTimesUsed(ability);
    }

    //*MAX LEVEL
    reachedMaxLevel(): Boolean {
        return this.isMaxLevel;
    }

    //*HIGHLIGHT
    highlight() {
        this.highlighted = true;
    }
    unhighlight() {
        this.highlighted = false;
    }
    isHighlighted() {
        return this.highlighted;
    }

}

export function oppositePiece(piece1: Piece, piece2: Piece): Boolean {
    return piece1.getSide() === Side.WHITE && piece2.getSide() === Side.BLACK ||
        piece1.getSide() === Side.BLACK && piece2.getSide() === Side.WHITE

}

export function oppositeSide(side1: Side, side2: Side): Boolean {
    return side1 === Side.WHITE && side2 === Side.BLACK ||
        side1 === Side.BLACK && side2 === Side.WHITE;
}

export function sameSidePiece(piece1: Piece, piece2: Piece): Boolean {
    return piece1.getSide() === Side.WHITE && piece2.getSide() === Side.WHITE ||
        piece1.getSide() === Side.BLACK && piece2.getSide() === Side.BLACK;
}

export function sameSide(side1: Side, side2: Side) {
    return side1 === Side.WHITE && side2 === Side.WHITE ||
        side1 === Side.BLACK && side2 === Side.BLACK;
}

export function isQueenOrRook(piece: Piece): Boolean {
    return piece.getType() === Type.QUEEN || piece.getType() === Type.ROOK;
}

export function isQueenOrBishop(piece: Piece): Boolean {
    return piece.getType() === Type.QUEEN || piece.getType() === Type.BISHOP;
}

export function isKnight(piece: Piece): Boolean {
    return piece.getType() === Type.KNIGHT;
}

export function isPawn(piece: Piece): Boolean {
    return piece.getType() === Type.PAWN;
}

export function isKing(piece: Piece) {
    return piece.getType() === Type.KING;
}

// var piece: Piece = new Piece(Side.BLACK, Type.BISHOP, [0, 0], true, [[Ability.SMOLDERING, 0], [Ability.CAMEL, 1]]);
// console.log(piece.getAbilities());
// console.log(piece.getPossibleAbilities());

// console.log(piece.addAbility(Ability.ARCHBISHOP));
// console.log(piece.getAbilities());
// console.log(piece.getPossibleAbilities());

// console.log(piece.removeAbility(Ability.ARCHBISHOP));
// console.log(piece.getAbilities());
// console.log(piece.getPossibleAbilities());
