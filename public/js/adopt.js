const seenExtPetId = [-1];
let currPet;
let adoptablePet = {};

function refreshPet() {
  seenExtPetId.push(currPet.id);
}

async function generateDog() {
  try {
    const response = await fetch("/getDog/" + seenExtPetId);
    currPet = await response.json();
    refreshPet();
    document.querySelector("#nameInput").value = currPet.name;
    document.querySelector("#typeInput").value = currPet.type;
    document.querySelector("#traitInput").value = currPet.tags[0];
    document.querySelector("#petImage").src = currPet.photos[0].medium;
  } catch (error) {
    console.error("err", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await generateDog();
});

document
  .querySelector("#RefreshButton")
  .addEventListener("click", async function () {
    console.log("clicking", currPet);
    await generateDog();
  });

document
  .querySelector(".Adoptbutton")
  .addEventListener("click", async function () {
    try {
      await fetch("/addPet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          externalID: currPet.id,
          name: currPet.name,
          dateCreated: new Date().toISOString().slice(0, 19).replace("T", " "),
          type: currPet.type,
        }),
      }).then(
        window.location.replace("/dashboard")
    
         );
    } catch (error) {
      console.error(error);
    }
  });
