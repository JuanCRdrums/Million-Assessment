using RealEstate.Domain;

namespace RealEstate.Application;

public interface IPropertyReadRepository
{
    Task<(IReadOnlyList<PropertyWithOwnerDto> Items, long Total)> SearchAsync(
        PropertyFilter filter, int page, int pageSize, CancellationToken ct);

    Task<PropertyWithOwnerDto?> GetByIdAsync(string id, CancellationToken ct);
}