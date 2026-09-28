namespace Backend.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entityName, object key)
        : base($"L'entité « {entityName} » avec la clé « {key} » est introuvable.")
    {
    }
}
