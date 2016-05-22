FactoryGirl.define do
  factory :user do
    nick_name "bryamrr"
    password "123456"
    association :role, factory: :role
  end
end