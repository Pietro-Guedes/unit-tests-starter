const request = require("supertest");

const createApp = require("../app");

describe("API /produtos testes de integração", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe("GET /produtos", () => {
    test("Retorna 200 e um array com os produtos iniciais", async () => {
      const res = await request(app).get("/produtos");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });
  });

  //criar caos de teste do Get/produtos/id

  describe("POST /produtos", () => {
    test("Retorna 201 e o produto criado com id gerado", async () => {
      const novoProduto = { nome: "Kibe", preco: 4 };

      const res = await request(app).post("/produtos").send(novoProduto);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("nome", "Kibe");
      expect(res.body).toHaveProperty("preco", 4);
    });

    test("Retorna 400 com { erro: ... } quando o nome estiver faltando", async () => {
      const res = await request(app).post("/produtos").send({ preco: 4 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro");
    });

    test("Retorna 400 com { erro: ... } quando o preco estiver faltando", async () => {
      const res = await request(app).post("/produtos").send({ nome: "Kibe" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro");
    });

    test("O produto criado deve aparecer em uma chamada seguinte a GET /produtos", async () => {
      const novoProduto = { nome: "Kibe", preco: 4 };

      await request(app).post("/produtos").send(novoProduto);
      const res = await request(app).get("/produtos");

      const nomes = res.body.map((p) => p.nome);
      expect(nomes).toContain("Kibe");
    });
  });

  describe("DELETE /produtos/:id", () => {
    test("Retorna 204 quando o produto e removido com sucesso", async () => {
      const res = await request(app).delete("/produtos/1");

      expect(res.status).toBe(204);
    });

    test("O produto removido nao deve mais aparecer em GET /produtos/:id (deve retornar 404)", async () => {
      await request(app).delete("/produtos/1");
      const res = await request(app).get("/produtos/1");

      expect(res.status).toBe(404);
    });

    test("Retorna 404 com { erro: ... } quando o produto nao existir", async () => {
      const res = await request(app).delete("/produtos/9999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("erro");
    });
  });
});
