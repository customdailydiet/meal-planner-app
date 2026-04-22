import prisma from "./prisma";

async function main() {
    try {
        console.log("🚀 Testing Database Connection...");
        
        // 1. Create a dummy setting
        const setting = await prisma.appSetting.upsert({
            where: { id: "default_config" },
            update: {},
            create: {
                id: "default_config",
                appName: "AI Meal Planner - Admin System",
                footerText: "© 2025 AI Meal Planner"
            }
        });
        
        console.log("✅ Database Connected Successfully!");
        console.log("App Name:", setting.appName);
        
        const userCount = await prisma.user.count();
        console.log("Total Users:", userCount);
        
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
