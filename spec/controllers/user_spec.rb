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

  describe "POST /api/v1/users/login" do
    it "should not grant access if nickname not exists" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrrr", password: "123456" }

      post :login, { data: data }
      expect(response).to have_http_status(:unauthorized)
    end
    it "should not grant access if password is incorrect" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "1234567" }

      post :login, { data: data }
      expect(response).to have_http_status(:unauthorized)
    end
    it "should grant access if credentials are correct" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "123456" }

      post :login, { data: data }
      expect(response).to have_http_status(:ok)
    end
    it "should return a valid token if credentials are correct" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "123456" }

      post :login, { data: data }
      json = JSON.parse(response.body)
      token_str = json["token"]

      token = Token.find_by(token: token_str)
      expect(token.is_valid?).to eq(true)
    end
    it "should return nickname if credentials are correct" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "123456" }

      post :login, { data: data }
      json = JSON.parse(response.body)

      expect(json["nick_name"]).to eq("bryamrr")
    end
    it "should return role if credentials are correct" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "123456" }

      post :login, { data: data }
      json = JSON.parse(response.body)

      expect(json["role"]).to eq("admin")
    end
  end

  describe "POST /api/v1/users/logout" do
    it "should expire token" do
      user = FactoryGirl.create(:user)
      data = { nick_name: "bryamrr", password: "123456" }

      post :login, { data: data }
      json = JSON.parse(response.body)
      token_str = json["token"]

      data = { token: token_str }
      post :logout, { data: data }

      expect(Token.exists?(token: token_str)).to eq(false)
    end
  end
end