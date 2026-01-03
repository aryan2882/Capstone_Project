using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UtilityBillingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedfinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Connections_ConnectionId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Consumers_ConsumerId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Consumers_ConsumerId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_MeterReadings_Connections_ConnectionId",
                table: "MeterReadings");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Consumers_ConsumerId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Bills_BillId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Consumers_ConsumerId",
                table: "Payments");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 1, 3, 9, 45, 47, 386, DateTimeKind.Utc).AddTicks(8617), "$2a$11$.Am7nKQXrU4qpoDgQzrWGutMxAHxCkGT8M2Sak4/mr6NSYAL.4GUm" });

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Connections_ConnectionId",
                table: "Bills",
                column: "ConnectionId",
                principalTable: "Connections",
                principalColumn: "ConnectionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Consumers_ConsumerId",
                table: "Bills",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Consumers_ConsumerId",
                table: "Connections",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MeterReadings_Connections_ConnectionId",
                table: "MeterReadings",
                column: "ConnectionId",
                principalTable: "Connections",
                principalColumn: "ConnectionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Consumers_ConsumerId",
                table: "Notifications",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Bills_BillId",
                table: "Payments",
                column: "BillId",
                principalTable: "Bills",
                principalColumn: "BillId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Consumers_ConsumerId",
                table: "Payments",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Connections_ConnectionId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Consumers_ConsumerId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Consumers_ConsumerId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_MeterReadings_Connections_ConnectionId",
                table: "MeterReadings");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Consumers_ConsumerId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Bills_BillId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Consumers_ConsumerId",
                table: "Payments");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 1, 3, 9, 44, 58, 222, DateTimeKind.Utc).AddTicks(5491), "$2a$11$LQv14nR6NrZEDcXJGgqCCuYv.IZj/2jY9GcoS9nsPbzgzHKTmrklO" });

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Connections_ConnectionId",
                table: "Bills",
                column: "ConnectionId",
                principalTable: "Connections",
                principalColumn: "ConnectionId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Consumers_ConsumerId",
                table: "Bills",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Consumers_ConsumerId",
                table: "Connections",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeterReadings_Connections_ConnectionId",
                table: "MeterReadings",
                column: "ConnectionId",
                principalTable: "Connections",
                principalColumn: "ConnectionId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Consumers_ConsumerId",
                table: "Notifications",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Bills_BillId",
                table: "Payments",
                column: "BillId",
                principalTable: "Bills",
                principalColumn: "BillId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Consumers_ConsumerId",
                table: "Payments",
                column: "ConsumerId",
                principalTable: "Consumers",
                principalColumn: "ConsumerId");
        }
    }
}
