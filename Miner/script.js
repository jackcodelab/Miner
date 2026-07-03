const INCOGNITO_SALT = "jackcodelab_security_key_8849";
let verificationHash = "";

// --- 🎮 CORE STATE MASTER VARIABLES ---
let diamonds = 0;
let currentOreIndex = 0;
let currentOreHP = 5;

// Assigns the default initial item object from your data file arrays
let activePickaxe = PICKAXE_DATA[0];

// DOM Elements Linkage 
const globalDiamondCountEl = document.getElementById('global-diamond-count');
const mineZoneBox = document.getElementById('interactive-mining-zone');
const oreHitTarget = document.getElementById('ore-hit-target');
const renderOreImg = document.getElementById('render-ore-img');
const currentOreNameEl = document.getElementById('current-ore-name');
const oreHpFill = document.getElementById('ore-hp-fill');
const hpNumericalText = document.getElementById('hp-numerical-text');
const equippedPickNameEl = document.getElementById('equipped-pick-name');
const equippedPickPowerEl = document.getElementById('equipped-pick-power');

// --- 💾 BROWSER AUTO-SAVE PERSISTENCE SYSTEM ---
function saveGameProgress() {
    const saveStateData = {
        diamonds: diamonds,
        currentOreIndex: currentOreIndex,
        equippedPickaxeId: activePickaxe.id,
        unlockedPickaxeIds: PICKAXE_DATA.filter(p => p.unlocked).map(p => p.id),
    };
    localStorage.setItem('jackcodelab_craftlabs_save', JSON.stringify(saveStateData));
}

function loadGameProgress() {
    const rawData = localStorage.getItem('jackcodelab_craftlabs_save');
    if (!rawData) {
        activePickaxe = PICKAXE_DATA[0];
        currentOreHP = ORE_DATA[currentOreIndex].hp;
        synchronizeSecuritySignature();
        return;
    }

    try {
        const parsedSave = JSON.parse(rawData);
        diamonds = parsedSave.diamonds || 0;
        currentOreIndex = parsedSave.currentOreIndex || 0;

        if (parsedSave.unlockedPickaxeIds) {
            PICKAXE_DATA.forEach(pick => {
                if (parsedSave.unlockedPickaxeIds.includes(pick.id)) {
                    pick.unlocked = true;
                }
            });
        }

        const previouslyEquipped = PICKAXE_DATA.find(p => p.id === parsedSave.equippedPickaxeId);
        activePickaxe = previouslyEquipped || PICKAXE_DATA[0];
        currentOreHP = ORE_DATA[currentOreIndex].hp;

        synchronizeSecuritySignature();
    } catch (error) {
        console.error("Corrupted local save footprint cleared:", error);
        localStorage.removeItem('jackcodelab_craftlabs_save');
    }
}

// --- 🛡️ SECURITY AUDITOR MONITOR ---
function calculateIntegritySignature(val) {
    let stringForm = val.toString() + INCOGNITO_SALT + activePickaxe.power.toString();
    let computedHash = 0;
    for (let i = 0; i < stringForm.length; i++) {
        computedHash = ((computedHash << 5) - computedHash) + stringForm.charCodeAt(i);
        computedHash |= 0;
    }
    return computedHash.toString();
}

function synchronizeSecuritySignature() {
    verificationHash = calculateIntegritySignature(diamonds);
}

function runSecurityAudit() {
    if (verificationHash !== calculateIntegritySignature(diamonds)) {
        document.getElementById('cheat-screen').style.display = "flex";
        return false;
    }
    return true;
}

// --- SLIDER ENGINE NAVIGATION ---
function changeOreSelection(direction) {
    if (!runSecurityAudit()) return;

    currentOreIndex += direction;
    if (currentOreIndex < 0) currentOreIndex = ORE_DATA.length - 1;
    if (currentOreIndex >= ORE_DATA.length) currentOreIndex = 0;

    const ore = ORE_DATA[currentOreIndex];
    currentOreHP = ore.hp;

    currentOreNameEl.textContent = ore.name;
    renderOreImg.src = ore.img;

    updateDisplay();
    saveGameProgress();
}
// Click hit tracker
oreHitTarget.addEventListener('click', () => {
    if (!runSecurityAudit()) return;

    const currentOre = ORE_DATA[currentOreIndex];
    currentOreHP -= activePickaxe.power;

    if (currentOreHP <= 0) {
        diamonds += currentOre.reward;
        currentOreHP = currentOre.hp;
        synchronizeSecuritySignature();
    }

    updateDisplay();
    saveGameProgress();
});

