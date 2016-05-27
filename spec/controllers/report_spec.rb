require 'rails_helper'

RSpec.describe Api::V1::ReportsController, type: :controller do
  describe "GET /api/v1/reports" do
    before :each do
      role = FactoryGirl.create(:role, name: "supervisor")
      user = FactoryGirl.create(:user, role: role)

      FactoryGirl.create_list(:report, 10, user: user)

      other_role = FactoryGirl.create(:role, name: "admin")
      other_user = FactoryGirl.create(:user, role: other_role)
      FactoryGirl.create_list(:report, 3, user: other_user)
    end

    it "sends report list if user is admin" do
      other_user = User.last
      other_token = FactoryGirl.create(:token, user: other_user)

      request.env["Authorization"] = "Bearer " + other_token.token
      get :index

      json = JSON.parse(response.body)
      expect(json.length).to eq(Report.count)
    end

    it "sends report list created by the user if isn't admin" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.env["Authorization"] = "Bearer " + token.token
      get :index

      json = JSON.parse(response.body)
      expect(json.length).to eq(Report.where(user: user).count)
    end
  end

  describe "GET /api/v1/reports/:id" do
    before :each do
      role = FactoryGirl.create(:role, name: "supervisor")
      user = FactoryGirl.create(:user, role: role)

      FactoryGirl.create_list(:report, 10, user: user)

      other_role = FactoryGirl.create(:role, name: "admin")
      other_user = FactoryGirl.create(:user, role: other_role)
      FactoryGirl.create_list(:report, 3, user: other_user)
    end

    it "should send report if user is admin" do
      other_user = User.last
      other_token = FactoryGirl.create(:token, user: other_user)

      request.env["Authorization"] = "Bearer " + other_token.token
      get :show, id: "12"

      json = JSON.parse(response.body)

      expect(json.keys).to include("id", "start_date", "end_date", "company_id", "user_id", "activity_id", "province_id", "report_type_id")
    end

    it "should not send report if user isn't admin and report don't belong to him" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.env["Authorization"] = "Bearer " + token.token
      get :show, id: "12"

      expect(response).to have_http_status(:not_found)
    end

    it "should send report if user isn't adnmin but report belong to him" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.env["Authorization"] = "Bearer " + token.token
      get :show, id: "1"

      json = JSON.parse(response.body)

      expect(json.keys).to include("id", "start_date", "end_date", "company_id", "user_id", "activity_id", "province_id", "report_type_id")
    end
  end
end