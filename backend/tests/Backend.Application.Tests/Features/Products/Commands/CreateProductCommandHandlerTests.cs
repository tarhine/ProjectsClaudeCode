using Backend.Application.Features.Products.Commands.CreateProduct;
using FluentAssertions;
using Xunit;

namespace Backend.Application.Tests.Features.Products.Commands;

public class CreateProductCommandHandlerTests
{
    [Fact]
    public async Task Handle_WithValidCommand_PersistsProductAndReturnsDto()
    {
        using var context = TestApplicationDbContext.Create();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand("Casque audio", "Casque sans fil", 129.90m, 15);

        var result = await handler.Handle(command, CancellationToken.None);

        result.Name.Should().Be("Casque audio");
        context.Products.Should().ContainSingle(p => p.Id == result.Id);
    }
}
