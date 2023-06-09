let timerFunc;
const timerIntervalMs = 10000;

document.addEventListener("DOMContentLoaded", async () => {
  try {
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
  // backBtn.addEventListener("click", handleBackAction);

  //handles the case the browser is close
  window.onbeforeunload = function (event) {
    handleBackAction();
  };

  timerFunc = setInterval(async function () {
    try {
      const response = await fetch("/viewPet/updatePetStatsRandomly");
      if (!response.ok) {
        throw new Error("Failed to change pet stats");
      }
      const petStats = await response.json();
      // Update the DOM with the pet stats
      updatePetStats(petStats);
    } catch (error) {
      console.error(error);
    }
  }, timerIntervalMs);
});

async function handleBackAction() {
  try {
    const response = await fetch("/viewPet/endSession", { method: "POST" });
    clearInterval(timerFunc);
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
    " " + petStats.health;
  document.getElementById("foodLbl").childNodes[2].textContent =
    " " + petStats.fed;
  document.getElementById("attentionLbl").childNodes[2].textContent =
    " " + petStats.energy;
  document.getElementById("sickLbl").childNodes[2].textContent =
    " " + petStats.happiness;
  document.getElementById("cleanLbl").childNodes[2].textContent =
    " " + petStats.hygiene;

  console.log(petStats.name);
  document.getElementById("nameLbl").textContent = petStats.name;
}
