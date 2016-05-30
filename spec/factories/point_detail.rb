FactoryGirl.define do
  factory :point_detail do
    point "Grifo XQR"
    start_time "2016-06-25 11:12:13"
    end_time "2016-06-26 11:12:13"
    scope 10000
    sales 10000
    people 10000
    product "Agua cielo"
    association :report, factory: :report
    association :activity_mode, factory: :activity_mode
  end
end