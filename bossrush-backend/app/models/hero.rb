class Hero < ApplicationRecord
    has_many :battles
    has_many :enemies, through: :battles

    def self.high_scores
        Hero.all.sort_by{|hero| -hero.score }.take(10)
    end
end
