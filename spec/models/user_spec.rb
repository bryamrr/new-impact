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

  it "should give access to user if nickname and password are correct" do
    FactoryGirl.create(:user)
    reponse = User.authenticate("bryamrr", "123456")
    expect(reponse).to eq(true)

  end

  it "should not give access to user if nickname or password are incorrect" do
    
  end

  it "should create user if nickname not exists" do

  end

  it "should not create user if nickname exists" do

  end  
end
