require 'rails_helper'

RSpec.describe Report, type: :model do
  it { should validate_presence_of(:start_date) }
  it { should validate_presence_of(:end_date) }
  it { should validate_presence_of(:company) }
  it { should validate_presence_of(:user) }
  it { should validate_presence_of(:activity) }
  it { should validate_presence_of(:province) }
  it { should validate_presence_of(:report_type) }


end
