using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
namespace UtilityBillingSystem.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Consumer> Consumers { get; set; }
        public DbSet<UtilityType> UtilityTypes { get; set; }
        public DbSet<Tariff> Tariffs { get; set; }
        public DbSet<TariffSlab> TariffSlabs { get; set; }
        public DbSet<BillingCycle> BillingCycles { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<MeterReading> MeterReadings { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<Payment> Payments { get; set; }

        public DbSet<Notification> Notifications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.FatherName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(15);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(200);
                entity.Property(e => e.City).IsRequired().HasMaxLength(50);
                entity.Property(e => e.State).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PinCode).IsRequired().HasMaxLength(10);
                entity.Property(e => e.PasswordHash).IsRequired();

                entity.HasOne(e => e.ApprovedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ApprovedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Consumer Configuration
            modelBuilder.Entity<Consumer>(entity =>
            {
                entity.HasKey(e => e.ConsumerId);
                entity.Property(e => e.ConsumerCode).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.ConsumerCode).IsUnique();

                entity.HasOne(e => e.User)
                    .WithOne(u => u.Consumer)
                    .HasForeignKey<Consumer>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // UtilityType Configuration
            modelBuilder.Entity<UtilityType>(entity =>
            {
                entity.HasKey(e => e.UtilityTypeId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.UnitOfMeasurement).IsRequired().HasMaxLength(20);
                entity.Property(e => e.BaseRate).HasColumnType("decimal(18,2)");
            });

            // Tariff Configuration
            modelBuilder.Entity<Tariff>(entity =>
            {
                entity.HasKey(e => e.TariffId);
                entity.Property(e => e.PlanName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.FixedMonthlyCharge).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MinimumCharge).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxPercentage).HasColumnType("decimal(5,2)");
                entity.Property(e => e.FlatRate).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.UtilityType)
                    .WithMany(u => u.Tariffs)
                    .HasForeignKey(e => e.UtilityTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // TariffSlab Configuration
            modelBuilder.Entity<TariffSlab>(entity =>
            {
                entity.HasKey(e => e.TariffSlabId);
                entity.Property(e => e.FromUnit).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ToUnit).HasColumnType("decimal(18,2)");
                entity.Property(e => e.RatePerUnit).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Tariff)
                    .WithMany(t => t.TariffSlabs)
                    .HasForeignKey(e => e.TariffId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // BillingCycle Configuration
            modelBuilder.Entity<BillingCycle>(entity =>
            {
                entity.HasKey(e => e.BillingCycleId);
                entity.Property(e => e.CycleName).IsRequired().HasMaxLength(50);
            });

            // Connection Configuration
            modelBuilder.Entity<Connection>(entity =>
            {
                entity.HasKey(e => e.ConnectionId);
                entity.Property(e => e.MeterNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.MeterNumber).IsUnique();
                entity.Property(e => e.ConnectionLoad).HasColumnType("decimal(18,2)");
                entity.Property(e => e.InitialReading).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Consumer)
                    .WithMany(c => c.Connections)
                    .HasForeignKey(e => e.ConsumerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UtilityType)
                    .WithMany(u => u.Connections)
                    .HasForeignKey(e => e.UtilityTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Tariff)
                    .WithMany(t => t.Connections)
                    .HasForeignKey(e => e.TariffId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // MeterReading Configuration
            modelBuilder.Entity<MeterReading>(entity =>
            {
                entity.HasKey(e => e.MeterReadingId);
                entity.Property(e => e.PreviousReading).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CurrentReading).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Consumption).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Connection)
                    .WithMany(c => c.MeterReadings)
                    .HasForeignKey(e => e.ConnectionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BillingCycle)
                    .WithMany(b => b.MeterReadings)
                    .HasForeignKey(e => e.BillingCycleId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RecordedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Bill Configuration
            modelBuilder.Entity<Bill>(entity =>
            {
                entity.HasKey(e => e.BillId);
                entity.Property(e => e.BillNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.BillNumber).IsUnique();
                entity.Property(e => e.Consumption).HasColumnType("decimal(18,2)");
                entity.Property(e => e.EnergyCharge).HasColumnType("decimal(18,2)");
                entity.Property(e => e.FixedCharge).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PreviousOutstanding).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Subtotal).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PenaltyAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaidAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.OutstandingAmount).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Consumer)
                    .WithMany(c => c.Bills)
                    .HasForeignKey(e => e.ConsumerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Connection)
                    .WithMany(c => c.Bills)
                    .HasForeignKey(e => e.ConnectionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BillingCycle)
                    .WithMany(b => b.Bills)
                    .HasForeignKey(e => e.BillingCycleId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.MeterReading)
                    .WithMany()
                    .HasForeignKey(e => e.MeterReadingId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.GeneratedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.GeneratedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Payment Configuration
            // Payment Configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId);
                entity.Property(e => e.ReceiptNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.ReceiptNumber).IsUnique();
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TransactionId).HasMaxLength(100);  // ⬅️ REMOVE .IsRequired()

                entity.HasOne(e => e.Consumer)
                    .WithMany(c => c.Payments)
                    .HasForeignKey(e => e.ConsumerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Bill)
                    .WithMany(b => b.Payments)
                    .HasForeignKey(e => e.BillId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RecordedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Notification Configuration
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.NotificationId);
                entity.Property(e => e.NotificationType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Message).IsRequired();

                entity.HasOne(e => e.Consumer)
                    .WithMany()
                    .HasForeignKey(e => e.ConsumerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed Data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            string adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");

            modelBuilder.Entity<User>().HasData(new User
            {
                UserId = 1,
                FirstName = "System",
                LastName = "Admin",
                FatherName = "N/A",
                Email = "admin@utilitybilling.com",
                Phone = "9999999999",
                Address = "Admin Office",
                City = "Jamshedpur",
                State = "Jharkhand",
                PinCode = "831001",
                IdProofType = "Official",
                IdProofNumber = "ADMIN001",
                PasswordHash = adminPasswordHash,
                Role = Core.Enums.UserRole.Admin,
                IsActive = true,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}