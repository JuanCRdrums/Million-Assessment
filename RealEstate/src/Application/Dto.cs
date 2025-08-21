using MongoDB.Bson;
using RealEstate.Domain;

namespace RealEstate.Application;

public sealed record OwnerDto(ObjectId Id,
    string Name,
    string Address,
    string Photo,
    DateTime? Birthday);

public sealed record PropertyWithOwnerDto(
    string Id,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year,
    OwnerDto Owner,
    IReadOnlyList<PropertyImage> Images,
    IReadOnlyList<PropertyTrace> Traces);