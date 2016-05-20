require 'rails_helper'

RSpec.describe PointDetail, type: :model do
  it { should validate_presence_of(:point) }
  it { should validate_presence_of(:start_time) }
  it { should validate_presence_of(:end_time) }
end
