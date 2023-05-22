// import { getDogs, getAnimalByID } from "./petFinderAPI";
// const petfinderAPI = require("../../src/utils/petfinderAPI");


 document.querySelector("#nameInput").value = "pet name"

    document.querySelector("#typeInput").value = "pet type"
  
    document.querySelector("#traitInput").value = (new Date().toISOString().slice(0,19).replace('T', ' '));

    const seenExtPetId = [-1];
let currPet;

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/getDog/"+seenExtPetId);
      if (!response.ok) {
        throw new Error("Failed to fetch pet stats");
      }
      currPet = await response.json();
      console.log("current",currPet);
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

document
  .querySelector(".Adoptbutton")
  .addEventListener("click", async function () {
    try {
      await fetch("/addPet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //get from api
        body: JSON.stringify({
          externalID: 232,
          userID: 1,
          name: "petname",
          dateCreated: "2023-05-12 10:30:00+00",
          type: "petType",
        }),
      });
    } catch (error) {
      console.error(error);
    }
  });
