FactoryGirl.define do
  factory :role do
    name "admin"
    factory :supervisore_role do
      name "admin"
    end
    factory :customer_role do
      name "customer"
    end
  end
end