using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedMoreData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.InsertData(
                table: "OrderCities",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"), "Фурманов" },
                    { new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"), "Владимир" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"));

            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"));
        }
    }
}
