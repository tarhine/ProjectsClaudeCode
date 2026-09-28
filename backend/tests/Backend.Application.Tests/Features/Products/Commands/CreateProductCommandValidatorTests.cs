using Backend.Application.Features.Products.Commands.CreateProduct;
using FluentAssertions;
using FluentValidation.TestHelper;
using Xunit;

namespace Backend.Application.Tests.Features.Products.Commands;

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator = new();

    [Fact]
    public void Validate_WithEmptyName_HasValidationError()
    {
        var command = new CreateProductCommand(string.Empty, null, 10m, 1);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithNegativePrice_HasValidationError()
    {
        var command = new CreateProductCommand("Produit", null, -5m, 1);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Price);
    }

    [Fact]
    public void Validate_WithValidCommand_HasNoValidationErrors()
    {
        var command = new CreateProductCommand("Produit", "Description", 10m, 1);

        var result = _validator.TestValidate(command);

        result.IsValid.Should().BeTrue();
    }
}
