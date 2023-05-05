using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("4aa80967-1dbb-452e-acba-ac027d88fea6"), "Ожидает получения" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("4aa80967-1dbb-452e-acba-ac027d88fea6"));
        }
    }
}
