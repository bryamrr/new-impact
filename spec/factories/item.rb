FactoryGirl.define do
  factory :item do
    name "Vasos"
    factory :sequence_item do
      sequence(:name) { |n| "item#{n}" }
    end
  end
end