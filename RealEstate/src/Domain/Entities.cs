using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain;

public sealed class  Owner
{
    [BsonId] public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Photo { get; set; } = string.Empty;
    public DateTime? Birthday { get; set; }
}

public sealed class  PropertyImage
{
    public string File { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
}

public sealed class PropertyTrace
{
    public DateTime DateSale { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Tax { get; set; }
}

public sealed class Property
{
    [BsonId] public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string OwnerId { get; set; } = string.Empty;


    public List<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    public List<PropertyTrace> Traces { get; set; } = new List<PropertyTrace>();
}

