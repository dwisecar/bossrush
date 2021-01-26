//sequence
//1. enemy dies
//2. enemy name change patch
//3. update hero score (enemy health * 100) + hero.score
//4. fetch battle won
//5. load new enemy

//DATA

function handleEnemyDeath(){
    Promise.all([updateEnemyName(), updateHeroScore(), fetchBattleWon(), fetchEnemy()])
}

let heroTurn = true 
// gets users with highest scores
function fetchHighScores(){
    fetch('http://localhost:3000/high_scores')
    .then(res => res.json())
    .then(heros => heros.forEach(hero => addHighScore(hero)))
}

//on form submission, posts new hero to database and calls fetch enemy
function postHero(hero){
    fetch('http://localhost:3000/heros', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(hero)
    })
    .then(res => res.json())
    .then(hero => {
        renderBattleHeroCard(hero)
        fetchEnemy()
    })
}

//posts new enemy generated with faker data in enemies controller
function fetchEnemy() {    
    const enemy = document.querySelector('.enemy-card')
    if(enemy){
        enemy.remove()
    }   

    fetch('http://localhost:3000/enemies', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        }
    }).then(res => res.json())
    .then(enemy => {
        renderEnemy(enemy)
        postBattle()
    })
}

//runs after enemy card is rendered, posts record of battle
function postBattle(){
    const hero = document.querySelector('.hero-card') 
    const heroId = parseInt(hero.dataset.id)
    const enemy = document.querySelector('.enemy-card') 
    const enemyId = parseInt(enemy.dataset.id)
    fetch('http://localhost:3000/battles', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            hero: heroId,
            enemy: enemyId
        })
    }).then(console.log("Battle created"))
}


//patch to the hero score attribute
function updateHeroScore(){
    const heroCard = document.querySelector('.hero-card')
    const heroId = parseInt(heroCard.dataset.id)
    fetch(`http://localhost:3000/heros/${heroId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            id: heroId,
            score: 100
        })
    }).then(res => res.json())
    .then(hero => {
        renderCurrentScore(hero.score)
        fetchBattleWon()})
}

//changes enemy name to defeated
function updateEnemyName(){
    const enemyCard = document.querySelector('.enemy-card')
    const enemyId = parseInt(enemyCard.dataset.id)
    const enemyName = document.getElementById('enemy-name')
    enemyName.innerText += ' Defeated'
    fetch(`http://localhost:3000/enemies/${enemyId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            id: enemyId,
            name: enemyName.innerText
        })
    }).then(() => {
        console.log(`updated enemy name`)
        raiseEnemyDefeatedToast()
    })

}

//takes most recent battle won and puts it in the sidebar
function fetchBattleWon(){
    //get hero id
    const heroCard = document.querySelector('.hero-card')
    const heroId = parseInt(heroCard.dataset.id)
    //fetch last battle hero won
    fetch(`http://localhost:3000/heros/${heroId}`)
    .then(res => res.json())
    .then(battle => {
        console.log(battle.enemy.name)
        updateDefeatedEnemiesList(battle)})
}

//DOM
function addListenerHeroForm(){
    const form = document.querySelector('form')
    form.addEventListener('submit', createHero)  
}

function renderBattleHeroCard(hero){
    const main = document.querySelector('main')
    const div = document.createElement('div')
    div.className = 'hero-card'
    div.dataset.id = hero.id
    
    const img = document.createElement('img')
    img.src = hero.image
    const heroName = document.createElement('p')
    heroName.innerText = hero.name
    
    const health = document.createElement('p')
    health.innerText = `Health: ${hero.health}`
    health.id = 'hero-health'
    
    const meleeBtn = document.createElement('button')
    meleeBtn.innerText = `${hero.melee_attack} Attack`
    meleeBtn.id = 'melee-attack-btn'
    meleeBtn.addEventListener('click', checkOkToAttack)
    
    const rangedBtn = document.createElement('button')
    rangedBtn.innerText = `${hero.ranged_attack} Attack`
    rangedBtn.id = 'ranged-attack-btn'
    rangedBtn.addEventListener('click', checkOkToAttack)
    
    div.append(heroName, img, health, meleeBtn, rangedBtn)
    main.append(div)

    const score = document.querySelector('.current-score')
    score.innerText = hero.score
}

