require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe "POST /api/v1/users" do
    it "should create user if nickname not exists" do
      token = FactoryGirl.create(:token)
      data = { nick_name: "bryamrrr", password: "123456", role: "admin", token: token.token}

      expect{
        post :create, { data: data }
      }.to change(User, :count).by(1)
    end

    it "should not create user if nickname exists" do
      token = FactoryGirl.create(:token)
      data = { nick_name: "bryamrr", password: "123456", role: "admin", token: token.token}

      expect{
        post :create, { data: data }
      }.to change(User, :count).by(0)
    end

    it "should not create user if user is not admin" do
      role = FactoryGirl.create(:role, name: "supervisor")
      user = FactoryGirl.create(:user, role: role)
      token = FactoryGirl.create(:token, user: user)
      FactoryGirl.create(:token)
      
      data = { nick_name: "bryamrrr", password: "123456", role: "admin", token: token.token}

      expect{
        post :create, { data: data }
      }.to change(User, :count).by(0)
    end

    it "responds with a message when user was created" do
      token = FactoryGirl.create(:token)
      data = { nick_name: "bryamrrr", password: "123456", role: "admin", token: token.token }

      post :create, { data: data }
      expect(response).to have_http_status(:created)
    end
  end
end