using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MarketId",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MarketId",
                table: "Products");
        }
    }
}
