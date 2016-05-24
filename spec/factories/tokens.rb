FactoryGirl.define do
  factory :token do
    association :user, factory: :user
  end
end