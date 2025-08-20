using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain;

namespace RealEstate.Infrastructure;

public sealed class MongoContext
{
    public IMongoDatabase Db { get; }
    public IMongoCollection<Owner> Owners => Db.GetCollection<Owner>("owners");
    public IMongoCollection<Property> Properties => Db.GetCollection<Property>("properties");

    public MongoContext(IOptions<MongoSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        Db = client.GetDatabase(settings.DatabaseName);
    }

    public async Task EnsureIndexesAsync(CancellationToken ct)
    {
        var pi = Properties.Indexes;
        await pi.CreateManyAsync(new[]
        {
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.OwnerId)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.Price)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.Year)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.CodeInternal)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Text(p => p.Name)
                                                     .Text(p => p.Address))
        }, cancellationToken: ct);
    }
}
