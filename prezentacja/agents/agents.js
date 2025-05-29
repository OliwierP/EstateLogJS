window.onload = function() {
  
    // // // GET all // // //
    var showAllLink = document.getElementById("showAllLink");
  
    showAllLink.addEventListener("click", function(event) {
      event.preventDefault();
  
      fetch("http://localhost:3000/agents")
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
    var agentForm = document.getElementById("agentForm");
    var agentIdInput = document.getElementById("agentIdInput");
  
    agentForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      var agentId = agentIdInput.value;
  
      fetch("http://localhost:3000/agents/" + agentId)
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
          console.error(error + "Jestem przekonany, że nie ma takiego agenta.");
        });
    });
  
    // // // POST // // //
    var addAgentForm = document.getElementById("addAgentForm");
    var firstNameInput = document.getElementById("firstNameInput");
    var lastNameInput = document.getElementById("lastNameInput");
    var emailInput = document.getElementById("emailInput");
    var phoneInput = document.getElementById("phoneInput");
    var positionInput = document.getElementById("positionInput");
  
    addAgentForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      var agentData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        position: positionInput.value
      };

      console.log(agentData);
  
      fetch("http://localhost:3000/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(agentData)
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("Agent dodany poprawnie:", data);
          addAgentForm.reset();
        })
        .catch(function(error) {
          console.error("Upewnij się, że wszystko wpisałeś dobrze i wszystko masz uruchomione, bo mam błąd z wpisaniem agenta:", error);
        });
    });
  
    // // // PUT // // //
    var updateAgentForm = document.getElementById("updateAgentForm");
    var updateAgentIdInput = document.getElementById("updateAgentIdInput");
    var updateFirstNameInput = document.getElementById("updateFirstNameInput");
    var updateLastNameInput = document.getElementById("updateLastNameInput");
    var updateEmailInput = document.getElementById("updateEmailInput");
    var updatePhoneInput = document.getElementById("updatePhoneInput");
    var updatePositionInput = document.getElementById("updatePositionInput");
  
    updateAgentForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      var agentData = {
        firstName: updateFirstNameInput.value,
        lastName: updateLastNameInput.value,
        email: updateEmailInput.value,
        phone: updatePhoneInput.value,
        position: updatePositionInput.value
      };
  
      var agentId = updateAgentIdInput.value;
  
      fetch("http://localhost:3000/agents/" + agentId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(agentData)
      })
        .then(function(response) {
          if (response.ok) {
            console.log("Agent poprawnie zaktualizowany");
            updateAgentForm.reset();
          } else {
            throw new Error("Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącego klienta.");
          }
        })
        .catch(function(error) {
          console.error(error + "Coś poszło nie tak. Upewnij się, że aktualizujesz istniejącego agenta.");
        });
    });
  
    // // // DELETE // // //
    var deleteAgentForm = document.getElementById("deleteAgentForm");
    var deleteAgentIdInput = document.getElementById("deleteAgentIdInput");
  
    deleteAgentForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      var agentId = deleteAgentIdInput.value;
  
      fetch("http://localhost:3000/agents/" + agentId, {
        method: "DELETE"
      })
        .then(function(response) {
          if (response.ok) {
            console.log("Agent poprawnie usunięty");
            // Reset the form
            deleteAgentForm.reset();
          } else {
            console.error("Nie udało się dodać agenta, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jego usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
          }
        })
        .catch(function(error) {
          console.error(error + + "Nie udało się dodać agenta, prawdopodobnie jest częścią jakiejś transakcji, co uniemożliwia jego usunięcie, albo po prostu nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
        });
    });
  };
  