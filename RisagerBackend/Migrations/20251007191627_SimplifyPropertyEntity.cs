using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RisagerBackend.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyPropertyEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Properties");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Properties",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
