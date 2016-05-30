FactoryGirl.define do
  factory :user do
    nick_name "bryamrr"
    password "123456"
    association :role, factory: :role
    factory :dummy_user do
      nick_name "dummy"
      password "123456"
      association :role, factory: :role
    end
    factory :sequence_user do
      sequence(:nick_name) { |n| "person#{n}" }
      password "123456"
      association :role, factory: :supervisor_role
    end
  end
end