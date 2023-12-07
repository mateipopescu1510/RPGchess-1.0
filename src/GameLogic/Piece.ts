import Utils, { Direction, Ability, Type, Side } from "./Utils";

export class Piece {
    private side: Side;
    private type: Type;
    private initialSquare: [number, number];
    private attacks: [Direction, number][];
    private canLevelUp: Boolean;
    private captureMultiplier: number;
    private abilityCapacity: number;
    private abilities: Ability[];
    private XP: number;
    private level: number;
    private levelUpXP: number[];
    private totalXP: number;
    private moveCounter: number;
    private isMaxLevel: Boolean;
    private highlighted: Boolean;

    //TODO add maxLevel constants for each piece in Utils and a boolean data member to check whether the piece has reached its max level (and can no longer gain XP or abilities) 

    constructor(side: Side = Side.NONE,
        type: Type = Type.EMPTY,
        initialSquare: [number, number] = [-1, -1],
        canLevelUp: Boolean = false,
        abilities: Ability[] = [],
        XP: number = 0,
        level: number = 0) {

        this.side = side;
        this.type = type;
        this.initialSquare = initialSquare;
        this.canLevelUp = canLevelUp;
        this.abilities = abilities;
        this.XP = XP;
        this.level = level;

        switch (this.type) {
            case Type.PAWN: {
                this.attacks = [[Direction.PAWN, 1]];
                this.levelUpXP = Utils.PAWN_LEVELUP_XP;
                this.captureMultiplier = Utils.PAWN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.PAWN_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            case Type.BISHOP: {
                this.attacks = [[Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.BISHOP_LEVELUP_XP;
                this.captureMultiplier = Utils.BISHOP_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.BISHOP_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            case Type.KNIGHT: {
                this.attacks = [[Direction.L, 1]];
                this.levelUpXP = Utils.KNIGHT_LEVELUP_XP;
                this.captureMultiplier = Utils.KNIGHT_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KNIGHT_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            case Type.ROOK: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.ROOK_LEVELUP_XP;
                this.captureMultiplier = Utils.ROOK_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.ROOK_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            case Type.QUEEN: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE], [Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.QUEEN_LEVELUP_XP;
                this.captureMultiplier = Utils.QUEEN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.QUEEN_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            case Type.KING: {
                this.attacks = [[Direction.LINE, 1], [Direction.DIAGONAL, 1]];
                this.levelUpXP = Utils.KING_LEVELUP_XP;
                this.captureMultiplier = Utils.KING_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KING_DEFAULT_ABILITY_CAPACITY;
                break;
            }
            default: {
                this.attacks = [];
                this.levelUpXP = [];
                this.captureMultiplier = 0;
                this.abilityCapacity = 0;
                break;
            }
        }

        this.totalXP = 0;
        for (let lvl = 0; lvl < this.level; lvl++)
            this.totalXP += this.levelUpXP[lvl];
        this.totalXP += this.XP;

        this.moveCounter = 0;
        this.isMaxLevel = false;
        this.highlighted = false;
    }

    setSide(side: Side) {
        this.side = side;
    }
    getSide(): Side {
        return this.side;
    }

    setType(type: Type) {
        this.type = type;
    }
    getType(): Type {
        return this.type;
    }

    getInitialSquare(): [number, number] {
        return this.initialSquare;
    }

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

    getCanLevelUp(): Boolean {
        return this.canLevelUp;
    }
    enableLevelUp() {
        this.canLevelUp = true;
    }
    disableLevelUp() {
        this.canLevelUp = false;
    }

    setCaptureMultiplier(captureMultiplier: number) {
        this.captureMultiplier = captureMultiplier;
    }
    getCaptureMultiplier(): number {
        return this.captureMultiplier;
    }

    setAbilityCapacity(abilityCapacity: number) {
        this.abilityCapacity = abilityCapacity;
    }
    getAbilityCapacity(): number {
        return this.abilityCapacity;
    }
    increaseAbilityCapacity(increment: number = 1) {
        this.abilityCapacity += increment;
    }
    //?decreaseAbilityCapacity ?? (check >= 0)

    setAbilities(abilities: Ability[]) {
        this.abilities = abilities;
    }
    getAbilities(): Ability[] {
        return this.abilities;
    }
    addAbility(ability: Ability): Boolean {
        if (this.abilities.indexOf(ability) !== -1)
            return false;

        this.abilities.push(ability);
        return true;
    }
    removeAbility(ability: Ability): Boolean {
        let index: number = this.abilities.indexOf(ability);
        if (index === -1)
            return false;

        this.abilities.splice(index, 1);
        return true;
    }
    //! possibleAbilities(): Ability[]

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

    setLevelUpXP(levelUpXP: number[]) {
        this.levelUpXP = levelUpXP;
    }
    getLevelUpXP(): number[] {
        return this.levelUpXP;
    }

    getTotalXP(): number {
        return this.totalXP;
    }


    setLevel(level: number) {
        this.level = level;
    }
    getLevel(): number {
        return this.level;
    }
    increaseLevel() {
        this.level++;
    }

    setMoveCounter(moveCounter: number) {
        this.moveCounter = moveCounter;
    }
    getMoveCounter(): number {
        return this.moveCounter;
    }
    incrementMoveCounter() {
        this.moveCounter++;
    }

    highlight() {
        this.highlighted = true;
    }
    unhighlight() {
        this.highlighted = false;
    }
    isHighlighted() {
        return this.highlighted;
    }

    isEmpty(): Boolean {
        return this.type === Type.EMPTY;
    }
    isNotEmpty(): Boolean {
        return this.type !== Type.EMPTY;
    }
    isPawn(): Boolean {
        return this.type === Type.PAWN;
    }
    isBishop(): Boolean {
        return this.type === Type.BISHOP;
    }
    isKnight(): Boolean {
        return this.type === Type.KNIGHT;
    }
    isRook(): Boolean {
        return this.type === Type.ROOK;
    }
    isQueen(): Boolean {
        return this.type === Type.QUEEN;
    }
    isKing(): Boolean {
        return this.type === Type.KING;
    }
}





