const seenExtPetId = [-1];
let currPet;

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/getDog/"+seenExtPetId);
      if (!response.ok) {
        throw new Error("Failed to fetch pet stats");
      }
      currPet = await response.json();
      console.log(currPet);
      // Update the DOM with the pet stats
    //   updatePetStats(petStats);
    } catch (error) {
      console.error(error);
    }
  });

function refreshPet()
{
    seenExtPetId.push(currPet.id);
}