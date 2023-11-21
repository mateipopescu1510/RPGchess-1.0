import Utils, { Direction, Ability, Type, Side } from "./Utils";

export class Piece {
    private side: Side;
    private type: Type;
    private initialSquare: [number, number];
    private ranges: number[];
    private directions: Direction[];
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
        ranges: number[] = [],
        directions: Direction[] = [],
        canLevelUp: Boolean = false,
        captureMultiplier: number = 0,
        abilityCapacity: number = 0,
        abilities: Ability[] = [],
        XP: number = 0,
        level: number = 0) {

        this.side = side;
        this.type = type;
        this.initialSquare = initialSquare;
        this.ranges = ranges;
        this.directions = directions;
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

    setRanges(ranges: number[]) {
        this.ranges = ranges;
    }
    setOneRange(range: number, index: number): Boolean {
        if (this.ranges.length <= index)
            return false;

        this.ranges[index] = range;
        return true;
    }
    getRanges(): number[] {
        return this.ranges;
    }

    setDirections(directions: Direction[]) {
        this.directions = directions;
    }
    getDirections(): Direction[] {
        return this.directions;
    }
    addDirection(direction: Direction, range: number = 1) {
        if (this.directions.indexOf(direction) != -1)
            return false;

        this.directions.push(direction);
        this.ranges.push(range);
        return true;
    }
    removeDirection(direction: Direction) {
        this.directions.splice(this.directions.indexOf(direction), 1);
    }
    rangeOf(direction: Direction): number {
        let index: number = this.directions.indexOf(direction);
        if (index === -1)
            return -1;

        return this.ranges[index];
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
        if (this.abilities.indexOf(ability) != -1)
            return false;

        this.abilities.push(ability);
        return true;
    }
    removeAbility(ability: Ability) {
        this.abilities.splice(this.abilities.indexOf(ability), 1);
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
}
