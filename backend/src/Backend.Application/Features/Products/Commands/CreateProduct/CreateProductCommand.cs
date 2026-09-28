using Backend.Application.Features.Products.Dtos;
using MediatR;

namespace Backend.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity) : IRequest<ProductDto>;
