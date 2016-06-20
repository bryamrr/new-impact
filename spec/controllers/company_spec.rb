require 'rails_helper'

RSpec.describe Api::V1::CompaniesController, type: :controller do
  describe "GET /api/v1/companies" do
    before :each do
      FactoryGirl.create_list(:sequence_company, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :index
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends companies list" do
      json = JSON.parse(response.body)
      expect(json.length).to eq(Company.count)
    end
  end

  describe "GET /api/v1/companies/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_company, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "2"
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends company selected" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq(Company.find(2)[:name])
    end
  end

  describe "PATCH /api/v1/companies/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_company, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      data = {
        name: "Compañía nueva"
      }

      patch :update, id: "1", data: data
    end

    it { expect(response).to have_http_status(200) }

    it "update the company" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Compañía nueva")
    end
  end

  describe "POST /api/v1/companies" do
    before :each do
      FactoryGirl.create_list(:sequence_company, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      @data = {
        name: "Compañía nueva"
      }
    end

    it "creates company" do
      expect{
        post :create, { data: @data }
      }.to change(Company, :count).by(1)
    end
  end

  describe "DELETE /api/v1/companies/:id" do
    before :each do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      FactoryGirl.create(:company)
    end

    it {
      delete :destroy, id: "1"
      expect(response).to have_http_status(200)
    }

    it "delete the company" do
      expect {
        delete :destroy, id: "1"
      }.to change(Company, :count).by(-1)
    end
  end
end