function renderEnemy(enemy){
    const main = document.querySelector('main')
    const div = document.createElement('div')
    div.className = 'enemy-card'
    div.dataset.id = enemy.id
    const img = document.createElement('img')
    img.src = enemy.image
    const name = document.createElement('p')
    name.innerText = enemy.name
    name.id = 'enemy-name'
    const health = document.createElement('p')
    health.innerText = `Health: ${enemy.health}`
    health.id = 'enemy-health'
    div.append(name, img, health)
    main.append(div) 

    changeHeaderString('BOSS RUSH')
    enableAttackButtons() 
}

function updateDefeatedEnemiesList(battle){
    const ul = document.querySelector('.enemies-defeated')
    const li = document.createElement('li')
    
    li.innerText = battle.enemy.name
    const img = document.createElement('img')
    img.src = battle.enemy.image
    li.append(img)
    ul.append(li)
    setTimeout(fetchEnemy, 1000)
}

function addHighScore(hero){
    const ul = document.querySelector('.high-scores')
    const li = document.createElement('li')
    li.innerText = `${hero.name}: ${hero.score}`
    ul.append(li)
}

function renderCurrentScore(points){
    const score = document.querySelector('.current-score')
    let newScore = parseInt(score.innerText) + points
    score.innerText = newScore
}

function raiseEnemyDefeatedToast(){
    changeHeaderString('Enemy Defeated')
    setTimeout(updateHeroScore, 2000)
    //graphical indication that enemy has been defeated
}

function disableAttackButtons(){
    const btnA = document.getElementById('melee-attack-btn')
    const btnB = document.getElementById('ranged-attack-btn')
    btnA.disabled = true
    btnB.disabled = true
}

function enableAttackButtons(){
    const btnA = document.getElementById('melee-attack-btn')
    const btnB = document.getElementById('ranged-attack-btn')
    btnA.disabled = false
    btnB.disabled = false
}

function changeHeaderString(string){
    const h2 = document.getElementById('header-text')
    h2.innerText = string
}


function clearMain(){
    const main = document.querySelector('main')
    while (main.firstElementChild) {
        main.firstElementChild.remove()
    }
}

function myFunction() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

//HANDLERS
function createHero(e){
    e.preventDefault()
    hero = {
        name: e.target['hero-name'].value,
        meleeAttack: e.target['melee-weapon'].value,
        rangedAttack: e.target['ranged-weapon'].value,
        image: './assets/Soldier.png'
    }
    disableCreateHeroForm()
    postHero(hero)
}

function disableCreateHeroForm(){
    const form = document.querySelector('.create-hero')
    form.remove()
}

function checkOkToAttack(e){    
    if (heroTurn){
        let damage = 0
        if(e.target.id == 'melee-attack-btn') {
            damage = Math.floor(Math.random() * (4 + 1)) + 3; //random between 7-3
        } else {
            damage = Math.floor(Math.random() * (11 + 1)) + 1; //random between 12-1
        }
        let enemy = document.getElementById('enemy-health')
        let enemyHealth = parseInt(enemy.innerText.split(' ')[1])
        
        if(enemyHealth - damage < 1) {
            enemy.innerText = 'Health: 0'
            disableAttackButtons()
            updateEnemyName()
        }
        else{ 
            enemy.innerText = `Health: ${enemyHealth - damage}`
        }
        
        //function to disable hero attack buttons
        //function to start enemy attacking

    } else {
        return
    }

}


addListenerHeroForm()
fetchHighScores()