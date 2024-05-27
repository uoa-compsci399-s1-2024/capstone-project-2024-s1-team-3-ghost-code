using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OTTER.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminDeleteRequestTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminDeleteRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminId = table.Column<int>(type: "int", nullable: false),
                    RequestorId = table.Column<int>(type: "int", nullable: false),
                    Expiry = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminDeleteRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminDeleteRequests_Admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdminDeleteRequests_Admins_RequestorId",
                        column: x => x.RequestorId,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminDeleteRequests_AdminId",
                table: "AdminDeleteRequests",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminDeleteRequests_RequestorId",
                table: "AdminDeleteRequests",
                column: "RequestorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminDeleteRequests");
        }
    }
}
