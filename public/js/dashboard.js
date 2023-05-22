// document.addEventListener("DOMContentLoaded", () => {
//   // Get the action buttons
//   const adoptButton = document.getElementById("selectBtn");

//   // Add event listeners to the buttons
//   adoptButton.addEventListener("click", selectPet);
// });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // get pet list for user
    const response = await fetch("/dashboard/petList", { method: "GET" });
    if (!response.ok) {
      throw new Error("Failed to get pet list");
    }
    const petList = await response.json();
    console.log(petList);
  } catch (error) {
    console.error(error);
  }
});

async function selectPet() {
  try {
    let pet_id = "4";
    const response = await fetch("/selectPet/" + pet_id, { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to select pet");
    }
    const success = await response.json();
  } catch (error) {
    console.error(error);
  }
}
