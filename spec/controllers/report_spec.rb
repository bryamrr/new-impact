require 'rails_helper'

RSpec.describe Api::V1::ReportsController, type: :controller do
  describe "GET /api/v1/reports" do
    before :each do
      role = FactoryGirl.create(:role, name: "supervisor")
      user = FactoryGirl.create(:user, role: role)

      FactoryGirl.create_list(:report, 10, user: user)

      other_role = FactoryGirl.create(:role, name: "admin")
      other_user = FactoryGirl.create(:user, role: other_role, nick_name: "kdelacruz")
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
      other_user = FactoryGirl.create(:user, role: other_role, nick_name: "kdelacruz")
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

  describe "POST /api/v1/reports" do
    context "with valid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: token.user)

        @data = {
          start_date: "2016-06-23",
          end_date: "2016-06-25",
          company_id: 1,
          activity_id: 1,
          province_id: 1,
          report_type_id: 1
        }
      end

      it { expect(response).to have_http_status(200) }

      it "creates report with correct data" do
        expect{
          post :create, { data: @data }
        }.to change(Report, :count).by(1)
      end

      it "sends the created report" do
        post :create, { data: @data }

        json = JSON.parse(response.body)
        expect(json["start_date"]).to eq("2016-06-23")
      end
    end

    context "with invalid token" do
      before :each do
        post :create
      end

      it { expect(response).to have_http_status(401) }
    end

    context "invalid params" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: token.user)

        @data = {
          start_date: "2016-06-23",
          end_date: "2016-06-25",
          activity_id: 1,
          province_id: 1,
          report_type_id: 1
        }

        post :create, { data: @data }
      end

      it { expect(response).to have_http_status(422) }

      it "sends the errors" do
        json = JSON.parse(response.body)
        expect(json["errors"]).to_not be_empty
      end
    end
  end

  describe "PATCH /api/v1/reports/:id" do
    context "with valid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: token.user)

        data = {
          start_date: "2016-06-21"
        }

        patch :update, id: "1", data: data
      end

      it { expect(response).to have_http_status(200) }

      it "update the report" do
        json = JSON.parse(response.body)
        expect(json["start_date"]).to eq("2016-06-21")
      end
    end

    context "with invalid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: FactoryGirl.create(:dummy_user))
      end

      it { expect(response).to have_http_status(200) }
    end
  end

  describe "DELETE /api/v1/reports/:id" do
    context "with valid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: token.user)
      end

      it {
        delete :destroy, id: "1"
        expect(response).to have_http_status(200)
      }

      it "delete the report" do
        expect {
          delete :destroy, id: "1"
        }.to change(Report, :count).by(-1)
      end
    end

    context "with invalid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.env["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: FactoryGirl.create(:dummy_user))
      end

      it { expect(response).to have_http_status(200) }
    end
  end
end