using Backend.Domain.Entities;
using Backend.Domain.Exceptions;
using FluentAssertions;
using Xunit;

namespace Backend.Domain.Tests.Entities;

public class ProductTests
{
    [Fact]
    public void Create_WithValidData_CreatesProduct()
    {
        var product = Product.Create("Clavier mécanique", "Clavier rétroéclairé", 79.99m, 10);

        product.Name.Should().Be("Clavier mécanique");
        product.Price.Should().Be(79.99m);
        product.StockQuantity.Should().Be(10);
    }

    [Fact]
    public void Create_WithEmptyName_ThrowsDomainException()
    {
        var act = () => Product.Create(string.Empty, null, 10m, 1);

        act.Should().Throw<DomainException>();
    }

    [Fact]
    public void Create_WithNegativePrice_ThrowsDomainException()
    {
        var act = () => Product.Create("Souris", null, -1m, 1);

        act.Should().Throw<DomainException>();
    }

    [Fact]
    public void Update_WithValidData_UpdatesFields()
    {
        var product = Product.Create("Écran", null, 199m, 5);

        product.Update("Écran 4K", "Nouvelle description", 249m, 3);

        product.Name.Should().Be("Écran 4K");
        product.Description.Should().Be("Nouvelle description");
        product.Price.Should().Be(249m);
        product.StockQuantity.Should().Be(3);
        product.UpdatedAtUtc.Should().NotBeNull();
    }
}
