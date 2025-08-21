using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Application;
using RealEstate.Domain;

namespace RealEstate.Infrastructure;

public sealed class PropertyReadRepository : IPropertyReadRepository
{
    private readonly MongoContext _ctx;

    public PropertyReadRepository(MongoContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<(IReadOnlyList<PropertyWithOwnerDto> Items, long Total)> SearchAsync(
        PropertyFilter filter, int page, int pageSize, CancellationToken ct)
    {
        var builder = Builders<Domain.Property>.Filter;
        var filters = new List<FilterDefinition<Domain.Property>>();
        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            filters.Add(builder.Text(filter.Name));
        }
        if (!string.IsNullOrWhiteSpace(filter.Address))
        {
            filters.Add(builder.Text(filter.Address));
        }
        if (!string.IsNullOrWhiteSpace(filter.CodeInternal))
        {
            filters.Add(builder.Text(filter.CodeInternal));
        }
        if(filter.Year.HasValue)
        {
            filters.Add(builder.Eq(p => p.Year, filter.Year.Value));
        }
        if (filter.MinPrice.HasValue)
        {
            filters.Add(builder.Gte(p => p.Price, filter.MinPrice.Value));
        }
        if (filter.MaxPrice.HasValue && filter.MaxPrice.Value > 0)
        {
            filters.Add(builder.Lte(p => p.Price, filter.MaxPrice.Value));
        }
        if (filter.YearMin.HasValue)
        {
            filters.Add(builder.Gte(p => p.Year, filter.YearMin.Value));
        }
        if (filter.YearMax.HasValue)
        {
            filters.Add(builder.Lte(p => p.Year, filter.YearMax.Value));
        }
        if (!string.IsNullOrWhiteSpace(filter.OwnerId))
        {
            filters.Add(builder.Eq(p => p.OwnerId, filter.OwnerId));
        }


        var finalFilter = filters.Count > 0
            ? builder.And(filters)
            : builder.Empty;


        var totalTask = _ctx.Properties.CountDocumentsAsync(finalFilter, cancellationToken: ct);

        var pipeline = _ctx.Properties.Aggregate()
            .Match(finalFilter)
            .Sort(Builders<Property>.Sort.Ascending(p => p.Name)) // default sort
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .Lookup("owners", "OwnerId", "_id", @as: "ownerArr")
            .Unwind("ownerArr", new AggregateUnwindOptions<BsonDocument> { PreserveNullAndEmptyArrays = true })
            .Project(BuildProjection())
            .As<PropertyWithOwnerDto>();

        var itemsTask = pipeline.ToListAsync(ct);

        await Task.WhenAll(itemsTask, totalTask);

        return (itemsTask.Result, totalTask.Result);
    }

    public async Task<PropertyWithOwnerDto?> GetByIdAsync(string id, CancellationToken ct)
    {
        //var objectId = ObjectId.Parse(id);
        var doc = await _ctx.Properties.Aggregate()
            .Match(p => p.Id == id)
            .Lookup("owners", "OwnerId", "_id", "ownerArr")
            .Unwind("ownerArr", new AggregateUnwindOptions<BsonDocument> { PreserveNullAndEmptyArrays = true })
            .Project(BuildProjection())
            .As<PropertyWithOwnerDto>()
            .FirstOrDefaultAsync(ct);

        return doc;
    }

    private static ProjectionDefinition<BsonDocument, BsonDocument> BuildProjection() =>
    Builders<BsonDocument>.Projection.Expression(doc => new BsonDocument
    {
        { "_id",  doc["_id"].ToString() },
        { "Name", doc["Name"] },
        { "Address", doc["Address"] },
        { "Price", doc["Price"] },
        { "CodeInternal", doc["CodeInternal"] },
        { "Year", doc["Year"] },
        { "Images", doc["Images"] },
        { "Traces", doc["Traces"] },
        { "Owner", doc["ownerArr"] }
    });


}
