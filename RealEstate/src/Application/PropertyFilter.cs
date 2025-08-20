namespace RealEstate.Application;

public sealed class PropertyFilter
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? CodeInternal { get; set; }
    public int? Year { get; set; }
    public int? YearMin { get; set; }
    public int? YearMax { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? OwnerId { get; set; }
}
