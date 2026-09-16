const {
  soma,
  subtrai,
  multiplica,
  divide,
  ehPar,
  raiz,
  media,
} = require("./calculadora");

describe("soma", () => {
  test("Soma com dois números positivos", () => {
    expect(soma(2, 3)).toBe(5);
  });
});

describe("subtrai", () => {
  test("Deve retornar o resultado correto da subtração", () => {
    expect(subtrai(5, 3)).toBe(2);
  });

  test("Deve retornar um número negativo quando o resultado for negativo", () => {
    expect(subtrai(3, 5)).toBeLessThan(0);
  });
});

describe("multiplica", () => {
  test("Deve retornar o produto correto de dois números", () => {
    expect(multiplica(4, 3)).toBe(12);
  });

  test("Deve retornar 0 quando um dos fatores for 0", () => {
    expect(multiplica(5, 0)).toBe(0);
  });

  test("O resultado deve ser maior do que cada um dos fatores individualmente (quando ambos forem maiores que 1)", () => {
    const a = 3;
    const b = 4;
    const resultado = multiplica(a, b);
    expect(resultado).toBeGreaterThan(a);
    expect(resultado).toBeGreaterThan(b);
  });
});

describe("divide", () => {
  test("Deve retornar o resultado correto da divisão", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("Deve lançar o erro 'Nao e possivel dividir por zero' quando b for 0", () => {
    expect(() => divide(10, 0)).toThrow("Nao e possivel dividir por zero");
  });
});

describe("ehPar", () => {
  test("Deve retornar um valor verdadeiro para número par", () => {
    expect(ehPar(4)).toBeTruthy();
  });

  test("Deve retornar um valor falso para número ímpar", () => {
    expect(ehPar(3)).toBeFalsy();
  });
});

describe("raiz", () => {
  test("Calcula a raiz de número não exato com precisão", () => {
    expect(raiz(2)).toBeCloseTo(1.414);
  });

  test("Lançar erro para número negativo", () => {
    expect(() => raiz(-4)).toThrow(
      "Nao e possivel calcular raiz de numero negativo",
    );
  });
});

describe("media", () => {
  test("Deve calcular corretamente a média de uma lista de inteiros", () => {
    expect(media([2, 4, 6])).toBe(4);
  });

  test("Deve calcular corretamente a média quando o resultado for decimal", () => {
    expect(media([1, 2, 4])).toBeCloseTo(2.333);
  });

  test("Deve lançar erro quando a lista estiver vazia", () => {
    expect(() => media([])).toThrow("A lista de numeros nao pode ser vazia");
  });

  test("Deve lançar erro quando o argumento não for um array", () => {
    expect(() => media("nao sou um array")).toThrow(
      "A lista de numeros nao pode ser vazia",
    );
  });
});
