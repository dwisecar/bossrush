class EnemiesController < ApplicationController

    def show
        enemy = Enemy.find(params[:id])
        render json: enemy
    end
    
    def create
        enemy = {
            name: Faker::Games::DnD.monster,
            image: "./assets/enemy#{Random.rand(1..14)}.png",
            health: Random.rand(7..20)
            }
        newEnemy = Enemy.create(enemy)
        render json: newEnemy
    end

    def update
        enemy = Enemy.find(params[:id])       
        enemy.update(enemy_params)     
    end

    private

    def enemy_params
        params.require(:enemy).permit(:name, :image, :health)
    end
end
