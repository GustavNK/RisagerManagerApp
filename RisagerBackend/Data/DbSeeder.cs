using Microsoft.AspNetCore.Identity;

namespace RisagerBackend.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider serviceProvider)
        {
            UserManager<User> userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            RoleManager<IdentityRole> roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            _ = await roleManager.CreateAsync(new IdentityRole("Admin"));

            const string adminUsername = "admin";
            const string adminPassword = "admin";

            // Check if admin user already exists
            User? existingAdmin = await userManager.FindByNameAsync(adminUsername);
            if (existingAdmin != null)
            {
                logger.LogInformation("Admin user already exists. Skipping seeding.");
                return;
            }

            // Create admin user
            User adminUser = new()
            {
                UserName = adminUsername,
                Email = "admin@risager.local",
                FirstName = "Administrator",
                LastName = "User",
                EmailConfirmed = true
            };

            IdentityResult result = await userManager.CreateAsync(adminUser, adminPassword);

            _ = await userManager.AddToRoleAsync(adminUser, "Admin");

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
            ApplicationDbContext context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            // Check if properties already exist
            if (context.Properties.Any())
            {
                logger.LogInformation("Properties already exist. Skipping seeding.");
                return;
            }

            Property[] properties = new[]
            {
                new Property { Id = 1, Name = "Røde Hus" },
                new Property { Id = 2, Name = "Søhuset" }
            };

            await context.Properties.AddRangeAsync(properties);
            _ = await context.SaveChangesAsync();

            logger.LogInformation("Properties seeded successfully.");
        }
    }
}
