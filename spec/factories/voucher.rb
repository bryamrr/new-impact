FactoryGirl.define do
  factory :voucher do
    name "Boleta"
    factory :sequence_voucher do
      sequence(:name) { |n| "voucher#{n}" }
    end
  end
end