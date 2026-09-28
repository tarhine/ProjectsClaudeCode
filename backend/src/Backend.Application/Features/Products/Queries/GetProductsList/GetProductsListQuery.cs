using Backend.Application.Features.Products.Dtos;
using MediatR;

namespace Backend.Application.Features.Products.Queries.GetProductsList;

public record GetProductsListQuery : IRequest<List<ProductDto>>;
