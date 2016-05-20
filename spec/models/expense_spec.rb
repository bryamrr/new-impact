require 'rails_helper'

RSpec.describe Expense, type: :model do
  it { should validate_presence_of(:total) }
  it { should validate_presence_of(:subtotal) }
end
