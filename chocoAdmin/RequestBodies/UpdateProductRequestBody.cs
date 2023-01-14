namespace choco.RequestBodies;

public class UpdateProductRequestBody
{
    public Guid ProductId { get; set; }
    public string Name { get; set; }
    public int WholesalePrice { get; set; }
    public int RetailPrice { get; set; }
    public Guid Category { get; set; }
    public bool IsByWeight { get; set; }
}