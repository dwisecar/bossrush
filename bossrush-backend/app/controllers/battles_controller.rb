class BattlesController < ApplicationController

    def create
        battle = {
            hero_id: params["hero"],
            enemy_id: params["enemy"]
        }
        newBattle = Battle.create(battle)
        render json: newBattle
    end
end
