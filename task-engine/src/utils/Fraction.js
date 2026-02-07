export class Fraction {
    constructor(num, den = 1) {
        if (den === 0) throw new Error("Division by zero");
        const g = this.gcd(Math.abs(num), Math.abs(den));
        this.num = num / g;
        this.den = den / g;
        if (this.den < 0) {
            this.num = -this.num;
            this.den = -this.den;
        }
    }

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    add(other) {
        return new Fraction(
            this.num * other.den + other.num * this.den,
            this.den * other.den
        );
    }

    sub(other) {
        return new Fraction(
            this.num * other.den - other.num * this.den,
            this.den * other.den
        );
    }

    mul(other) {
        return new Fraction(
            this.num * other.num,
            this.den * other.den
        );
    }

    div(other) {
        return new Fraction(
            this.num * other.den,
            this.den * other.num
        );
    }

    pow(n) {
        if (n === 0) return new Fraction(1);
        if (n < 0) return new Fraction(this.den, this.num).pow(-n);
        return new Fraction(
            Math.pow(this.num, n),
            Math.pow(this.den, n)
        );
    }

    toString() {
        if (this.den === 1) return String(this.num);
        return `${this.num}/${this.den}`;
    }

    toLatex() {
        if (this.den === 1) return String(this.num);
        return `\\frac{${this.num}}{${this.den}}`;
    }
}