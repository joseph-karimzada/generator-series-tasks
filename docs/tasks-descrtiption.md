# List of Types of Series Problems

## Series Sums

### Sum of Geometric Progressions [SeriesSumGeometricProgressionTask]

Find the sum of the infinite series:

$$\sum_{n=n_0}^{\infty} \frac{a^{i_a n + j_a} \pm b^{i_b n + j_b}}{c^n}$$

Example:

$$\sum_{n=1}^{\infty} \frac{2^{2 n - 1} + 3^{n}}{5^n}$$

Where:
- $n_0$: initial summation index;
- $a, b, c$: bases of the powers;
- $i_a, i_b$: coefficients of $n$ in the exponents;
- $j_a, j_b$: constant shifts in the exponents.

### Telescoping Series [SeriesSumTelescopingTask]

Find the sum of the infinite series:

$$\sum_{n=n_0}^{\infty} \frac{c}{(n+a)(n+b)}$$

Example:

$$\sum_{n=3}^{\infty} \frac{6}{(n - 1)(n + 2)}$$

Where:
- $n_0$: initial summation index;
- $a, b$: shifts in the denominators;
- $c$: coefficient in the numerator.

## Necessary Condition for Convergence

### Fraction with Polynomials [NecessaryConditionPolynomialFractionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{P(n)}{Q(n)}$$

Example:

$$\sum_{n=1}^{\infty} \frac{(2n+3)^2}{(3n+1)(n+4)}$$

Where:
- $n_0$: initial summation index;
- $P(n)$: polynomial in the numerator;
- $Q(n)$: polynomial in the denominator.

### Fraction with Polynomial and Radical [NecessaryConditionPolynomialRadicalTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{\sqrt[m]{P(n)}}{Q(n)}$$

Example:

$$\sum_{n=1}^{\infty} \frac{\sqrt[3]{3n^4+5n+1}}{7n^2+3}$$

Where:
- $n_0$: initial summation index;
- $m$: degree of the root;
- $P(n)$: polynomial inside the root;
- $Q(n)$: polynomial in the denominator.

### Fraction with Powers [NecessaryConditionPowerFractionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{a^n \pm b^{n+j}}{c \cdot d^n + e \cdot f^n}$$

Example:

$$\sum_{n=1}^{\infty} \frac{2^n + 7^{n+1}}{5 \cdot 3^n + 4 \cdot 7^n}$$

Where:
- $n_0$: initial summation index;
- $a, b, d, f$: bases of the powers;
- $j$: shift in the exponent;
- $c, e$: coefficients in the denominator.

### Difference of Radicals [NecessaryConditionRadicalDifferenceTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \left( \sqrt{P(n)} - \sqrt{Q(n)} \right)$$

Example:

$$\sum_{n=1}^{\infty} \left( \sqrt{n^2+5n+3} - \sqrt{n^2+2n} \right)$$

Where:
- $n_0$: initial summation index;
- $P(n)$: quadratic polynomial under the first root;
- $Q(n)$: quadratic polynomial under the second root.

### Equivalent Infinitesimals [NecessaryConditionInfinitesimalTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{f\left(\frac{1}{n}\right)}{g\left(\frac{1}{n}\right)^p}$$

Example:

$$\sum_{n=1}^{\infty} \frac{1 - \cos \frac{3}{n}}{\left(\arctan \frac{5}{n+1}\right)^2}$$

Where:
- $n_0$: initial summation index;
- $f\left(\frac{1}{n}\right)$: equivalent infinitesimal function in the numerator (e.g., $1 - \cos \frac{a}{n+b}$);
- $g\left(\frac{1}{n}\right)$: equivalent infinitesimal function in the denominator (e.g., $\arctan \frac{c}{n+d}$);
- $p$: degree in the denominator.

### Logarithm and Equivalent Infinitesimals [NecessaryConditionLogInfinitesimalTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} n^p \ln \left(1 + \alpha\left(\frac{c}{P(n)}\right)\right)$$

Example:

$$\sum_{n=1}^{\infty} n^2 \ln \left(1 + \frac{5}{3n^2+1}\right)$$

Where:
- $n_0$: initial summation index;
- $p$: degree of $n$ before the logarithm;
- $P$: polynomial;
- $c$: constant in the infinitesimal function;
- $\alpha\left(\frac{1}{n}\right)$: equivalent infinitesimal function inside the logarithm (e.g., $\frac{a}{bn^q + c}$).

### Second Remarkable Limit [NecessaryConditionSecondRemarkableLimitTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \left(\frac{P(n)}{Q(n)}\right)^{kn}$$

Example:

$$\sum_{n=1}^\infty \left(\frac{4n+3}{4n+8}\right)^{3n}$$

