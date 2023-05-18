document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/getPetStats");
    if (!response.ok) {
      throw new Error("Failed to fetch pet stats");
    }
    const petStats = await response.json();

    // Update the DOM with the pet stats
    updatePetStats(petStats);
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get the action buttons
  const feedButton = document.getElementById("btn-feed");
  const washButton = document.getElementById("btn-bath");
  const attentionButton = document.getElementById("btn-giveAttention");
  const medicineButton = document.getElementById("btn-giveMedicine");
  const treatButton = document.getElementById("btn-giveTreat");
  const toyButton = document.getElementById("btn-giveToy");
  const sleepButton = document.getElementById("btn-sleep");

  // Add event listeners to the buttons
  feedButton.addEventListener("click", handleFeedAction);
  washButton.addEventListener("click", handleWashAction);
  attentionButton.addEventListener("click", handleAttentionAction);
  medicineButton.addEventListener("click", handleMedicineAction);
  treatButton.addEventListener("click", handleTreatAction);
  toyButton.addEventListener("click", handleToyAction);
  sleepButton.addEventListener("click", handleSleepAction);
});

async function handleFeedAction() {
  try {
    const response = await fetch("/play/feed", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to feed the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleWashAction() {
  try {
    const response = await fetch("/play/bath", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to wash the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleAttentionAction() {
  try {
    const response = await fetch("/play/attention", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give attention to the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleMedicineAction() {
  try {
    const response = await fetch("/play/medicine", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give medicine to the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleTreatAction() {
  try {
    const response = await fetch("/play/treat", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give a treat to the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleToyAction() {
  try {
    const response = await fetch("/play/toy", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give a toy to the pet");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleSleepAction() {
  try {
    const response = await fetch("/play/sleep", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to put the pet to sleep");
    }
    const updatedPetStats = await response.json();

    // Update the DOM with the updated pet stats
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

function updatePetStats(petStats) {
  document.getElementById("name").textContent = petStats.name;
  document.getElementById("health").textContent = petStats.health;
  document.getElementById("fed").textContent = petStats.fed;
  document.getElementById("happiness").textContent = petStats.happiness;
  document.getElementById("hygiene").textContent = petStats.hygiene;
  document.getElementById("energy").textContent = petStats.energy;
}
