using Backend.Application.Features.Products.Dtos;
using MediatR;

namespace Backend.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;
