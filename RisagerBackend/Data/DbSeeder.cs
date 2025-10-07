using Microsoft.AspNetCore.Identity;

namespace RisagerBackend.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            const string adminUsername = "admin";
            const string adminPassword = "admin";

            // Check if admin user already exists
            var existingAdmin = await userManager.FindByNameAsync(adminUsername);
            if (existingAdmin != null)
            {
                logger.LogInformation("Admin user already exists. Skipping seeding.");
                return;
            }

            // Create admin user
            var adminUser = new User
            {
                UserName = adminUsername,
                Email = "admin@risager.local",
                FirstName = "Administrator",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                logger.LogInformation("Admin user created successfully: {Username}", adminUsername);
            }
            else
            {
                logger.LogError("Failed to create admin user. Errors: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        public static async Task SeedProperties(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            // Check if properties already exist
            if (context.Properties.Any())
            {
                logger.LogInformation("Properties already exist. Skipping seeding.");
                return;
            }

            var properties = new[]
            {
                new Property { Id = 1, Name = "Røde Hus" },
                new Property { Id = 2, Name = "Søhuset" }
            };

            await context.Properties.AddRangeAsync(properties);
            await context.SaveChangesAsync();

            logger.LogInformation("Properties seeded successfully.");
        }
    }
}
