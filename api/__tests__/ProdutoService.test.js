const ProdutoService = require("../services/ProdutoService");

describe("ProdutoService - Testes unitários com Mocks", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
    service = new ProdutoService(mockRepository);
  });

  describe("Listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const produtos = [{ id: 1, nome: "Coxinha", preco: 5 }];
      mockRepository.findAll.mockReturnValue(produtos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(produtos);
    });
  });

  describe("BuscarPorId", () => {
    test("chama o repository.findById com o id correto e retorna o produto", () => {
      const produto = { id: 1, nome: "Coxinha", preco: 5 };
      mockRepository.findById.mockReturnValue(produto);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(produto);
    });

    test("lança erro 'Produto nao encontrado' quando o repository retornar null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(999)).toThrow("Produto nao encontrado");
    });
  });

  describe("Criar", () => {
    test("repassa os dados para repository.create e retorna o produto criado", () => {
      const dados = { nome: "Kibe", preco: 4 };
      const produtoCriado = { id: 4, nome: "Kibe", preco: 4 };
      mockRepository.create.mockReturnValue(produtoCriado);

      const resultado = service.criar(dados);

      expect(mockRepository.create).toHaveBeenCalledWith(dados);
      expect(resultado).toEqual(produtoCriado);
    });

    test("propaga o erro lançado pelo repository quando os dados forem inválidos", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("Nome e preco sao obrigatorios");
      });

      expect(() => service.criar({ nome: "Kibe" })).toThrow(
        "Nome e preco sao obrigatorios",
      );
    });
  });

  describe("Remover", () => {
    test("chama repository.delete com o id correto quando o produto existe", () => {
      mockRepository.delete.mockReturnValue(true);

      expect(() => service.remover(1)).not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test("lança erro 'Produto nao encontrado' quando o repository retornar false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Produto nao encontrado");
    });
  });
});
