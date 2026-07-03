// ==========================================
// 📦 MINECRAFT ECOSYSTEM DATA CONFIGURATION
// ==========================================
const PICKAXE_DATA = [
    { id: "wooden_pick", name: "Wooden Pickaxe", cost: 0, power: 1, img: "assets/wooden_pickaxe.png", unlocked: true },
    { id: "stone_pick", name: "Stone Pickaxe", cost: 150, power: 3, img: "assets/stone_pickaxe.png", unlocked: false },
    { id: "iron_pick", name: "Iron Pickaxe", cost: 1200, power: 8, img: "assets/iron_pickaxe.png", unlocked: false },
    { id: "golden_pick", name: "Golden Pickaxe", cost: 5000, power: 20, img: "assets/golden_pickaxe.png", unlocked: false },
    { id: "diamond_pick", name: "Diamond Pickaxe", cost: 25000, power: 75, img: "assets/diamond_pickaxe.png", unlocked: false },
    { id: "netherite_pick", name: "Netherite Pickaxe", cost: 100000, power: 250, img: "assets/netherite_pickaxe.png", unlocked: false }
];

const ORE_DATA = [
    { id: "coal", name: "Coal Ore", hp: 5, reward: 1, img: "assets/coal_ore.png" },
    { id: "iron", name: "Iron Ore", hp: 20, reward: 5, img: "assets/iron_ore.png" },
    { id: "gold", name: "Gold Ore", hp: 80, reward: 25, img: "assets/gold_ore.png" },
    { id: "diamond", name: "Diamond Ore", hp: 350, reward: 150, img: "assets/diamond_ore.png" },
    { id: "emerald", name: "Emerald Ore", hp: 1200, reward: 600, img: "assets/emerald_ore.png" },
    { id: "netherite", name: "Netherite Ore", hp: 5000, reward: 3000, img: "assets/netherite_ore.png" }
];

const REWARD_ITEMS_DATA = [
    {
        id: "github",
        name: "GitHub Blueprint Network",
        description: "Access to open source repos and repository hubs.",
        cost: 1500,
        link: "https://github.com",
        linkText: "://github.com"
    },
    {
        id: "collab",
        name: "👑 Elite Collaboration Ticket",
        description: "Unlock direct booking email paths and prioritization metrics for enterprise co-development.",
        cost: 100000,
        link: "mailto:collab@://example.com",
        linkText: "Launch Collaboration Proposal",
        isEmail: true
    }
];
