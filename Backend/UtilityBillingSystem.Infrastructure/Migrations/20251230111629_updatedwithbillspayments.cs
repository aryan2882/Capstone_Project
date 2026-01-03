using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UtilityBillingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedwithbillspayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BillingCycles",
                columns: table => new
                {
                    BillingCycleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CycleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MeterReadingDeadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BillGenerationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PenaltyStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsClosed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingCycles", x => x.BillingCycleId);
                });

            migrationBuilder.CreateTable(
                name: "UtilityTypes",
                columns: table => new
                {
                    UtilityTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UnitOfMeasurement = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaseRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UtilityTypes", x => x.UtilityTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Tariffs",
                columns: table => new
                {
                    TariffId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UtilityTypeId = table.Column<int>(type: "int", nullable: false),
                    FixedMonthlyCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinimumCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxPercentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    IsSlabBased = table.Column<bool>(type: "bit", nullable: false),
                    FlatRate = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tariffs", x => x.TariffId);
                    table.ForeignKey(
                        name: "FK_Tariffs_UtilityTypes_UtilityTypeId",
                        column: x => x.UtilityTypeId,
                        principalTable: "UtilityTypes",
                        principalColumn: "UtilityTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsumerId = table.Column<int>(type: "int", nullable: false),
                    UtilityTypeId = table.Column<int>(type: "int", nullable: false),
                    TariffId = table.Column<int>(type: "int", nullable: false),
                    MeterNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ConnectionLoad = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InitialReading = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ActivationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DisconnectionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DisconnectionReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionId);
                    table.ForeignKey(
                        name: "FK_Connections_Consumers_ConsumerId",
                        column: x => x.ConsumerId,
                        principalTable: "Consumers",
                        principalColumn: "ConsumerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Connections_Tariffs_TariffId",
                        column: x => x.TariffId,
                        principalTable: "Tariffs",
                        principalColumn: "TariffId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Connections_UtilityTypes_UtilityTypeId",
                        column: x => x.UtilityTypeId,
                        principalTable: "UtilityTypes",
                        principalColumn: "UtilityTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TariffSlabs",
                columns: table => new
                {
                    TariffSlabId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TariffId = table.Column<int>(type: "int", nullable: false),
                    SlabNumber = table.Column<int>(type: "int", nullable: false),
                    FromUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ToUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RatePerUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TariffSlabs", x => x.TariffSlabId);
                    table.ForeignKey(
                        name: "FK_TariffSlabs_Tariffs_TariffId",
                        column: x => x.TariffId,
                        principalTable: "Tariffs",
                        principalColumn: "TariffId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeterReadings",
                columns: table => new
                {
                    MeterReadingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConnectionId = table.Column<int>(type: "int", nullable: false),
                    BillingCycleId = table.Column<int>(type: "int", nullable: false),
                    PreviousReading = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CurrentReading = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Consumption = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReadingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecordedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsBillGenerated = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeterReadings", x => x.MeterReadingId);
                    table.ForeignKey(
                        name: "FK_MeterReadings_BillingCycles_BillingCycleId",
                        column: x => x.BillingCycleId,
                        principalTable: "BillingCycles",
                        principalColumn: "BillingCycleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MeterReadings_Connections_ConnectionId",
                        column: x => x.ConnectionId,
                        principalTable: "Connections",
                        principalColumn: "ConnectionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MeterReadings_Users_RecordedBy",
                        column: x => x.RecordedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bills",
                columns: table => new
                {
                    BillId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BillNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ConsumerId = table.Column<int>(type: "int", nullable: false),
                    ConnectionId = table.Column<int>(type: "int", nullable: false),
                    BillingCycleId = table.Column<int>(type: "int", nullable: false),
                    MeterReadingId = table.Column<int>(type: "int", nullable: false),
                    Consumption = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EnergyCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FixedCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PreviousOutstanding = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PenaltyAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OutstandingAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BillDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GeneratedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bills", x => x.BillId);
                    table.ForeignKey(
                        name: "FK_Bills_BillingCycles_BillingCycleId",
                        column: x => x.BillingCycleId,
                        principalTable: "BillingCycles",
                        principalColumn: "BillingCycleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bills_Connections_ConnectionId",
                        column: x => x.ConnectionId,
                        principalTable: "Connections",
                        principalColumn: "ConnectionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bills_Consumers_ConsumerId",
                        column: x => x.ConsumerId,
                        principalTable: "Consumers",
                        principalColumn: "ConsumerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bills_MeterReadings_MeterReadingId",
                        column: x => x.MeterReadingId,
                        principalTable: "MeterReadings",
                        principalColumn: "MeterReadingId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bills_Users_GeneratedBy",
                        column: x => x.GeneratedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ConsumerId = table.Column<int>(type: "int", nullable: false),
                    BillId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMode = table.Column<int>(type: "int", nullable: false),
                    TransactionId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecordedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_Consumers_ConsumerId",
                        column: x => x.ConsumerId,
                        principalTable: "Consumers",
                        principalColumn: "ConsumerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_Users_RecordedBy",
                        column: x => x.RecordedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "Address", "CreatedAt", "IdProofNumber", "IdProofType", "PasswordHash" },
                values: new object[] { "Admin Office", new DateTime(2025, 12, 30, 11, 16, 28, 220, DateTimeKind.Utc).AddTicks(9508), "ADMIN001", "Official", "$2a$11$P.vSdDkWFBOTRt934Pnj1.hw03PKuD0VA9LgTzINpKpVxYcWQw5/6" });

            migrationBuilder.CreateIndex(
                name: "IX_Bills_BillingCycleId",
                table: "Bills",
                column: "BillingCycleId");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_BillNumber",
                table: "Bills",
                column: "BillNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bills_ConnectionId",
                table: "Bills",
                column: "ConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_ConsumerId",
                table: "Bills",
                column: "ConsumerId");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_GeneratedBy",
                table: "Bills",
                column: "GeneratedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_MeterReadingId",
                table: "Bills",
                column: "MeterReadingId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ConsumerId",
                table: "Connections",
                column: "ConsumerId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_MeterNumber",
                table: "Connections",
                column: "MeterNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Connections_TariffId",
                table: "Connections",
                column: "TariffId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_UtilityTypeId",
                table: "Connections",
                column: "UtilityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_MeterReadings_BillingCycleId",
                table: "MeterReadings",
                column: "BillingCycleId");

            migrationBuilder.CreateIndex(
                name: "IX_MeterReadings_ConnectionId",
                table: "MeterReadings",
                column: "ConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_MeterReadings_RecordedBy",
                table: "MeterReadings",
                column: "RecordedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BillId",
                table: "Payments",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ConsumerId",
                table: "Payments",
                column: "ConsumerId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ReceiptNumber",
                table: "Payments",
                column: "ReceiptNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_RecordedBy",
                table: "Payments",
                column: "RecordedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Tariffs_UtilityTypeId",
                table: "Tariffs",
                column: "UtilityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TariffSlabs_TariffId",
                table: "TariffSlabs",
                column: "TariffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "TariffSlabs");

            migrationBuilder.DropTable(
                name: "Bills");

            migrationBuilder.DropTable(
                name: "MeterReadings");

            migrationBuilder.DropTable(
                name: "BillingCycles");

            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Tariffs");

            migrationBuilder.DropTable(
                name: "UtilityTypes");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "Address", "CreatedAt", "IdProofNumber", "IdProofType", "PasswordHash" },
                values: new object[] { "Admin Address", new DateTime(2025, 12, 29, 11, 0, 30, 532, DateTimeKind.Utc).AddTicks(6829), "N/A", "N/A", "$2a$11$XVymPKYBu/4sD6LToJnzI.bAUzIQQt9rU7.rDW6JaJeiHjmJxBKqC" });
        }
    }
}
