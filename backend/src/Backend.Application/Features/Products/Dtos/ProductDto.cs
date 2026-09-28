namespace Backend.Application.Features.Products.Dtos;

public record ProductDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