Where:
- $n_0$: initial summation index;
- $P(n)$: linear polynomial in the numerator;
- $Q(n)$: linear polynomial in the denominator;
- $k$: coefficient in the exponent.

### Exponential-Power Sequence [NecessaryConditionExponentialPowerTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} P(n)^{\frac{c}{n}}$$

Example:

$$\sum_{n=1}^{\infty} (3n+1)^\frac{2}{n}$$

Where:
- $n_0$: initial summation index;
- $P(n)$: linear polynomial in the base;
- $c$: coefficient in the exponent.

## First Comparison Test

### Comparison with Harmonic Series [FirstComparisonHarmonicSeriesTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{1}{\ln n}$$

Example:

$$\sum_{n=2}^{\infty} \frac{1}{\ln n}$$

Where:
- $n_0$: initial summation index (usually $n_0 \geq 2$).

### Comparison with Dirichlet Series [FirstComparisonDirichletSeriesTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{|\cos (an)|}{n^p}$$

Example:

$$\sum_{n=1}^{\infty} \frac{|\cos 3n|}{n^3}$$

Where:
- $n_0$: initial summation index;
- $a$: coefficient in the cosine argument;
- $p$: degree in the denominator.

### Comparison with Geometric Series [FirstComparisonGeometricSeriesTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{a^n}{n^p \cdot b^n}$$

Example:

$$\sum_{n=1}^{\infty} \frac{2^n}{n \cdot 3^n}$$

Where:
- $n_0$: initial summation index;
- $a, b$: bases of the powers;
- $p$: degree of $n$ in the denominator.

## Limit Comparison Test

### Comparison with Dirichlet Series [LimitComparisonDirichletTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{a}{P(n)^p}$$

Example:

$$\sum_{n=1}^{\infty} \frac{5}{(2n+1)^2}$$

Where:
- $n_0$: initial summation index;
- $a$: coefficient in the numerator;
- $P(n)$: linear polynomial in the denominator;
- $p$: degree in the denominator.

### Comparison with Dirichlet Series and Infinitesimals [LimitComparisonInfinitesimalTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \sqrt{P(n)} \cdot f\left(\frac{1}{n}\right)$$

or

$$\sum_{n=n_0}^{\infty} g\left(\frac{1}{\sqrt{n}}\right)^r$$

or

$$\sum_{n=n_0}^{\infty} n^v \cdot \left(e^{\alpha\left(\frac{1}{\sqrt{n}}\right)}-1\right)^x$$

Example:

$$\sum_{n=1}^{\infty} \sqrt{n^3+2} \cdot \tan \frac{2}{5n^3+7}$$

or

$$\sum_{n=1}^{\infty} \arcsin^2\frac{3}{\sqrt{10n+2}}$$

or

$$\sum_{n=1}^{\infty} n^2\cdot(e^{1/\sqrt{n+2}}-1)^5$$

Where:
- $n_0$: initial summation index;
- $P(n)$: polynomial under the root or elsewhere;
- $f\left(\frac{1}{n}\right)$: equivalent infinitesimal function (e.g., $\tan \frac{c}{dn^l+e}$);
- $g\left(\frac{1}{\sqrt{n}}\right)$: equivalent infinitesimal function (e.g., $\arcsin \frac{s}{\sqrt{tn+u}}$);
- $\alpha\left(\frac{1}{\sqrt{n}}\right)$: equivalent infinitesimal function inside the exponential (e.g., $\frac{1}{\sqrt{n+w}}$);
- $r, v, x$: degrees and exponents.

## D'Alembert's Test

### Polynomial-Power Product [DAlembertPolynomialPowerTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{P(n)}{c^n}$$

Example:

$$\sum_{n=1}^{\infty} \frac{3n+5}{7^n}$$

Where:
- $n_0$: initial summation index;
- $P(n)$: linear polynomial in the numerator;
- $c$: base of the power in the denominator.

### Factorial-Power Product [DAlembertFactorialPowerTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{a(n+b)!}{c^n}$$

Example:

$$\sum_{n=1}^{\infty} \frac{2(n+1)!}{3^n}$$

Where:
- $n_0$: initial summation index;
- $a, b$: coefficients;
- $c$: base of the power.

### Factorial Fraction [DAlembertFactorialFractionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{(n!)^p}{(an+b)!}$$

Example:

$$\sum_{n=1}^{\infty} \frac{(n!)^2}{(2n+1)!}$$

Where:
- $n_0$: initial summation index;
- $p$: degree of the factorial in the numerator;
- $a, b$: coefficients in the denominator.

### Factorial over Double Factorial [DAlembertFactorialDoubleFactorialTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{(n+a)!}{(bn)!!}$$

Example:

$$\sum_{n=1}^{\infty} \frac{(n+3)!}{(2n)!!}$$

