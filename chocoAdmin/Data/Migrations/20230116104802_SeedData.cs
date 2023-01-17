using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("1ffb1ac4-2cfe-42af-8b4c-e782ea720f97"), "Отменён" },
                    { new Guid("3c3fd23a-e53f-446f-b7d9-82647eb87e59"), "Доставляется" },
                    { new Guid("bd40220b-354c-474f-a6eb-e5106ca7dd2a"), "Выполнен" },
                    { new Guid("f6ef3e23-a292-4ee8-ac4b-03ba6d95830f"), "Обрабатывается" }
                });

            migrationBuilder.InsertData(
                table: "ShipmentStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("21ecdafc-dc56-4bb2-868f-0be776726713"), "Обрабатывается" },
                    { new Guid("90786c29-b967-457f-afe6-714d92b5fffd"), "Доставляется" },
                    { new Guid("9ba56286-f218-4a04-a682-9ded4613a33e"), "Выполнена" },
                    { new Guid("d5c0799e-bd48-4e12-985b-502a05e72432"), "Отменена" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("1ffb1ac4-2cfe-42af-8b4c-e782ea720f97"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("3c3fd23a-e53f-446f-b7d9-82647eb87e59"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("bd40220b-354c-474f-a6eb-e5106ca7dd2a"));

            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: new Guid("f6ef3e23-a292-4ee8-ac4b-03ba6d95830f"));

            migrationBuilder.DeleteData(
                table: "ShipmentStatuses",
                keyColumn: "Id",
                keyValue: new Guid("21ecdafc-dc56-4bb2-868f-0be776726713"));

            migrationBuilder.DeleteData(
                table: "ShipmentStatuses",
                keyColumn: "Id",
                keyValue: new Guid("90786c29-b967-457f-afe6-714d92b5fffd"));

            migrationBuilder.DeleteData(
                table: "ShipmentStatuses",
                keyColumn: "Id",
                keyValue: new Guid("9ba56286-f218-4a04-a682-9ded4613a33e"));

            migrationBuilder.DeleteData(
                table: "ShipmentStatuses",
                keyColumn: "Id",
                keyValue: new Guid("d5c0799e-bd48-4e12-985b-502a05e72432"));
        }
    }
}
