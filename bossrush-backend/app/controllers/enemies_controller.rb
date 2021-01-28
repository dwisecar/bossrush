class EnemiesController < ApplicationController

    def show
        enemy = Enemy.find(params[:id])
        render json: enemy
    end
    
    def create
        
        if params[:counter] % 4 == 0 && params[:counter] != 0
            enemy = {
                name: "BOSS: #{Faker::Games::DnD.monster}",
                image: "./assets/boss#{Random.rand(1..4)}.png",
                health: Random.rand(17..22)
            }
            counter = 0
        else
            enemy = {
                name: Faker::Games::DnD.monster,
                image: "./assets/enemy#{Random.rand(1..12)}.png",
                health: Random.rand(7..20)
            }
        end
    
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
