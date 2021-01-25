class BattlesController < ApplicationController

    def create
        battle = {
            hero_id: params["hero"],
            enemy_id: params["enemy"]
        }
        Battle.create(battle)
    end
end
