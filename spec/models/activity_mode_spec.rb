require 'rails_helper'

RSpec.describe ActivityMode, type: :model do
  it { should validate_presence_of(:name) }
end
