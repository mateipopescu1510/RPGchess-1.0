import Utils, { Direction, Ability, Type, Side, QUEEN_ABILITIES } from "./Utils";

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
    private maxAbilityCapacity: number;
    private maxCaptureMultiplier: number;
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

        this.possibleAbilities = []

        switch (this.type) {
            case Type.PAWN: {
                this.attacks = [[Direction.PAWN, 1]];
                this.levelUpXP = [...Utils.PAWN_LEVELUP_XP];
                this.captureMultiplier = Utils.PAWN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.PAWN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.PAWN_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.PAWN_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.PAWN_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.PAWN_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            case Type.BISHOP: {
                this.attacks = [[Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = [...Utils.BISHOP_LEVELUP_XP];
                this.captureMultiplier = Utils.BISHOP_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.BISHOP_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.BISHOP_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.BISHOP_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.BISHOP_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.BISHOP_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            case Type.KNIGHT: {
                this.attacks = [[Direction.L, 1]];
                this.levelUpXP = [...Utils.KNIGHT_LEVELUP_XP];
                this.captureMultiplier = Utils.KNIGHT_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KNIGHT_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KNIGHT_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.KNIGHT_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.KNIGHT_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.KNIGHT_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            case Type.ROOK: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE]];
                this.levelUpXP = [...Utils.ROOK_LEVELUP_XP];
                this.captureMultiplier = Utils.ROOK_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.ROOK_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.ROOK_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.ROOK_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.ROOK_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.ROOK_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            case Type.QUEEN: {
                this.attacks = [[Direction.LINE, Utils.INFINITE_RANGE], [Direction.DIAGONAL, Utils.INFINITE_RANGE]];
                this.levelUpXP = [...Utils.QUEEN_LEVELUP_XP];
                this.captureMultiplier = Utils.QUEEN_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.QUEEN_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.QUEEN_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.QUEEN_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.QUEEN_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.QUEEN_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            case Type.KING: {
                this.attacks = [[Direction.LINE, 1], [Direction.DIAGONAL, 1], [Direction.CASTLING, 1]];
                this.levelUpXP = [...Utils.KING_LEVELUP_XP];
                this.captureMultiplier = Utils.KING_CAPTURE_MULTIPLIER;
                this.abilityCapacity = Utils.KING_DEFAULT_ABILITY_CAPACITY;
                this.maxLevel = Utils.KING_MAX_LEVEL;
                this.possibleAbilities.push(...Utils.KING_ABILITIES);
                this.possibleAbilities.push(...Utils.GENERIC_ABILITIES);
                this.maxAbilityCapacity = Utils.KING_MAX_ABILITY_CAPACITY;
                this.maxCaptureMultiplier = Utils.KING_MAX_CAPTURE_MULTIPLIER;
                break;
            }
            default: {
                this.attacks = [];
                this.levelUpXP = [];
                this.captureMultiplier = 0;
                this.abilityCapacity = 0;
                this.maxLevel = 0;
                this.possibleAbilities = [];
                this.maxAbilityCapacity = 0;
                this.maxCaptureMultiplier = 0;
                break;
            }
        }

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
    increaseCaptureMultiplier(increment: number = 0.2) {
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
        for (let [ability, timesRemaining] of abilities)
            this.addAbility(ability, timesRemaining);
    }
    getAbilities(): [Ability, number][] {
        return this.abilities;
    }
    hasAbility(ability: Ability): Boolean {
        let index: number = this.getAbilitiesIDs().indexOf(ability);
        return index !== -1;
    }

    getAbilitiesIDs(): Ability[] {
        return this.abilities.map(([ability, _]) => ability);
    }
    getAbilitiesNames(): string[] {
        return this.abilities.map(([ability, _]) => Ability[ability]);
    }
    getAbilitiesTimesRemaining(): number[] {
        return this.abilities.map(([_, timesRemaining]) => timesRemaining);
    }
    setTimesRemaining(ability: Ability, timesRemaining: number): Boolean {
        let index: number = this.getAbilitiesIDs().indexOf(ability);
        if (index === -1)
            return false;

        this.abilities[index][1] = timesRemaining;
        return true;
    }
    timesRemaining(ability: Ability): number {
        let index: number = this.getAbilitiesIDs().indexOf(ability);
        if (index === -1)
            return -1;

        return this.abilities[index][1];
    }
    decreaseTimesRemaining(ability: Ability, passive: Boolean = false): Boolean {
        let index: number = this.getAbilitiesIDs().indexOf(ability);
        if (index === -1)
            return false;

        // let maxTimesUsed: number = passive ? Utils.PASSIVE_ABILITY_MAX_TIMES_USED : Utils.ABILITY_MAX_TIMES_USED;
        this.abilities[index][1]--;

        if (this.timesRemaining(ability) <= 0)
            this.removeAbility(ability);

        return true;
    }

    //*ADD/REMOVE ABILITY
    addAbility(ability: Ability, timesRemaining: number = 0): Boolean {
        if (this.abilities.length === this.abilityCapacity && Utils.INSTANT_ABILITIES.indexOf(ability) === -1)
            return false;
        if (this.getAbilitiesIDs().indexOf(ability) !== -1 || this.possibleAbilities.indexOf(ability) === -1)
            return false;

        //TODO modify timesUsed into timesRemaining and have it count down to 0 until ability gets removed
        if (timesRemaining === 0)
            timesRemaining = Utils.PASSIVE_ABILITIES.indexOf(ability) === -1 ? Utils.ABILITY_MAX_TIMES_USED : Utils.PASSIVE_ABILITY_MAX_TIMES_USED;

        switch (ability) {
            case Ability.INCREASE_CAPACITY: {
                this.increaseAbilityCapacity();
                if (this.abilityCapacity >= this.maxAbilityCapacity)
                    this.possibleAbilities.splice(this.possibleAbilities.indexOf(ability), 1);
                return true;
            }
            case Ability.INCREASE_CAPTURE_MULTIPLIER: {
                this.increaseCaptureMultiplier();
                if (this.captureMultiplier >= this.maxCaptureMultiplier)
                    this.possibleAbilities.splice(this.possibleAbilities.indexOf(ability), 1);
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
            case Ability.ON_CAMEL: {
                this.removeAbility(Ability.ON_HORSE);
                break;
            }
            case Ability.ON_HORSE: {
                this.removeAbility(Ability.ON_CAMEL);
                break;
            }
            default: {
                break;
            }
        }

        this.abilities.push([ability, timesRemaining]);
        this.possibleAbilities.splice(this.possibleAbilities.indexOf(ability), 1);
        return true;
    }
    removeAbility(ability: Ability): Boolean {
        let index: number = this.getAbilitiesIDs().indexOf(ability);
        if (index === -1)
            return false;

        this.abilities.splice(index, 1);

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
            case Ability.CHANGE_COLOR:
            case Ability.SHIELD: {
                return true;
            }
            default: {
                break;
            }
        }

        this.possibleAbilities.push(ability);
        return true;
    }

    //*POSSIBLE ABILITIES
    getPossibleAbilitiesIDs(): Ability[] {
        if (this.abilities.length < this.abilityCapacity)
            return this.possibleAbilities;

        let currentPossible: Ability[] = [Ability.NONE];
        if (this.abilityCapacity < this.maxAbilityCapacity)
            currentPossible.push(Ability.INCREASE_CAPACITY);
        if (this.captureMultiplier < this.maxCaptureMultiplier)
            currentPossible.push(Ability.INCREASE_CAPTURE_MULTIPLIER);
        return currentPossible;
    }
    getPossibleAbilitiesNames(): string[] {
        if (this.abilities.length < this.abilityCapacity)
            return this.possibleAbilities.map(abilityID => Ability[abilityID]);

        let currentPossible: Ability[] = [Ability.NONE];
        if (this.abilityCapacity < this.maxAbilityCapacity)
            currentPossible.push(Ability.INCREASE_CAPACITY);
        if (this.captureMultiplier < this.maxCaptureMultiplier)
            currentPossible.push(Ability.INCREASE_CAPTURE_MULTIPLIER);
        return currentPossible.map(ability => Ability[ability]);
    }

    //*XP
    setXP(XP: number) {
        this.XP = XP;
    }
    getXP(): number {
        return this.XP;
    }
    addXP(capturedXP: number): Boolean {
        if (this.isMaxLevel)
            return false;
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

        if (this.level === this.maxLevel)
            this.isMaxLevel = true;

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

        for (let passiveAbility of Utils.PASSIVE_ABILITIES)
            if (this.hasAbility(passiveAbility))
                this.decreaseTimesRemaining(passiveAbility, true);

        if (ability !== Ability.NONE)
            this.decreaseTimesRemaining(ability);
    }

    //*MAX LEVEL
    reachedMaxLevel(): Boolean {
        return this.isMaxLevel;
    }

    //*MAX ABILITY CAPACITY
    getMaxAbilityCapacity(): number {
        return this.maxAbilityCapacity;
    }

    //*MAX CAPTURE MULTIPLIER
    getMaxCaptureMultiplier(): number {
        return this.maxCaptureMultiplier;
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

