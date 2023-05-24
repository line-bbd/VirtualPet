document.addEventListener("DOMContentLoaded", async () => {
  try {
    let pet_id = "4"; //TODO need to get selected pet id here
    const response = await fetch("/viewPet/getPetStats");
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
  const backBtn = document.getElementById("backImg");

  // Add event listeners to the buttons
  feedButton.addEventListener("click", handleFeedAction);
  attentionButton.addEventListener("click", handleAttentionAction);
  washButton.addEventListener("click", handleWashAction);
  medicineButton.addEventListener("click", handleMedicineAction);
  backBtn.addEventListener("click", handleBackAction);
});

async function handleBackAction() {
  try {
    let pet_id = "4"; //TODO need to get selected pet id here

    const response = await fetch("/viewPet/endSession/" + pet_id, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed save state of pet");
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleFeedAction() {
  try {
    const response = await fetch("/viewPet/feed", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to feed the pet");
    }
    const updatedPetStats = await response.json();
    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleWashAction() {
  try {
    const response = await fetch("/viewPet/bath", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to wash the pet");
    }
    const updatedPetStats = await response.json();

    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleAttentionAction() {
  try {
    const response = await fetch("/viewPet/attention", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give attention to the pet");
    }
    const updatedPetStats = await response.json();

    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

async function handleMedicineAction() {
  try {
    const response = await fetch("/viewPet/medicine", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to give medicine to the pet");
    }
    const updatedPetStats = await response.json();

    updatePetStats(updatedPetStats);
  } catch (error) {
    console.error(error);
  }
}

function updatePetStats(petStats) {
  document.getElementById("healthLbl").childNodes[2].textContent =
    " " + petStats.health; //TODO: This needs to change to a happiness label
  document.getElementById("foodLbl").childNodes[2].textContent =
    " " + petStats.fed;
  document.getElementById("attentionLbl").childNodes[2].textContent =
    " " + petStats.energy;
  document.getElementById("sickLbl").childNodes[2].textContent =
    " " + petStats.happiness;
  document.getElementById("cleanLbl").childNodes[2].textContent =
    " " + petStats.hygiene;
}
