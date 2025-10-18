import crypto from "crypto";
export class SeededRandom {
    constructor(seed) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        this.state = BigInt("0x" + hash); // keep as BigInt
        this.mod = 2n ** 53n;            // modulus as BigInt
        this.mult = 6364136223846793005n;
        this.inc = 1n;
    }

    next() {
        this.state = (this.state * this.mult + this.inc) % this.mod;
        return Number(this.state) / Number(this.mod); // convert to fraction
    }

    randint(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    choice(array) {
        return array[this.randint(0, array.length - 1)];
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.randint(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}
