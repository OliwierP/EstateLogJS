window.onload = function() {

  // // // GET all // // //
  var showAllLink = document.getElementById("showAllLink");

  showAllLink.addEventListener("click", function(event) {
    event.preventDefault();

    fetch("http://localhost:3000/estates")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var jsonData = JSON.stringify(data, null, 2);
        var newWindow = window.open("", "_blank");
        newWindow.document.open();
        newWindow.document.write("<pre>" + jsonData + "</pre>");
        newWindow.document.close();
      })
      .catch(function(error) {
        console.error(error + "Zdecydowanie coś poszło nie tak. Jesteś pewien, że masz działającą bazę oraz uruchomione app.js? I poprawnie wpisane dane? I czy link do api się zgadza? Bo to na 97% nie jest problem z tym kodem.");
      });
  });

  // // // GET one // // //
  var estateForm = document.getElementById("estateForm");
  var estateIdInput = document.getElementById("estateIdInput");

  estateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var estateId = estateIdInput.value;

    fetch("http://localhost:3000/estates/" + estateId)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var jsonData = JSON.stringify(data, null, 2);
        var newWindow = window.open("", "_blank");
        newWindow.document.open();
        newWindow.document.write("<pre>" + jsonData + "</pre>");
        newWindow.document.close();
      })
      .catch(function(error) {
        console.error(error + "Jestem przekonany, że nie ma takiej nieruchomości.");
      });
  });

  // // // POST // // //
  var addEstateForm = document.getElementById("addEstateForm");
  var nameInput = document.getElementById("nameInput");
  var addressInput = document.getElementById("addressInput");
  var priceInput = document.getElementById("priceInput");
  var isBoughtInput = document.getElementById("isBoughtInput");

  addEstateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var estateData = {
      name: nameInput.value,
      address: addressInput.value,
      price: priceInput.value,
      is_bought: isBoughtInput.value
    };

    console.log(estateData);

    fetch("http://localhost:3000/estates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(estateData)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log("Nieruchomość dodana poprawnie:", data);
        addEstateForm.reset();
      })
      .catch(function(error) {
        console.error("Upewnij się, że wszystko wpisałeś dobrze i wszystko masz uruchomione, bo mam błąd z wpisaniem nieruchomości:", error);
      });
  });

  // // // PUT // // //
  var updateEstateForm = document.getElementById("updateEstateForm");
  var updateEstateIdInput = document.getElementById("updateEstateIdInput");
  var updateNameInput = document.getElementById("updateNameInput");
  var updateAddressInput = document.getElementById("updateAddressInput");
  var updatePriceInput = document.getElementById("updatePriceInput");
  var updateIsBoughtInput = document.getElementById("updateIsBoughtInput");

  updateEstateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var estateData = {
      name: updateNameInput.value,
      address: updateAddressInput.value,
      price: updatePriceInput.value,
      is_bought: updateIsBoughtInput.value
    };



    var estateId = updateEstateIdInput.value;

    fetch("http://localhost:3000/estates/" + estateId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(estateData)
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Nieruchomość poprawnie zaktualizowana");
          updateEstateForm.reset();
        } else {
          throw new Error("Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącą nieruchomość.");
        }
      })
      .catch(function(error) {
        console.error(error + "Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącą nieruchomość.");
      });
  });

  // // // DELETE // // //
  var deleteEstateForm = document.getElementById("deleteEstateForm");
  var deleteEstateIdInput = document.getElementById("deleteEstateIdInput");

  deleteEstateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var estateId = deleteEstateIdInput.value;

    fetch("http://localhost:3000/estates/" + estateId, {
      method: "DELETE"
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Nieruchomość poprawnie usunięta");
          // Reset the form
          deleteEstateForm.reset();
        } else {
          console.error("Nie udało się usunąć nieruchomości, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jej usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
        }
      })
      .catch(function(error) {
        console.error(error + + "Nie udało się usunąć nieruchomości, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jej usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
      });
  });
};
