using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UtilityBillingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedofflinepayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 12, 31, 8, 52, 42, 971, DateTimeKind.Utc).AddTicks(5120), "$2a$11$3y5udU2aA6W2KrowAgzede.T3w8SH2iztWD6IAfL3YcLUQoW5Tctu" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 12, 31, 8, 26, 33, 865, DateTimeKind.Utc).AddTicks(703), "$2a$11$XwDLCyICyZfOsRERKVd4s.IXk1QG.SQkWkZ73aDxE1.RlbRAdPd7G" });
        }
    }
}
