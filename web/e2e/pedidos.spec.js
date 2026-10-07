import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
  const resposta = await request.post("http://localhost:3000/__reset");
  expect(resposta.status()).toBe(204);
  await page.goto("/");
  await page.getByRole("button", { name: "Pedidos" }).click();

  await expect(page.getByLabel("Cliente")).toContainText("Ana Souza");
  await expect(page.getByLabel("Produto")).toContainText("Coxinha");
});

test("P1: lista os pedidos iniciais", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(2);

  await expect(
    page.getByRole("cell", { name: "1", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: "Ana Souza" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "2x Coxinha" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "R$ 10,00" })).toBeVisible();
  await expect(page.getByLabel("Status do pedido 1")).toHaveValue("pendente");
});

test("P2: monta um pedido com um item", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption("Bruno Lima");
  await page.getByLabel("Produto").selectOption("Pastel");
  await expect(page.getByLabel("Quantidade")).toHaveValue("1");
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await expect(page.getByRole("listitem")).toHaveText("1x Pastel");

  await page.getByRole("button", { name: "Criar pedido" }).click();

  const linha = page.getByRole("row", { name: /Bruno Lima/ });
  await expect(linha).toBeVisible();
  await expect(linha).toContainText("1x Pastel");
  await expect(linha).toContainText("R$ 8,00");
  await expect(linha.getByRole("combobox")).toHaveValue("pendente");

  await expect(page.getByLabel("Cliente")).toHaveValue("");
  await expect(page.getByRole("listitem")).toHaveCount(0);
});

test("P3: monta um pedido com varios itens e quantidades", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption("Ana Souza");

  await page.getByLabel("Produto").selectOption("Coxinha");
  await page.getByLabel("Quantidade").fill("3");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await page.getByLabel("Produto").selectOption("Empada");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(page.getByRole("listitem")).toHaveText([
    "3x Coxinha",
    "1x Empada",
  ]);

  await page.getByRole("button", { name: "Criar pedido" }).click();

  const linha = page.getByRole("row", { name: /3x Coxinha/ });
  await expect(linha).toBeVisible();
  await expect(linha).toContainText("3x Coxinha, 1x Empada");
  await expect(linha).toContainText("R$ 21,00");
});

test("P4: quantidade volta a 1 apos adicionar item", async ({ page }) => {
  
  await page.getByLabel("Produto").selectOption("Coxinha");
  await page.getByLabel("Quantidade").fill("5");
  await expect(page.getByLabel("Quantidade")).toHaveValue("5");

  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(page.getByRole("listitem")).toHaveText("5x Coxinha");
  await expect(page.getByLabel("Quantidade")).toHaveValue("1");
});

test("P5: nao cria pedido sem cliente", async ({ page }) => {
  await page.getByLabel("Produto").selectOption("Coxinha");
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(page.getByText("Cliente e obrigatorio")).toBeVisible();
  
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("P6: nao cria pedido sem itens", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption("Ana Souza");
  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(
    page.getByText("Pedido deve ter ao menos um item"),
  ).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("P7: altera o status de um pedido", async ({ page }) => {
  const status = page.getByLabel("Status do pedido 1");
  await status.selectOption("pago");

  await expect(status).toHaveValue("pago");
});

test("P8: pedido cancelado nao pode ser alterado", async ({ page }) => {
  const status = page.getByLabel("Status do pedido 1");

  await status.selectOption("cancelado");
  await expect(status).toHaveValue("cancelado");

  await status.selectOption("pago");

  await expect(
    page.getByText("Pedido cancelado nao pode ser alterado"),
  ).toBeVisible();
  
  await expect(status).toHaveValue("cancelado");
});

test("P9: remove um pedido", async ({ page }) => {
  const linha = page.getByRole("row", { name: /Ana Souza/ });
  await linha.getByRole("button", { name: "Remover" }).click();

  await expect(linha).toHaveCount(0);
  
  await expect(page.getByRole("row")).toHaveCount(1);
});

test("P10 (desafio): ciclo completo do pedido", async ({ page }) => {
  
  await page.getByLabel("Cliente").selectOption("Bruno Lima");
  await page.getByLabel("Produto").selectOption("Empada");
  await page.getByLabel("Quantidade").fill("2");
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await page.getByRole("button", { name: "Criar pedido" }).click();

  const linha = page.getByRole("row", { name: /Bruno Lima/ });
  await expect(linha).toContainText("2x Empada");
  await expect(linha).toContainText("R$ 12,00");
  const status = linha.getByRole("combobox");
  await expect(status).toHaveValue("pendente");
  await expect(page.getByRole("row")).toHaveCount(3);

 
  await status.selectOption("pago");
  await expect(status).toHaveValue("pago");

  
  await status.selectOption("cancelado");
  await expect(status).toHaveValue("cancelado");


  await status.selectOption("pendente");
  await expect(
    page.getByText("Pedido cancelado nao pode ser alterado"),
  ).toBeVisible();
  await expect(status).toHaveValue("cancelado");


  await linha.getByRole("button", { name: "Remover" }).click();
  await expect(linha).toHaveCount(0);
  await expect(page.getByRole("row")).toHaveCount(2);
});
