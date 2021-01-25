class EnemiesController < ApplicationController

    def create
        enemy = {
            name: Faker::Games::DnD.monster,
            image: "./assets/enemy#{Random.rand(1..6)}.png",
            health: Random.rand(7..20)
            }
        newEnemy = Enemy.create(enemy)
        render json: newEnemy
    end
end
