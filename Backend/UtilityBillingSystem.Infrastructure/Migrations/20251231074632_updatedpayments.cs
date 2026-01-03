using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UtilityBillingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedpayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 12, 31, 7, 46, 31, 467, DateTimeKind.Utc).AddTicks(3739), "$2a$11$ZqE4yB1XeTaeAjSnS.zSk.KK81IZkjYfk763uCsaJ.KCdj7A16WrG" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 12, 30, 13, 7, 53, 172, DateTimeKind.Utc).AddTicks(625), "$2a$11$6alw92QKCN.1QmlUi.772ufm/TWhIStxW4HfLASxInLFTuQYi7srO" });
        }
    }
}
