using Backend.Application.Features.Products.Dtos;
using Backend.Domain.Entities;

namespace Backend.Application.Common.Mappings;

public static class ProductMappingExtensions
{
    public static ProductDto ToDto(this Product product) => new(
        product.Id,
        product.Name,
        product.Description,
        product.Price,
        product.StockQuantity,
        product.CreatedAtUtc,
        product.UpdatedAtUtc);
}
