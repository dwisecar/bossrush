class HerosController < ApplicationController

    def index
        heros = Hero.all
        render json: heros
    end

    def high_scores
        high_scores = Hero.high_scores
        render json: high_scores
    end

    def show 
        hero = hero.find(params[:id])
        render json: hero
    end

    def create
        hero = {
            name: params["name"],
            melee_attack: params["meleeAttack"],
            ranged_attack: params["rangedAttack"],
            image: params["image"],
            health: 100,
            score: 0
        }
        newHero = Hero.create(hero)
        render json: newHero
    end

    def update
        hero = Hero.find(params[:id])
        hero.update(score: params[:score])
    end
end
