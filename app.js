class Player {
    constructor(name, HP, firepower, accuracy) {
      this.name = name;
      this.HP = HP;
      this.firepower = firepower;
      this.accuracy = accuracy;
    }
  
    isAlive() {
      return this.HP > 0;
    }
  
    takeDamage(damage) {
      this.HP -= damage;
      if (this.HP < 0) this.HP = 0;
    }
  
    attack(defender) {
      if (Math.random() < this.accuracy) {
        logMessage(`${this.name} hits ${defender.name}!`);
        defender.takeDamage(this.firepower);
        return true;
      } else {
        logMessage(`${this.name} misses ${defender.name}.`);
        return false;
      }
    }
  }

  let player, genericBosses, currentGenericBossIndex;

  function initializeGame() {
    player = new Player("Player", 20, 5, 0.7);
    genericBosses = Array.from({ length: 6 }, (_, i) => {
      return new Player(
        `Generic Boss ${i + 1}`,
        Math.floor(Math.random() * 4) + 3, // HP between 3 and 6
        Math.floor(Math.random() * 3) + 2, // Firepower between 2 and 4
        Math.random() * 0.2 + 0.6 // Accuracy between 0.6 and 0.8
      );
    });
    currentGenericBossIndex = 0;
    
    document.getElementById('log').innerHTML = '';
    updateStatus();
  
    // Enable buttons
    document.getElementById('attack-btn').disabled = false;
    document.getElementById('retreat-btn').disabled = false;
  }
  
  function updateStatus() {
    document.getElementById('player-status').textContent = `Player: ${player.HP} HP`;
    if (currentGenericBossIndex < genericBosses.length) {
      const genericBoss = genericBosses[currentGenericBossIndex];
      document.getElementById('generic-boss-status').textContent = `${genericBoss.name}: ${genericBoss.HP} HP`;
    } else {
      document.getElementById('generic-boss-status').textContent = 'No more enemies.';
    } 
    const remainingEnemies = genericBosses.length - currentGenericBossIndex;
    document.getElementById('remaining-enemies').textContent = `Remaining Enemies: ${remainingEnemies}`;
    document.getElementById('win-count').textContent = `Wins: ${winCount}`;
  }
  
  function logMessage(message) {
    const logDiv = document.getElementById('log');
    const p = document.createElement('p');
    p.textContent = message;
    logDiv.appendChild(p);
  }
  
  function handleAttack() {
    if (currentGenericBossIndex >= genericBosses.length) {
      logMessage("You have defeated all the enemies in the area!");
      return;
    }
  
    const genericBoss = genericBosses[currentGenericBossIndex];
  
    if (player.attack(genericBoss)) {
      if (genericBoss.isAlive()) {
        if (!genericBoss.attack(player)) {
          if (!player.isAlive()) {
            logMessage("You have been slain... Game Over.");
            document.getElementById('attack-btn').disabled = true;
            document.getElementById('retreat-btn').disabled = true;
            return;
          }
        } else {
          logMessage(`${genericBoss.name} strikes back!`);
        }
      } else {
        logMessage(`${genericBoss.name} has been slain!`);
        currentGenericBossIndex++;
        if (currentGenericBossIndex < genericBosses.length) {
          logMessage("... a new area boss has entered the vicinity...");
        } else {
          logMessage("You have defeated all the enemies in the area!");
        }
      }
    }
  
    updateStatus();
  }

  

  // Music and volume controls (0 - 1)

  const music = document.getElementById('background-music');
    music.volume = 0.04;
    // music.play();

    // comment out music when working due to music looping
  
  function handleRetreat() {
    logMessage("You chose to retreat. Game Over.");
    document.getElementById('attack-btn').disabled = true;
    document.getElementById('retreat-btn').disabled = true;
  }

  function handleReset() {
    initializeGame();
  }
  
  document.getElementById('attack-btn').addEventListener('click', handleAttack);
  document.getElementById('retreat-btn').addEventListener('click', handleRetreat);
  document.getElementById('reset-btn').addEventListener('click', handleReset);
  
  initializeGame();