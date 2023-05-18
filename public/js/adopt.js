document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/getAllDogs");
      if (!response.ok) {
        throw new Error("Failed to fetch pet stats");
      }
      const petStats = await response.json();
      console.log(petStats);
      // Update the DOM with the pet stats
    //   updatePetStats(petStats);
    } catch (error) {
      console.error(error);
    }
  });