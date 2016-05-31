FactoryGirl.define do
  factory :report do
    start_date "2016-06-23"
    end_date "2016-06-23"
    association :company, factory: :company
    association :user, factory: :user
    association :activity, factory: :activity
    association :province, factory: :province
    association :report_type, factory: :report_type
    factory :dummy_report do
      start_date "2016-06-25"
      end_date "2016-06-26"
      association :company, factory: :company
      association :user, factory: :user
      association :activity, factory: :activity
      association :province, factory: :province
      association :report_type, factory: :report_type_expense
    end
  end
end