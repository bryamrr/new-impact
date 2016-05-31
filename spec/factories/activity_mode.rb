FactoryGirl.define do
  factory :activity_mode do
    name "Volanteo"
    association :activity_type, factory: :activity_type
  end
end