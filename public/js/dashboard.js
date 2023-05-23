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

document.addEventListener("DOMContentLoaded", () => {
  let btn = document.getElementById("playBtn");
  btn.addEventListener("click", async function() {
  try {
    let pet_id = '4';//TODO need to get selected pet id here
    const response = await fetch("/viewPet/setPetInfo/"+pet_id,{ method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to show pet");
    }
  } catch (error) {
    console.error(error);
  }
});
});

async function selectPet() {
  try {
    let pet_id = '4';
    const response = await fetch('/selectPet/' + pet_id, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to select pet');
    }
    const success = await response.json();
  } catch (error) {
    console.error(error);
  }
}

function buildCards(userUserPets) {
  const cardLayout = document.querySelector('#cardLayout');
  let htmlString = '';
  let petCounter = 0;
  for (let pet of userUserPets) {
    htmlString += `<section id="petcard" class="card">
<img class="card-img" src="img/PetLogo.png" />
<section class="lower-card">
  <h2 class="pet-name">${pet.name}</h2>
  <section class="card-buttons"><button class="card-button">
  <i class="fa-solid fa-trash icon-style"></i>
</button>
<button class="card-button">
  <i class="fa-regular fa-circle-play icon-style"></i>
</button></section>
</section>
</section>`;
    petCounter++;
  }

  for (let i = petCounter; i < 4; i++) {
    htmlString += `<section id="petcard" class="card">
<img class="card-img" src="img/PetLogo.png" />
<section class="lower-card">
  <h2 class="pet-name">Add Pet</h2>
  <section class="card-buttons">
<button class="card-button">
  <i class="fa-solid fa-plus icon-style"></i>
</button></section>
</section>
</section>`;
  }

  cardLayout.innerHTML = htmlString;
}

async function getUserPets() {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // get pet list for user
      const response = await fetch('/dashboard/petList', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to get pet list');
      }
      const petList = await response.json();
      buildCards(petList);
      console.log(petList);
    } catch (error) {
      console.error(error);
    }
  });
}
