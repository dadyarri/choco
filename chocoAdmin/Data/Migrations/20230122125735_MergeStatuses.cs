using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class MergeStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderStatuses_StatusId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Shipments_ShipmentStatuses_StatusId",
                table: "Shipments");

            migrationBuilder.DropTable(
                name: "OrderStatuses");

            migrationBuilder.DropTable(
                name: "ShipmentStatuses");

            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"));

            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"));

            migrationBuilder.CreateTable(
                name: "MovingStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovingStatus", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MovingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("7a572649-b14d-403c-9975-4632ccb15b0c"), "Выполнено" },
                    { new Guid("86b7dcde-a491-47b2-b984-44928d76a6c0"), "Доставляется" },
                    { new Guid("cc5f4a12-9105-44d7-9130-0ff5583dafac"), "Отменено" },
                    { new Guid("d057e2b1-e980-499d-b2e0-0655edeee50d"), "Обрабатывается" }
                });

            migrationBuilder.InsertData(
                table: "OrderCities",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("7bb926d3-04e1-4419-adec-8182fc5e5447"), "Владимир" },
                    { new Guid("b07cd394-9803-45db-809e-9d830c16089b"), "Фурманов" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_MovingStatus_StatusId",
                table: "Orders",
                column: "StatusId",
                principalTable: "MovingStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shipments_MovingStatus_StatusId",
                table: "Shipments",
                column: "StatusId",
                principalTable: "MovingStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_MovingStatus_StatusId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Shipments_MovingStatus_StatusId",
                table: "Shipments");

            migrationBuilder.DropTable(
                name: "MovingStatus");

            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("7bb926d3-04e1-4419-adec-8182fc5e5447"));

            migrationBuilder.DeleteData(
                table: "OrderCities",
                keyColumn: "Id",
                keyValue: new Guid("b07cd394-9803-45db-809e-9d830c16089b"));

            migrationBuilder.CreateTable(
                name: "OrderStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShipmentStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShipmentStatuses", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "OrderCities",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"), "Фурманов" },
                    { new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"), "Владимир" }
                });

            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("110dd7cd-6c6b-4404-bb63-7dcf70a3c2db"), "Отменён" },
                    { new Guid("3e2a576c-740a-4d81-8e9a-6fa7136d96d9"), "Обрабатывается" },
                    { new Guid("41e7f82c-d17c-4c5f-9c0d-5d5903e6b257"), "Выполнен" },
                    { new Guid("a632e467-59ba-48db-9f26-88ccb3ee31d9"), "Доставляется" }
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

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderStatuses_StatusId",
                table: "Orders",
                column: "StatusId",
                principalTable: "OrderStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shipments_ShipmentStatuses_StatusId",
                table: "Shipments",
                column: "StatusId",
                principalTable: "ShipmentStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
