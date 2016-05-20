require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of(:nick_name) }
  it { should validate_presence_of(:role) }
  it { should validate_presence_of(:password) }
  it { should_not allow_value("hello@hotmail").for(:email) }
  it { should allow_value("hello@hotmail.com").for(:email) }
  it { should_not allow_value("12345").for(:password) }
  it { should allow_value("123456").for(:password) }
  it { should_not allow_value("12345678901").for(:password) }
end
