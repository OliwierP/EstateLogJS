window.onload = function() {

  // // // GET all // // //
  var showAllLink = document.getElementById("showAllLink");

  showAllLink.addEventListener("click", function(event) {
    event.preventDefault();

    fetch("http://localhost:3000/transactions")
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
        console.error(error + "Zdecydowanie coś poszło nie tak. Jesteś pewien, że masz działającą bazę oraz uruchomione app.js? I poprawnie wpisane dane? I czy link do API się zgadza? Bo to na 97% nie jest problem z tym kodem.");
      });
  });

  // // // GET one // // //
  var transactionForm = document.getElementById("transactionForm");
  var transactionIdInput = document.getElementById("transactionIdInput");

  transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var transactionId = transactionIdInput.value;

    fetch("http://localhost:3000/transactions/" + transactionId)
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
        console.error(error + "Jestem przekonany, że nie ma takiej transakcji.");
      });
  });

    // // // POST // // //
    var addTransactionForm = document.getElementById("addTransactionForm");
    var clientIdInput = document.getElementById("clientIdInput");
    var agentIdInput = document.getElementById("agentIdInput");
    var estateIdInput = document.getElementById("estateIdInput");
    var dateInput = document.getElementById("dateInput");
    var stateInput = document.getElementById("stateInput");
  
    addTransactionForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      var transactionData = {
        client_id: clientIdInput.value,
        agent_id: agentIdInput.value,
        estate_id: estateIdInput.value,
        date: dateInput.value,
        state: stateInput.value
      };
  
      fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("Transaction added successfully:", data);
          addTransactionForm.reset();
        })
        .catch(function(error) {
          console.error("An error occurred while adding the transaction:", error);
        });
    });


 // // // PUT // // //
  var updateTransactionForm = document.getElementById("updateTransactionForm");
  var updateTransactionIdInput = document.getElementById("updateTransactionIdInput");
  var updateClientIdInput = document.getElementById("updateClientIdInput");
  var updateAgentIdInput = document.getElementById("updateAgentIdInput");
  var updateEstateIdInput = document.getElementById("updateEstateIdInput");
  var updateDateInput = document.getElementById("updateDateInput");
  var updateStateInput = document.getElementById("updateStateInput");

  updateTransactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var transactionData = {
      client_id: updateClientIdInput.value,
      agent_id: updateAgentIdInput.value,
      estate_id: updateEstateIdInput.value,
      date: updateDateInput.value,
      state: updateStateInput.value
    };

    var transactionId = updateTransactionIdInput.value;

    fetch("http://localhost:3000/transactions/" + transactionId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transactionData)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log("Transaction updated successfully:", data);
        updateTransactionForm.reset();
      })
      .catch(function(error) {
        console.error("An error occurred while updating the transaction:", error);
      });
  });

  // // // DELETE // // //
  var deleteTransactionForm = document.getElementById("deleteTransactionForm");
  var deleteTransactionIdInput = document.getElementById("deleteTransactionIdInput");

  deleteTransactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var transactionId = deleteTransactionIdInput.value;

    fetch("http://localhost:3000/transactions/" + transactionId, {
      method: "DELETE"
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Transakcja poprawnie usunięta");
          // Reset the form
          deleteTransactionForm.reset();
        } else {
          console.error("Nie udało się usunąć transakcji, prawdopodobnie nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
        }
      })
      .catch(function(error) {
        console.error(error + + "Nie udało się usunąć transakcji, prawdopodobnie nie istnieje. Upewnij się, że żadna z tych opcji nie występuje, zanim uznasz to za niedziałające.");
      });
  });
};