Where:
- $n_0$: initial summation index;
- $a, b$: coefficients.

### Power Fraction with Factorial in Denominator [DAlembertPowerFactorialTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{n^p}{a^n n!}$$

Example:

$$\sum_{n=1}^{\infty} \frac{n}{2^n n!}$$

Where:
- $n_0$: initial summation index;
- $p$: degree of $n$ in the numerator;
- $a$: base of the power in the denominator.

## Cauchy's Radical Test

### Polynomial Fraction in Power Proportional to n [CauchyRadicalPolynomialFractionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \left(\frac{P(n)}{Q(n)}\right)^{kn}$$

Example:

$$\sum_{n=1}^{\infty} \left(\frac{3n+1}{5n+2}\right)^{2n}$$

Where:
- $n_0$: initial summation index;
- $P(n)$: linear polynomial in the numerator;
- $Q(n)$: linear polynomial in the denominator;
- $k$: coefficient in the exponent.

### Power and Inverse Function Product [CauchyRadicalInverseFunctionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{1}{a^n} f(n)^{kn}$$

Example:

$$\sum_{n=1}^{\infty} \frac{1}{2^n}(\arctan n)^{2n}$$

Where:
- $n_0$: initial summation index;
- $a$: base of the power in the denominator;
- $k$: coefficient in the exponent;
- $f(n)$: function in the power (e.g., $\arctan n$).

### Second Remarkable Limit in Power n [CauchyRadicalSecondRemarkableLimitTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \left(\frac{P(n)}{Q(n)}\right)^{kn^p}$$

or

$$\sum_{n=n_0}^{\infty} \left(\frac{R(n)}{S(n)}\right)^{n^r}$$

Example:

$$\sum_{n=1}^{\infty} \left(\frac{4n+3}{4n+5}\right)^{2n^{2}}$$

or

$$\sum_{n=1}^{\infty} \left(\frac{5n^3 + 1}{5n^3 + 7}\right)^{n^3}$$

Where:
- $n_0$: initial summation index;
- $P(n), Q(n), R(n), S(n)$: polynomials in the fractions (linear or higher degree);
- $k, p, r$: degrees and exponents.

### Second Remarkable Limit in Power n with Infinitesimal Equivalent [CauchyRadicalInfinitesimalLimitTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} a^{-n} \left( f\left(\frac{1}{n}\right) \right)^{pn}$$

Example:

$$\sum_{n=1}^{\infty} 5^{-n} \left( \sin \frac{2}{3n^{2} + 1} \right)^{4n}$$

Where:
- $n_0$: initial summation index;
- $a$: base of the power;
- $f\left(\frac{1}{n}\right)$: equivalent infinitesimal function (e.g., $\sin \frac{b}{cn^k + d}$);
- $p$: coefficient in the exponent.

## Cauchy's Integral Test

### Integration with Substitution $\ln x$ [CauchyIntegralLogSubstitutionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{1}{n \ln^p n}$$

or

$$\sum_{n=n_0}^{\infty} \frac{1}{n \sqrt[q]{\ln n}}$$

or

$$\sum_{n=n_0}^{\infty} \frac{1}{n (\ln n + r)}$$

Example:

$$\sum_{n=2}^{\infty} \frac{1}{n \ln^3 n}$$

or

$$\sum_{n=2}^{\infty} \frac{1}{n \sqrt[3]{\ln n}}$$

or

$$\sum_{n=1}^{\infty} \frac{1}{n (\ln n + 7)}$$

Where:
- $n_0$: initial summation index (usually $n_0 \geq 2$);
- $p, q, r$: degrees and coefficients.

### Integration of Complex Function with Substitution $\ln x$ [CauchyIntegralComplexLogTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{1}{n \ln n (\ln \ln n)^p}$$

Example:

$$\sum_{n=2}^{\infty} \frac{1}{n \ln n (\ln \ln n)^5}$$

Where:
- $n_0$: initial summation index (usually $n_0 \geq 2$);
- $p$: degree of the double logarithm.

### Integration with Substitution $\sqrt{x}$ [CauchyIntegralSqrtSubstitutionTask]

Investigate the following series for convergence:

$$\sum_{n=n_0}^{\infty} \frac{e^{G(\sqrt{n})}}{H(\sqrt{n})}$$

Example:

$$\sum_{n=1}^{\infty} \frac{e^{-\sqrt{n}}}{\sqrt{n}}$$

Where:
- $n_0$: initial summation index;
- $G(\sqrt{n})$: function of $\sqrt{n}$ in the exponential (e.g., $\sqrt{n}$);
- $H(\sqrt{n})$: function of $\sqrt{n}$ in the denominator (e.g., $\sqrt{n}$).