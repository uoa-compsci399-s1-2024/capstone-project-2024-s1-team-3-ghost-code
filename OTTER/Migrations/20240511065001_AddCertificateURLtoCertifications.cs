using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OTTER.Migrations
{
    /// <inheritdoc />
    public partial class AddCertificateURLtoCertifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CertificateURL",
                table: "Certifications",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificateURL",
                table: "Certifications");
        }
    }
}
