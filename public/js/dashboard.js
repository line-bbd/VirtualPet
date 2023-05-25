// document.addEventListener("DOMContentLoaded", () => {
//   // Get the action buttons
//   const adoptButton = document.getElementById("selectBtn");

//   // Add event listeners to the buttons
//   adoptButton.addEventListener("click", selectPet);
// });

getUserPets();

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
  let petCounter = 1;
  for (let pet of userUserPets) {
    htmlString += `<section id="petcard" class="card">
<img class="card-img" src="img/PetLogo.png" />
<section class="lower-card">
  <h2 class="pet-name">${pet.name}</h2>
  <section class="card-buttons"><button class="card-button" id="deletebutton${petCounter}">
  <i class="fa-solid fa-trash icon-style"></i>
</button>
<button class="card-button" id="playbutton${petCounter}">
  <i class="fa-regular fa-circle-play icon-style"></i>
</button></section>
</section>
</section>`;
    petCounter++;
  }

  for (let i = petCounter; i <= 4; i++) {
    htmlString += `<section id="petcard" class="card">
<img class="card-img" src="img/PetLogo.png" />
<section class="lower-card">
  <h2 class="pet-name">Add Pet</h2>
  <section class="card-buttons">
<button class="card-button" id="adoptpetbutton${petCounter}">
  <i class="fa-solid fa-plus icon-style"></i>
</button></section>
</section>
</section>`;
    petCounter++;
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
      if (petList) {
        buildCards(petList);
        setUpClicklisteners(petList);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function setUpClicklisteners(petList) {
  if (petList[0]) {
    document
      .getElementById('deletebutton1')
      .addEventListener('click', function () {
        handlePetDeletion(petList[0]);
      });
  }

  if (petList[1]) {
    document
      .getElementById('deletebutton2')
      .addEventListener('click', function () {
        handlePetDeletion(petList[1]);
      });
  }

  if (petList[2]) {
    document
      .getElementById('deletebutton3')
      .addEventListener('click', function () {
        handlePetDeletion(petList[2]);
      });
  }

  if (petList[3]) {
    document
      .getElementById('deletebutton4')
      .addEventListener('click', function () {
        handlePetDeletion(petList[3]);
      });
  }

  if (document.getElementById('adoptpetbutton1')) {
    document
      .getElementById('adoptpetbutton1')
      .addEventListener('click', function () {
        location.href = '/adopt';
      });
  }

  if (document.getElementById('adoptpetbutton2')) {
    document
      .getElementById('adoptpetbutton2')
      .addEventListener('click', function () {
        location.href = '/adopt';
      });
  }

  if (document.getElementById('adoptpetbutton3')) {
    document
      .getElementById('adoptpetbutton3')
      .addEventListener('click', function () {
        location.href = '/adopt';
      });
  }

  if (document.getElementById('adoptpetbutton4')) {
    document
      .getElementById('adoptpetbutton4')
      .addEventListener('click', function () {
        location.href = '/adopt';
      });
  }
}

async function handlePetDeletion(pet) {
  try {
    const response = await fetch('/dashboard/deletePet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        petId: pet.pet_id,
      }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to delete pet');
    }
    const success = response.json();
  } catch (error) {
    console.log(error);
  }
}
