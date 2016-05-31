FactoryGirl.define do
  factory :company do
    name "Compañía de prueba"
    factory :sequence_company do
      sequence(:name) { |n| "company#{n}" }
    end
  end
end