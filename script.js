"use strict";
let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["палка"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "палка", power: 5 },
  { name: "лапата", power: 30 },
  { name: "молот", power: 50 },
  { name: "меч", power: 100 },
];
const monsters = [
  {
    name: "слизень",
    level: 2,
    health: 15,
  },
  {
    name: "чудовище",
    level: 8,
    health: 60,
  },
  {
    name: "дракон",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "городская площадь",
    "button text": ["В магазинчик", "В пещеру", "Сразится с драконом"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Вы на городской площади. Перед Вами табличка "СельМаг".',
  },
  {
    name: "сельмаг",
    "button text": [
      "Купить 10 здоровья (10 gold)",
      "Купить оружие (30 gold)",
      "Вернуться",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Вы зашли с сельМаг.",
  },
  {
    name: "пещера",
    "button text": ["Убить слизня", "Убить чудовище", "Вернуться"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Вы спустились в пещеру, где встретили парочку монстров .",
  },
  {
    name: "сразиться",
    "button text": ["Атаковать", "Уклониться", "Сбежать"],
    "button functions": [attack, dodge, goTown],
    text: "Вы сражаетесь с монстром.",
  },
  {
    name: "убить монстра",
    "button text": ["Вернуться", "Вернуться", "Вернуться"],
    "button functions": [goTown, goTown, easterEgg],
    text: "Монстр испустил дух. Вы заработали очки опыта и баблишко.",
  },
  {
    name: "проиграть",
    "button text": ["Сыграть снова?", "Сыграть снова?", "Сыграть снова?"],
    "button functions": [restart, restart, restart],
    text: "Да Вы покойник. &#x2620;",
  },
  {
    name: "выйграть",
    "button text": ["Сыграть снова?", "Сыграть снова?", "Сыграть снова?"],
    "button functions": [restart, restart, restart],
    text: "Вы убили дракона! Вы выйграли! &#x1F389;",
  },
  {
    name: "пасхалка",
    "button text": ["2", "8", "Вернуться на городскую площадь"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Вы нашли секретную комнату. Выберите одно из двух чисел сверху. Запустится генератор случайных чисел. Если выбранное Вами число совпадет, Вы выйграли",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "У вас недостаточно денег, чтобы купить здоровье.";
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerText = "У вас теперь " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " В вашем инвентаре: " + inventory;
    } else {
      text.innerText = "У вас недостаточно денег, чтобы купить оружие.";
    }
  } else {
    text.innerText = "У Вас уже самое мощное оружие!";
    button2.innerText = "Продать за 15 золотых?";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Вы продали " + currentWeapon + ".";
    text.innerText += " У вас в инвенторе: " + inventory;
  } else {
    text.innerText = "Не стоит продовать единственное оружие!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = monsters[fighting].name + " атакует.";
  text.innerText +=
    " Вы атаковали с использованием оружия " +
    weapons[currentWeaponIndex].name +
    ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Вы промахнулись.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText +=
      " Ваше оружие " + inventory.pop() + " сломалось. Печалька";
    currentWeaponIndex--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText =
    "Вы уклонились от атаки монстра типа " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["палка"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Вы выбрали " + guess + ". Вот случайные числа:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "ДА!!! Вы выйграли 20 золотых!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Увы! вы потеряли 10 пунктов здоровья!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