// --- RENDER DYNAMIC COMPONENT LISTS ---
function renderDynamicViews() {
    const shopContainer = document.getElementById('dynamic-shop-container');
    if (shopContainer) {
        shopContainer.innerHTML = "";
        PICKAXE_DATA.forEach(pick => {
            let buttonActionHtml = "";
            if (pick.unlocked) {
                let isEquipped = activePickaxe.id === pick.id;
                buttonActionHtml = isEquipped
                    ? `<button class="unlocked-btn" style="background:#cbd5e0; color:#4a5568;" disabled>Equipped</button>`
                    : `<button onclick="equipPickaxe('${pick.id}')" style="background:#3182ce;">Equip</button>`;
            } else {
                buttonActionHtml = `<button onclick="buyPickaxe('${pick.id}', ${pick.cost})">Forge (${pick.cost.toLocaleString()} 💎)</button>`;
            }

            shopContainer.innerHTML += `
                <div class="shop-item">
                    <div>
                        <h3>${pick.name}</h3>
                        <p>Mining Power: +${pick.power} Dmg per click</p>
                    </div>
                    ${buttonActionHtml}
                </div>
            `;
        });
    }

    const rewardsContainer = document.getElementById('dynamic-rewards-container');
    if (rewardsContainer) {
        rewardsContainer.innerHTML = "";
        REWARD_ITEMS_DATA.forEach(perk => {
            rewardsContainer.innerHTML += `
                <div class="reward-unlock-card">
                    <div>
                        <h3>${perk.name}</h3>
                        <p class="unlock-desc">${perk.description}</p>
                        <div class="hidden-link-box" id="link-${perk.id}" style="display:block;">
                            🔗 <a href="${perk.link}" target="_blank">${perk.linkText}</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

function buyPickaxe(id, cost) {
    if (!runSecurityAudit()) return;
    if (diamonds >= cost) {
        diamonds -= cost;
        const targetPick = PICKAXE_DATA.find(p => p.id === id);
        targetPick.unlocked = true;
        activePickaxe = targetPick;

        synchronizeSecuritySignature();
        updateDisplay();
        renderDynamicViews();
        saveGameProgress();
        alert(`Successfully forged ${targetPick.name}!`);
    } else { alert("Insufficient diamonds to forge this item!"); }
}

function equipPickaxe(id) {
    if (!runSecurityAudit()) return;
    activePickaxe = PICKAXE_DATA.find(p => p.id === id);
    synchronizeSecuritySignature();
    updateDisplay();
    renderDynamicViews();
    saveGameProgress();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-content');
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
}

function updateDisplay() {
    if (globalDiamondCountEl) globalDiamondCountEl.textContent = diamonds.toLocaleString();
    if (equippedPickNameEl) equippedPickNameEl.textContent = activePickaxe.name;
    if (equippedPickPowerEl) equippedPickPowerEl.textContent = activePickaxe.power;

    const currentOre = ORE_DATA[currentOreIndex];
    const percentage = Math.max(0, (currentOreHP / currentOre.hp) * 100);
    if (oreHpFill) oreHpFill.style.width = percentage + "%";
    if (hpNumericalText) hpNumericalText.textContent = `HP: ${currentOreHP} / ${currentOre.hp}`;

    if (mineZoneBox) {
        mineZoneBox.style.cursor = `url('${activePickaxe.img}') 16 16, crosshair`;
    }
}

// --- FIXED GITHUB PROFILE PROFILE CONNECT ENGINE ---
function syncGitHubProfile() {
    const inputField = document.getElementById('gh-username-input');

    if (!inputField) {
        console.error("HTML Error: Could not find an input field with id='gh-username-input'");
        alert("Developer configuration error! Check your browser console.");
        return;
    }

    const username = inputField.value.trim();
    if (!username) {
        alert("Please type a username first!");
        return;
    }

    // FIX: Swapped to correct dynamic template literals targeting public developer user objects
    fetch(`https://github.com{username}`)
        .then(response => {
            if (!response.ok) throw new Error("User profile endpoint returned 404");
            return response.json();
        })
        .then(data => {
            const avatarEl = document.querySelector('.avatar-icon');
            const nameEl = document.querySelector('.profile-text strong');
            const bioEl = document.querySelector('.profile-text span');

            if (avatarEl) avatarEl.innerHTML = `<img src="${data.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            if (nameEl) nameEl.textContent = data.login;
            if (bioEl) bioEl.textContent = data.bio || "Active Miner";

            localStorage.setItem('synced_github_user', data.login);
            saveGameProgress();
            alert(`Successfully synchronized profile card for: ${data.login}!`);
        })
        .catch(err => {
            console.error("API Fetch Error Details:", err);
            alert("Could not find that GitHub profile! Double-check spelling or network connectivity.");
        });
}

// Initial Bootstrap Startup Sequences
loadGameProgress();
updateDisplay();
renderDynamicViews();

currentOreNameEl.textContent = ORE_DATA[currentOreIndex].name;
renderOreImg.src = ORE_DATA[currentOreIndex].img;
// --- ✨ DYNAMIC CLICK PARTICLE FEEDBACK GENERATOR ---
oreHitTarget.addEventListener('mousedown', (event) => {
    if (!runSecurityAudit()) return;

    // Get the relative positioning inside the ore container box bounding client
    const boundingBox = oreHitTarget.getBoundingClientRect();
    const relativeX = event.clientX - boundingBox.left;
    const relativeY = event.clientY - boundingBox.top;

    // Create a new span container to act as our particle node element
    const particle = document.createElement('span');
    particle.className = 'click-particle';

    // Position the particle exactly where the mouse pointer registered the hit
    particle.style.left = `${relativeX}px`;
    particle.style.top = `${relativeY}px`;

    // Display the exact amount of damage your pickaxe dealt to the ore block
    particle.textContent = `-${activePickaxe.power}`;

    // Append to the inner target area window
    oreHitTarget.appendChild(particle);

    // Completely clear out the node block once its animation cycle completes to keep memory light
    setTimeout(() => {
        particle.remove();
    }, 600);
});
