using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    public partial class RenameFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderCities_cityId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderSources_sourceId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderStates_stateId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "stateId",
                table: "Orders",
                newName: "StateId");

            migrationBuilder.RenameColumn(
                name: "sourceId",
                table: "Orders",
                newName: "SourceId");

            migrationBuilder.RenameColumn(
                name: "cityId",
                table: "Orders",
                newName: "CityId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_stateId",
                table: "Orders",
                newName: "IX_Orders_StateId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_sourceId",
                table: "Orders",
                newName: "IX_Orders_SourceId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_cityId",
                table: "Orders",
                newName: "IX_Orders_CityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderCities_CityId",
                table: "Orders",
                column: "CityId",
                principalTable: "OrderCities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderSources_SourceId",
                table: "Orders",
                column: "SourceId",
                principalTable: "OrderSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderStates_StateId",
                table: "Orders",
                column: "StateId",
                principalTable: "OrderStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderCities_CityId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderSources_SourceId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderStates_StateId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "StateId",
                table: "Orders",
                newName: "stateId");

            migrationBuilder.RenameColumn(
                name: "SourceId",
                table: "Orders",
                newName: "sourceId");

            migrationBuilder.RenameColumn(
                name: "CityId",
                table: "Orders",
                newName: "cityId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_StateId",
                table: "Orders",
                newName: "IX_Orders_stateId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_SourceId",
                table: "Orders",
                newName: "IX_Orders_sourceId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_CityId",
                table: "Orders",
                newName: "IX_Orders_cityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderCities_cityId",
                table: "Orders",
                column: "cityId",
                principalTable: "OrderCities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderSources_sourceId",
                table: "Orders",
                column: "sourceId",
                principalTable: "OrderSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderStates_stateId",
                table: "Orders",
                column: "stateId",
                principalTable: "OrderStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
