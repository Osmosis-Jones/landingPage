// Function to fetch and display winners in an HTML list
function displayWinners() {
    fetch('http://ergast.com/api/f1/driverstandings/1.json?limit=1000')
      .then(response => response.json())
      .then(data => {
        const champions = data.MRData.StandingsTable.StandingsLists;

        let startIndex = 0;
        for (let i = 0; i < champions.length; i++) {
          if (champions[i].season === '2005') {
            startIndex = i;
            break;
          }
        }

        const winnersList = document.createElement('ul');
        winnersList.setAttribute('id', 'winners-list');

        for (let i = startIndex; i < champions.length; i++) {
          const year = champions[i].season;
          const winner = champions[i].DriverStandings[0].Driver;

          const containerWinner = document.createElement('div');
          containerWinner.classList.add('container-winner');
          containerWinner.setAttribute('data-year', year);

          // Set data-year attribute
          const yearItem = document.createElement('span');
          yearItem.classList.add('year');
          yearItem.textContent = year;
          containerWinner.appendChild(yearItem);

          const winnerItem = document.createElement('span');
          winnerItem.textContent = `${winner.givenName} ${winner.familyName}`;
          containerWinner.appendChild(winnerItem);

          winnersList.appendChild(containerWinner);
        }

        const container = document.querySelector('.container');
        container.appendChild(winnersList);

        // Add click event listener to each container
        const containerWinners = document.querySelectorAll('.container-winner');
        containerWinners.forEach(container => {
          container.addEventListener('click', () => {
            const year = container.getAttribute('data-year');
            showWinnersForYear(year, champions);
            highlightWinnerName(container);
          });
        });
      })
      .catch(error => console.log('An error occurred while fetching the standings data:', error));
  }

  // Function to show winners for a specific year
  function showWinnersForYear(year, standingsList) {
    // Clear any existing winners list
    const winnersList = document.getElementById('winners-list');
    winnersList.innerHTML = '';

    // Find the standings for the selected year
    const standings = standingsList.find(item => item.season === year);

    if (standings) {
      const championDriverId = standings.DriverStandings[0].Driver.driverId;

      // Create heading for the selected year
      const yearHeading = document.createElement('h2');
      yearHeading.textContent = `Showing results for ${year}`;
      winnersList.appendChild(yearHeading);

      // Fetch winners for the selected year
      fetch(`http://ergast.com/api/f1/${year}/results/1.json?limit=1000`)
        .then(response => response.json())
        .then(data => {
          const raceResults = data.MRData.RaceTable.Races;

          const winnersListItems = document.createElement('ul');
          winnersListItems.setAttribute('id', 'winners-list-items');

          raceResults.forEach(race => {
            const raceWinner = race.Results[0].Driver;

            const winnerItem = document.createElement('li');
            winnerItem.textContent = `${raceWinner.givenName} ${raceWinner.familyName}`;
            winnersListItems.appendChild(winnerItem);
          });

          winnersList.appendChild(winnersListItems);

          // Create back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.addEventListener('click', () => {
          // Remove the current winners list and back button
          winnersList.removeChild(yearHeading);
          winnersList.removeChild(winnersListItems);
          winnersList.removeChild(backButton);

          // Display the overall winners again
          displayWinners();
        });

          winnersList.appendChild(backButton);
        })
        .catch(error => console.log('An error occurred while fetching the race results data:', error));
    }
  }

  // Function to highlight the name of the winner wherever it appears in the list
  function highlightWinnerName(container) {
    const year = container.getAttribute('data-year');
    const winnerName = container.querySelector('span:last-child').textContent;

    const listItems = document.querySelectorAll('#winners-list-items li');

    listItems.forEach(item => {
      if (item.textContent === winnerName) {
        item.classList.add('winner-highlight');
      } else {
        item.classList.remove('winner-highlight');
      }
    });
  }

  // Call the function to fetch and display winners
  displayWinners();