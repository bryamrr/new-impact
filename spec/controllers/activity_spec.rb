require 'rails_helper'

RSpec.describe Api::V1::ActivitiesController, type: :controller do
  describe "GET /api/v1/activities" do
    before :each do
      FactoryGirl.create_list(:sequence_activity, 2)
    end

    it "sends activities list if user is admin" do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :index

      json = JSON.parse(response.body)
      expect(json.length).to eq(Activity.count)
    end

    it "sends zero activities if user isn't admin" do
      user = FactoryGirl.create(:customer_user)
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token
      get :index

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/v1/activities/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_activity, 2)
    end

    it "sends cactivity selected if user is admin" do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "2"

      json = JSON.parse(response.body)
      expect(json["name"]).to eq(Activity.find(2)[:name])
    end

    it "sends not found if user isn't admin" do
      user = FactoryGirl.create(:customer_user)
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "2"

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /api/v1/activities/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_activity, 2)
    end

    it "update the activity if user is admin" do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      data = {
        name: "Actividad nueva"
      }

      patch :update, id: "1", data: data

      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Actividad nueva")
    end

    it "return not found if user is not admin" do
      user = FactoryGirl.create(:customer_user)
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token

      data = {
        name: "Actividad nueva"
      }

      patch :update, id: "1", data: data

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/activities" do
    before :each do
      FactoryGirl.create_list(:sequence_activity, 2)
    end

    it "creates activity if user is admin" do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      @data = {
        name: "Actividad nueva",
        company_id: 1,
        activity_type_id: 1
      }

      expect{
        post :create, { data: @data }
      }.to change(Activity, :count).by(1)
    end

    it "creates activity if user isn't admin" do
      user = FactoryGirl.create(:customer_user)
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token

      @data = {
        name: "Actividad nueva",
        company_id: 1,
        activity_type_id: 1
      }

      post :create, { data: @data }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /api/v1/activities/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_activity, 2)
    end

    it "delete the activity if user is admin" do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      expect {
        delete :destroy, id: "1"
      }.to change(Activity, :count).by(-1)
    end

    it "return unauthorized" do
      user = FactoryGirl.create(:customer_user)
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token

      delete :destroy, id: "1"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end