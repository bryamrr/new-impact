require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of(:nick_name) }
  it { should validate_uniqueness_of(:nick_name) }
  it { should validate_presence_of(:role) }
  it { should validate_presence_of(:password) }
  it { should_not allow_value("hello@hotmail").for(:email) }
  it { should allow_value("hello@hotmail.com").for(:email) }
  it { should_not allow_value("12345").for(:password) }
  it { should allow_value("123456").for(:password) }
  it { should_not allow_value("12345678901").for(:password) }

  it "should give access to user if nickname and password are correct" do
    user = FactoryGirl.create(:user)
    reponse = User.authenticate({nick_name: user.nick_name, password: user.password})
    expect(reponse).to eq(user)

  end

  it "should not give access to user if nickname are incorrect" do
    user = FactoryGirl.create(:user)
    response = User.authenticate({nick_name: user.nick_name, password: "1234567"})
    expect(response).to eq(false)
  end

  it "should not give access to user if password are incorrect" do
    user = FactoryGirl.create(:user)
    response = User.authenticate({nick_name: "bryamrrr", password: user.password})
    expect(response).to eq(false)
  end

  it "should not give access to user if nickname are null" do
    user = FactoryGirl.create(:user)
    response = User.authenticate({nick_name: nil, password: user.password})
    expect(response).to eq(false)
  end
end
