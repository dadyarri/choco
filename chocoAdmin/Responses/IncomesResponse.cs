namespace choco.Responses;

public class IncomesResponse
{
    public List<IncomeInfo> IncomeInfos { get; set; }
}

public class IncomeInfo
{
    public string DateInfo { get; set; }
    public double Total { get; set; }
    public int Index { get; set; }
}