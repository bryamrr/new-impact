require 'rails_helper'

RSpec.describe Voucher, type: :model do
  it { should validate_presence_of(:name) }
end
