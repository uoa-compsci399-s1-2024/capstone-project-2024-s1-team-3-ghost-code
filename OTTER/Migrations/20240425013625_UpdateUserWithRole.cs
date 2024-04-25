using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OTTER.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserWithRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "RoleID",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                column: "RoleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users",
                column: "RoleID",
                principalTable: "Roles",
                principalColumn: "RoleID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RoleID",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
