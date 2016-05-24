require 'rails_helper'

RSpec.describe Comment, type: :model do
  it { should validate_presence_of(:for) }
  it { should validate_presence_of(:comment) }
end
