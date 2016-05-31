FactoryGirl.define do
  factory :expense do
    comment "Comentario"
    subtotal 23.5
    total 23.5
    association :item, factory: :item
    association :voucher, factory: :voucher
    association :report, factory: :report
  end
end