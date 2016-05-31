FactoryGirl.define do
  factory :province do
    name "Ica"
    association :department, factory: :department
  end
end