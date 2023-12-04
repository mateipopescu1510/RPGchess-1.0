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
    //private totalXP: number;
    private level: number;
    private moveCounter: number;
    private highlighted: Boolean;

    constructor(side: Side = Side.NONE,
        type: Type = Type.EMPTY,
        initialSquare: [number, number] = [-1, -1],
        attacks: [Direction, number][] = [],
        canLevelUp: Boolean = false,
        captureMultiplier: number = 0,
        abilityCapacity: number = 0,
        abilities: Ability[] = [],
        XP: number = 0,
        level: number = 0) {

        this.side = side;
        this.type = type;
        this.initialSquare = initialSquare;
        this.attacks = attacks;
        this.canLevelUp = canLevelUp;
        this.captureMultiplier = captureMultiplier;
        this.abilityCapacity = abilityCapacity;
        this.abilities = abilities;
        this.XP = XP;
        this.level = level;
        this.moveCounter = 0;
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
    updateAttackRange(direction: Direction, range: number): Boolean {
        let index: number = this.getAttackDirections().indexOf(direction);
        if (index === -1)
            return false;

        this.attacks[index][1] = range;
        return true;
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
    //! Rework leveling up mechanic, add piece-specific level-up tables 
    addXP(capturedXP: number): Boolean {
        this.XP += Utils.PER_MOVE_XP + Math.floor(this.captureMultiplier * capturedXP);

        return Utils.LEVEL_UP_XP[this.level] <= this.XP;
    }

    //! totalXP setter, getter once level-up tables are reworked
    /*setTotalXP(totalXP: number) {
        this.totalXP = totalXP;
    }
    getTotalXP(): number {
        return this.totalXP;
    }
    */

    setLevel(level: number) {
        this.level = level;
    }
    getLevel(): number {
        return this.level;
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

    isEmpty() {
        return this.type === Type.EMPTY;
    }
    isNotEmpty() {
        return this.type !== Type.EMPTY;
    }
}





