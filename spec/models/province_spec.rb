require 'rails_helper'

RSpec.describe Province, type: :model do
  it { should validate_presence_of(:name) }
end
