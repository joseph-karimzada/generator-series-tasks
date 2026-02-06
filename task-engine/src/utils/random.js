// random.js
import crypto from "crypto";

/**
 * Seeded pseudo-random number generator using PCG algorithm.
 * Provides deterministic random values from a seed string.
 */
export class SeededRandom {
    /**
     * Creates a new seeded random number generator.
     * @param {string} seed - Seed string for deterministic random generation
     */
    constructor(seed) {
        // Hash the seed to get a consistent initial state
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        this.state = BigInt("0x" + hash); // Current RNG state
        this.mod = 2n ** 53n;              // Modulus for PCG algorithm
        this.mult = 6364136223846793005n;  // Multiplier constant
        this.inc = 1n;                     // Increment constant
    }

    /**
     * Generates next random float in range [0, 1).
     * @returns {number} Random float between 0 (inclusive) and 1 (exclusive)
     */
    next() {
        // Advance internal state using linear congruential generator
        this.state = (this.state * this.mult + this.inc) % this.mod;
        // Convert to float in [0, 1)
        return Number(this.state) / Number(this.mod);
    }

    /**
     * Generates random integer in range [min, max] (inclusive).
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * @returns {number} Random integer in [min, max]
     */
    randint(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Selects random element from array.
     * @param {Array} array - Array to choose from
     * @returns {*} Random element from array
     */
    choice(array) {
        return array[this.randint(0, array.length - 1)];
    }

    /**
     * Returns shuffled copy of array (does not modify original).
     * Uses Fisher-Yates shuffle algorithm.
     * @param {Array} array - Array to shuffle
     * @returns {Array} New shuffled array
     */
    shuffle(array) {
        const arr = [...array];
        // Fisher-Yates shuffle: iterate backwards, swapping with random earlier position
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.randint(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Selects random item from weighted array.
     * Each item should have a 'weight' property (higher = more likely).
     * @param {Array<Object>} items - Array of objects with 'weight' property
     * @returns {Object} Randomly selected item (entire object including weight)
     * @example
     * weightedChoice([
     *   {value: 'rare', weight: 0.1},
     *   {value: 'common', weight: 0.9}
     * ])
     */
    weightedChoice(items) {
        // Sum all weights to get total probability space
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

        // Pick random point in [0, totalWeight)
        let random = this.next() * totalWeight;

        // Walk through items, subtracting weights until we hit our random point
        for (const item of items) {
            random -= item.weight;
            if (random < 0) {
                return item;
            }
        }

        // Fallback for floating-point edge cases (shouldn't normally happen)
        return items[items.length - 1];
    }
}