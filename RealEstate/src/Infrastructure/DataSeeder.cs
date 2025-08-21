using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain;

namespace RealEstate.Infrastructure;


public interface IDataSeeder
{
    Task SeedAsync(CancellationToken ct);
}
public sealed class DataSeeder: IDataSeeder
{
    private readonly MongoContext _ctx;
    
    public DataSeeder(MongoContext ctx)
    {
        _ctx = ctx;
    }

    public async Task SeedAsync(CancellationToken ct)
    {
        await _ctx.EnsureIndexesAsync(ct);

        var ownersCount = await _ctx.Owners.CountDocumentsAsync(FilterDefinition<Domain.Owner>.Empty, cancellationToken: ct);
        var propCount = await _ctx.Properties.CountDocumentsAsync(FilterDefinition<Domain.Property>.Empty, cancellationToken: ct);

        if(ownersCount > 0 || propCount > 0)
            return;

        var john = new Owner { Id = ObjectId.GenerateNewId(), Name = "John Doe", Address = "456 Elm St", Photo = "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg", Birthday = new DateTime(1980, 1, 1) };
        var ana = new Owner { Id = ObjectId.GenerateNewId(), Name = "Ana Smith", Address = "78 Pine Ave", Photo = "https://images.pexels.com/photos/3992656/pexels-photo-3992656.png" };

        await _ctx.Owners.InsertManyAsync(new[] { john, ana }, cancellationToken: ct);

        var p1 = new Property
        {
            Name = "House #12",
            Address = "123 Main St",
            Price = 150000,
            CodeInternal = "H12",
            Year = 2020,
            OwnerId = john.Id.ToString(),
            Images = new() { new PropertyImage { File = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg", Enabled = true }, new PropertyImage { File = "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg", Enabled = false } },
            Traces = new() { new PropertyTrace { DateSale = new DateTime(2020, 1, 15), Name = "Initial Sale", Value = 150000, Tax = 5000 } }
        };

        var p2 = new Property
        {
            Name = "Lake Cottage",
            Address = "9 Lake Rd",
            Price = 230000,
            CodeInternal = "LC-09",
            Year = 2018,
            OwnerId = ana.Id.ToString(),
            Images = new() { new PropertyImage { File = "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg", Enabled = true } },
            Traces = new() {
                new PropertyTrace{ DateSale=new DateTime(2018,3,1), Name="Purchase", Value=210000, Tax=4000 },
                new PropertyTrace{ DateSale=new DateTime(2024,6,1), Name="Renovation", Value=20000, Tax=0 }
            }
        };

        await _ctx.Properties.InsertManyAsync(new[] { p1, p2 }, cancellationToken: ct);

    }
}
