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
  const feedButton = document.getElementById("feedBtn");
  const attentionButton = document.getElementById("walkBtn");
  const washButton = document.getElementById("cleanBtn");
  const medicineButton = document.getElementById("healBtn");

  // const waterButton = document.getElementById("btn-givewater");
  // const treatButton = document.getElementById("btn-giveTreat");
  // const toyButton = document.getElementById("btn-giveToy");
  // const sleepButton = document.getElementById("btn-sleep");

  // Add event listeners to the buttons
  feedButton.addEventListener("click", handleFeedAction);
  attentionButton.addEventListener("click", handleAttentionAction);
  washButton.addEventListener("click", handleWashAction);
  medicineButton.addEventListener("click", handleMedicineAction);

  // waterButton.addEventListener("click", handleWaterAction);
  // treatButton.addEventListener("click", handleTreatAction);
  // toyButton.addEventListener("click", handleToyAction);
  // sleepButton.addEventListener("click", handleSleepAction);
});

async function handleFeedAction() {
  try {
    const response = await fetch("/play?feed=true", { method: "POST" });
    console.log("FEEEEEEDD");
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
    const response = await fetch("/play?bath=true", { method: "POST" });
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

async function handleWaterAction() {
  try {
    const response = await fetch("/play?water=true", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give water to the pet");
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
    const response = await fetch("/play?attention=true", { method: "POST" });
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
    const response = await fetch("/play?medicine=true", { method: "POST" });
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
    const response = await fetch("/play?treat=true", { method: "POST" });
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
    const response = await fetch("/play?toy=true", { method: "POST" });
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
    const response = await fetch("/play?sleep=true", { method: "POST" });
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
  // document.getElementById("name").textContent = petStats.name;
  document.getElementById("healthLbl").textContent = petStats.health;
  document.getElementById("foodLbl").textContent = petStats.fed;
  document.getElementById("cleanLbl").textContent = petStats.hygiene;
  document.getElementById("sickLbl").textContent = petStats.energy;
  // document.getElementById("hydrated").textContent = petStats.hydrated;
  // document.getElementById("happiness").textContent = petStats.happiness;

}
