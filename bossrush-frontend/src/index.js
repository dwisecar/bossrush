//DATA

let heroTurn = true 

function fetchHighScores(){
    fetch('http://localhost:3000/high_scores')
    .then(res => res.json())
    .then(heros => heros.forEach(hero => addHighScore(hero)))
}

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

function postBattle(heroId, enemyId){
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
    })
}

function fetchEnemy() {
    fetch('http://localhost:3000/enemies', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify()
    }).then(res => res.json())
    .then(enemy => renderEnemy(enemy))
}

function updateHeroScore(heroId, newScore){
    fetch(`http://localhost:3000/heros/${heroId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            id: heroId,
            score: newScore
        })
    }).then()
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
    const health = document.createElement('p')
    health.innerText = `Health: ${enemy.health}`
    health.id = 'enemy-health'
    div.append(name, img, health)
    main.append(div)

    const hero = document.querySelector('.hero-card')    
    postBattle(parseInt(hero.dataset.id), enemy.id)
}

function killEnemy(){
    const enemy = document.querySelector('.enemy-card')
    enemy.remove()
    //add function to update enemy name to -defeated
    //add battle.enemy to sidebar
    fetchEnemy()
}

function addHighScore(hero){
    const ul = document.querySelector('.high-scores')
    const li = document.createElement('li')
    li.innerText = `${hero.name}: ${hero.score}`
    ul.append(li)
}

function updateScore(points){
    const score = document.querySelector('.current-score')
    let newScore = parseInt(score.innerText) + points
    score.innerText = newScore
    const hero = document.querySelector('.hero-card')
    updateHeroScore(parseInt(hero.dataset.id), newScore)
}


function clearMain(){
    const main = document.querySelector('main')
    while (main.firstElementChild) {
        main.firstElementChild.remove()
    }
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
            killEnemy()
        }
        else{ 
            enemy.innerText = `Health: ${enemyHealth - damage}`
        }
        updateScore((damage * 100))
        //function to disable hero attack buttons
        //function to start enemy attacking

    } else {
        return
    }

}


addListenerHeroForm()
fetchHighScores()