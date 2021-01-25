# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'


# Hero.delete_all
# MeleeAttack.delete_all
# RangedAttack.delete_all


# 10.times do
#     Hero.create({
#         name: Faker::Name.first_name,  
#         image: 'https://cdn1.vectorstock.com/i/1000x1000/22/10/pixel-art-hero-vector-19072210.jpg',
#         health: 100
#     })
# end

10.times do
    Enemy.create({
        name: Faker::Games::DnD.monster,
        image: 'https://img.favpng.com/13/24/8/pixel-art-monster-ooze-png-favpng-YUnYXWtAYRXXbcdyk02s4HSfH.jpg',
        health: Random.rand(7..20)
    })
end
