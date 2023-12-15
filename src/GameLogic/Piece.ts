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
        this.abilities = [];
        this.setAbilities(abilities);
        this.XP = XP;
        this.level = level;

        switch (this.type) {
            case Type.PAWN: {
                this.attacks = [[Direction.PAWN, 1]];
                this.levelUpXP = Utils.PAWN_LEVELUP_XP;
                this.captureMultiplier = Utils.PAWN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.PAWN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.PAWN_MAX_LEVEL;
                break;
            }
            case Type.BISHOP: {
                this.attacks = [[Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.BISHOP_LEVELUP_XP;
                this.captureMultiplier = Utils.BISHOP_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.BISHOP_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.BISHOP_MAX_LEVEL;
                break;
            }
            case Type.KNIGHT: {
                this.attacks = [[Direction.L, 1]];
                this.levelUpXP = Utils.KNIGHT_LEVELUP_XP;
                this.captureMultiplier = Utils.KNIGHT_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KNIGHT_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KNIGHT_MAX_LEVEL;
                break;
            }
            case Type.ROOK: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.ROOK_LEVELUP_XP;
                this.captureMultiplier = Utils.ROOK_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.ROOK_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.ROOK_MAX_LEVEL;
                break;
            }
            case Type.QUEEN: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE], [Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = Utils.QUEEN_LEVELUP_XP;
                this.captureMultiplier = Utils.QUEEN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.QUEEN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.QUEEN_MAX_LEVEL;
                break;
            }
            case Type.KING: {
                this.attacks = [[Direction.LINE, 1], [Direction.DIAGONAL, 1], [Direction.CASTLING, 1]];
                this.levelUpXP = Utils.KING_LEVELUP_XP;
                this.captureMultiplier = Utils.KING_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KING_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KING_MAX_LEVEL;
                break;
            }
            default: {
                this.attacks = [];
                this.levelUpXP = [];
                this.captureMultiplier = 0;
                this.abilityCapacity = 0;
                this.maxLevel = 0;
                break;
            }
        }

        this.totalXP = 0;
        for (let lvl = 0; lvl < this.level; lvl++)
            this.totalXP += this.levelUpXP[lvl];
        this.totalXP += this.XP;

        this.moveCounter = 0;
        this.isMaxLevel = level >= this.maxLevel;
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
    decrementAbilityCapacity(): Boolean {
        if (this.abilityCapacity <= this.abilities.length)
            return false;

        this.abilityCapacity--;
        return true;
    }

    setAbilities(abilities: [Ability, number][]) {
        this.abilities = abilities;
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
    private increaseTimesUsed(ability: Ability, isDisability: Boolean = false): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
        if (index === -1)
            return false;

        this.abilities[index][1]++;

        if (this.timesUsed(ability) === (isDisability ? Utils.DISABILITY_MAX_TIMES_USED : Utils.ABILITY_MAX_TIMES_USED))
            this.removeAbility(ability);

        return true;
    }

    addAbility(ability: Ability): Boolean {
        if (this.abilities.length === this.abilityCapacity)
            return false;
        if (this.getAbilitiesNames().indexOf(ability) !== -1)
            return false;

        switch (ability) {
            case Ability.ARCHBISHOP || Ability.CHANCELLOR || Ability.ON_HORSE: {
                this.addAttack([Direction.L, 1]);
                break;
            }
            case Ability.HAS_PAWN: {
                this.addAttack([Direction.PAWN, 1]);
                break;
            }
            case Ability.SWEEPER: {
                this.addAttack([Direction.L, 1]);
                this.updateAttackRange(Direction.LINE, 2);
                this.updateAttackRange(Direction.DIAGONAL, 2);
                break;
            }
        }

        this.abilities.push([ability, 0]);
        return true;
    }
    removeAbility(ability: Ability): Boolean {
        let index: number = this.getAbilitiesNames().indexOf(ability);
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
        if (!this.canLevelUp || this.isMaxLevel)
            return false;

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
    incrementMoveCounter(ability: Ability = Ability.NONE) {
        this.moveCounter++;

        for (let disability of Utils.disabilitiesList)
            if (this.hasAbility(disability))
                this.increaseTimesUsed(disability, true);

        if (ability !== Ability.NONE)
            this.increaseTimesUsed(ability);
        /*
            TODO
            If no ability was last used:
            - increase base move counter
            - increase timesUsed for any disabilities
            If an ability was last used:
            - same as before
            - increase timesUsed also for the used ability

            After any timesUsed of an ability is modified, check to see if limit is reached and remove if so. Set limits as constants in Utils
        */

    }

    reachedMaxLevel(): Boolean {
        return this.isMaxLevel;
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
}
// var p: Piece = new Piece(Side.BLACK, Type.BISHOP, [-1, -1], true, [[Ability.ANCHOR, 1], [Ability.ARCHBISHOP, 0]]);

// console.log(p.getAbilities());
// p.incrementMoveCounter(Ability.ARCHBISHOP);
// console.log(p.getAbilities());
// console.log(p.hasAbility(Ability.ANCHOR));
// console.log(p.hasAbility(Ability.SCOUT));

