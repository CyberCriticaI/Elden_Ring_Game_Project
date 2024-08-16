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

  let player, genericBosses, currentGenericBossIndex, winCount;

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
    winCount = 0;
    
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

  const bossGifUrls = [
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec65c1fd-1931-4d12-b6c3-ac980aee2b6c/dgoplj9-8263b88c-a684-43d8-8af7-a076691382d0.gif', // Original
    'https://media1.giphy.com/media/OgngfuNtaHYOank9Y0/200w.gif', // Defeated state 1
    'https://forum.psnprofiles.com/uploads/monthly_2022_05/ezgif.com-gif-maker.thumb.gif.46aebc217a0a4b2d2c545cf0eca4b99e.gif', // Defeated state 2
    'https://i.redd.it/4r36ckw2dku81.gif',  // Defeated state 3
    'https://i.pinimg.com/originals/b6/53/65/b653652914cc23701ae57a21337ada44.gif',  // Defeated state 4
    'https://cdnb.artstation.com/p/assets/images/images/056/785/021/original/mathieu-chauderlot-3.gif?1670083651',  // Defeated state 5
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c899442e-c949-43a9-928d-2441ebbec9cc/dd1e6ra-41eaff95-ec9e-4446-bb22-97c35a2181ab.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M4OTk0NDJlLWM5NDktNDNhOS05MjhkLTI0NDFlYmJlYzljY1wvZGQxZTZyYS00MWVhZmY5NS1lYzllLTQ0NDYtYmIyMi05N2MzNWEyMTgxYWIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.gGRLk_0rlgm3QQAiRetI-JQmxLzlttrO2xsTCgO_cZk',  // Defeated state 6
    'https://i.redd.it/by6ufhmy34vb1.gif', // Defeated state 7
    'https://art.ngfiles.com/images/686000/686675_animotif_royal-crossbreed-priscilla-rpg-battlesprite.gif?f1543888442', // Defeated state 8
    'https://cdnb.artstation.com/p/assets/images/images/052/142/129/original/johan-cediel-rodriguez-crow.gif?1659037566' // Defeated state 9
  ];
  
  let currentGifIndex = 0; // Start with the original GIF
  
  
// Function adding game Log (adding a scroll to buttom for user) //

function logMessage(message) {
  const logDiv = document.getElementById('log');
  const p = document.createElement('p');
  p.textContent = message;
  logDiv.appendChild(p);
}


  
// function dealing with all of the attacks from player and enemies //

  function playerAttack() {
    const genericBoss = genericBosses[currentGenericBossIndex];
    const playerHit = player.attack(genericBoss);
    
    if (genericBoss.isAlive()) {
      if (!playerHit) {
        logMessage(`${genericBoss.name} retaliates while the player missed!`);
      } else {
        logMessage(`${genericBoss.name} is still standing and retaliates!`);
      }
    } else {
      logMessage(`${genericBoss.name} has been slain!`);
      winCount++;
      currentGenericBossIndex++;
      if (currentGenericBossIndex < genericBosses.length) {
        logMessage("... a new area boss has entered the vicinity...");
      } else {
        logMessage("You have defeated all the enemies in the area!");
      }
      updateStatus();
      changeBossGif(); 
      return; // End the turn early if the boss is slain //
    }
    
    endOfTurn();
  }

  function changeBossGif() {
    const enemyGif = document.getElementById('enemy-gif');
    currentGifIndex = (currentGifIndex + 1) % bossGifUrls.length;
    enemyGif.src = bossGifUrls[currentGifIndex];
  }
  
  function bossAttack() {
    const genericBoss = genericBosses[currentGenericBossIndex];
    if (genericBoss.attack(player)) {
      logMessage(`${genericBoss.name} strikes back!`);
    }
    
    if (!player.isAlive()) {
      logMessage("You have been slain... Game Over.");
      document.getElementById('attack-btn').disabled = true;
      document.getElementById('retreat-btn').disabled = true;
    }
    
    updateStatus();
  }
  
//     Boss hits back if it lives the players attack //


  function endOfTurn() {
    if (genericBosses[currentGenericBossIndex].isAlive()) {
      bossAttack();
    }
  }
  
// Function used for after killing all of the enemies //

  function handleAttack() {
    if (currentGenericBossIndex >= genericBosses.length) {
      logMessage("You have defeated all the enemies in the area!");
      return;
    }
    playerAttack();
  }

  // Music and volume controls (0 - 1) //

  const music = document.getElementById('background-music');
    music.volume = 0.04;
    // music.play();

    // comment out music when working due to music looping //
  
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