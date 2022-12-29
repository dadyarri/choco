using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace choco.Data.Migrations
{
    /// <inheritdoc />
    public partial class status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StatusId",
                table: "Shipments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Shipments_StatusId",
                table: "Shipments",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shipments_ShipmentStatuses_StatusId",
                table: "Shipments",
                column: "StatusId",
                principalTable: "ShipmentStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shipments_ShipmentStatuses_StatusId",
                table: "Shipments");

            migrationBuilder.DropIndex(
                name: "IX_Shipments_StatusId",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "Shipments");
        }
    }
}
