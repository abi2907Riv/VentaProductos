using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VentaProductos.Migrations
{
    /// <inheritdoc />
    public partial class MigrationDetalleVentas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductoDetalle");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductoDetalle",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductoId = table.Column<int>(type: "int", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaTransaccion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Tamaño = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductoDetalle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductoDetalle_Productos_ProductoId",
                        column: x => x.ProductoId,
                        principalTable: "Productos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductoDetalle_ProductoId",
                table: "ProductoDetalle",
                column: "ProductoId");
        }
    }
}
