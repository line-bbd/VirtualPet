const seenExtPetId = [123,456];

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/getDog/"+seenExtPetId);
      if (!response.ok) {
        throw new Error("Failed to fetch pet stats");
      }
      const petStats = await response.json();
      // Update the DOM with the pet stats
    //   updatePetStats(petStats);
    } catch (error) {
      console.error(error);
    }
  });

function refreshPet()
{

}