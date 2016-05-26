FactoryGirl.define do
  factory :activity do
    name "Campaña de prueba"
    association :activity_type, factory: :activity_type
    association :company, factory: :company
  end
end