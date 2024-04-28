using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OTTER.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCertificationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certifications_Modules_ModuleID",
                table: "Certifications");

            migrationBuilder.DropIndex(
                name: "IX_Certifications_ModuleID",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "ModuleID",
                table: "Certifications");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Certifications",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Certifications");

            migrationBuilder.AddColumn<int>(
                name: "ModuleID",
                table: "Certifications",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_ModuleID",
                table: "Certifications",
                column: "ModuleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Certifications_Modules_ModuleID",
                table: "Certifications",
                column: "ModuleID",
                principalTable: "Modules",
                principalColumn: "ModuleID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
