namespace choco.RequestBodies;

public class CreateProductRequestBody
{
    public string Name { get; set; }
    public Guid Category { get; set; }
    public bool IsByWeight { get; set; }
    public double Leftover { get; set; }
    public int RetailPrice { get; set; }
    public int WholesalePrice { get; set; }
}