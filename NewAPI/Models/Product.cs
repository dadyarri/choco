using System.ComponentModel.DataAnnotations;

namespace NewAPI.Models;

public class Product
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    [Required]
    public int WholesalePrice { get; set; }
    
    [Required]
    public int RetailPrice { get; set; }
    
    [Required]
    public int Leftover { get; set; }
    
    public int? MarketId { get; set; }
    
    [Required]
    public bool IsByWeight { get; set; }
}