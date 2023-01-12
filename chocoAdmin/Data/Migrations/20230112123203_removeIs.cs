using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class removeIs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShipmentItems_ShipmentItemStatuses_StatusId",
                table: "ShipmentItems");

            migrationBuilder.DropTable(
                name: "ShipmentItemStatuses");

            migrationBuilder.DropIndex(
                name: "IX_ShipmentItems_StatusId",
                table: "ShipmentItems");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "ShipmentItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StatusId",
                table: "ShipmentItems",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "ShipmentItemStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShipmentItemStatuses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShipmentItems_StatusId",
                table: "ShipmentItems",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShipmentItems_ShipmentItemStatuses_StatusId",
                table: "ShipmentItems",
                column: "StatusId",
                principalTable: "ShipmentItemStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
