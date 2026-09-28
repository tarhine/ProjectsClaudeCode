using Backend.Domain.Common;
using Backend.Domain.Exceptions;

namespace Backend.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }

    private Product()
    {
        // Requis par EF Core.
    }

    private Product(string name, string? description, decimal price, int stockQuantity)
    {
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
    }

    public static Product Create(string name, string? description, decimal price, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Le nom du produit est obligatoire.");
        }

        if (price < 0)
        {
            throw new DomainException("Le prix ne peut pas être négatif.");
        }

        if (stockQuantity < 0)
        {
            throw new DomainException("La quantité en stock ne peut pas être négative.");
        }

        return new Product(name, description, price, stockQuantity);
    }

    public void Update(string name, string? description, decimal price, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Le nom du produit est obligatoire.");
        }

        if (price < 0)
        {
            throw new DomainException("Le prix ne peut pas être négatif.");
        }

        if (stockQuantity < 0)
        {
            throw new DomainException("La quantité en stock ne peut pas être négative.");
        }

        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        MarkUpdated();
    }
}
