FactoryGirl.define do
  factory :token do
    expires_at "2015-02-28 19:14:47"
    association :user, factory: :user
  end
end