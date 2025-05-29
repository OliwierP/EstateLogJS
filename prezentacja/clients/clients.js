window.onload = function() {
  
// // // GET all // // //
  var showAllLink = document.getElementById("showAllLink");

  showAllLink.addEventListener("click", function(event) {
    event.preventDefault();

    fetch("http://localhost:3000/clients")
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
        console.error(error+ "Zdecydowanie coś poszło nie tak. Jesteś pewien, że masz działającą bazę oraz uruchomione app.js? I poprawnie wpisane dane? I czy link do api się zgadza? Bo to na 97% nie jest problem z tym kodem.");
      });
  });

// // // GET one // // //
  var clientForm = document.getElementById("clientForm");
  var clientIdInput = document.getElementById("clientIdInput");

  clientForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var clientId = clientIdInput.value;

    fetch("http://localhost:3000/clients/" + clientId)
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
        console.error(error  + "Jestem przekonany, że nie ma takiego klienta.");
      });
  });

// // // POST // // //
  var addClientForm = document.getElementById("addClientForm");
  var firstNameInput = document.getElementById("firstNameInput");
  var lastNameInput = document.getElementById("lastNameInput");
  var emailInput = document.getElementById("emailInput");
  var phoneInput = document.getElementById("phoneInput");

  addClientForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var clientData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      phone: phoneInput.value
    };

    fetch("http://localhost:3000/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log("Klient został poprawnie dodany:", data);
        addClientForm.reset();
      })
      .catch(function(error) {
        console.error("Upewnij się, że wszystko wpisałeś dobrze i wszystko masz uruchomione, bo mam błąd z wpisaniem klienta:", error);
      });
  });

// // // PUT // // //
  var updateClientForm = document.getElementById("updateClientForm");
  var updateClientIdInput = document.getElementById("updateClientIdInput");
  var updateFirstNameInput = document.getElementById("updateFirstNameInput");
  var updateLastNameInput = document.getElementById("updateLastNameInput");
  var updateEmailInput = document.getElementById("updateEmailInput");
  var updatePhoneInput = document.getElementById("updatePhoneInput");

  updateClientForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var clientData = {
      firstName: updateFirstNameInput.value,
      lastName: updateLastNameInput.value,
      email: updateEmailInput.value,
      phone: updatePhoneInput.value
    };

    var clientId = updateClientIdInput.value;

    fetch("http://localhost:3000/clients/" + clientId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData)
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Klient zaktualizowany poprawnie.");
          updateClientForm.reset();
        } else {
          throw new Error("Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącego klienta.");
        }
      })
      .catch(function(error) {
        console.error(error + "Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącego klienta.");
      });
  });

// // // DELETE // // //
  var deleteClientForm = document.getElementById("deleteClientForm");
  var deleteClientIdInput = document.getElementById("deleteClientIdInput");

  deleteClientForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var clientId = deleteClientIdInput.value;

    fetch("http://localhost:3000/clients/" + clientId, {
      method: "DELETE"
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Poprawnie dodano klienta");
          // Reset the form
          deleteClientForm.reset();
        } else {
          console.error("Nie udało się dodać klienta, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jego usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające. Status: " + response.status);
        }
      })
      .catch(function(error) {
        console.error(error + "Nie udało się dodać klienta, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jego usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
      });
  });
};
