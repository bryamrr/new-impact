FactoryGirl.define do
  factory :role do
    name "Admin"
    factory :supervisore_role do
      name "Supervisor"
    end
    factory :customer_role do
      name "Customer"
    end
  end
end