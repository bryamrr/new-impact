require 'rails_helper'

RSpec.describe Api::V1::ItemsController, type: :controller do
  describe "GET /api/v1/items" do
    before :each do
      FactoryGirl.create_list(:sequence_item, 2)
      token = FactoryGirl.create(:token)
      request.env["Authorization"] = "Bearer " + token.token
      get :index
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends items list" do
      json = JSON.parse(response.body)
      expect(json.length).to eq(Item.count)
    end
  end

  describe "GET /api/v1/items/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_item, 2)
      token = FactoryGirl.create(:token)
      request.env["Authorization"] = "Bearer " + token.token
      get :show, id: "2"
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends item selected" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq(Item.find(2)[:name])
    end
  end

  describe "PATCH /api/v1/reports/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_item, 2)
      token = FactoryGirl.create(:token)
      request.env["Authorization"] = "Bearer " + token.token

      data = {
        name: "Item nuevo"
      }

      patch :update, id: "1", data: data
    end

    it { expect(response).to have_http_status(200) }

    it "update the item" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Item nuevo")
    end
  end

  describe "POST /api/v1/reports" do
    before :each do
      FactoryGirl.create_list(:sequence_item, 2)
      token = FactoryGirl.create(:token)
      request.env["Authorization"] = "Bearer " + token.token

      @data = {
        name: "Item nuevo"
      }
    end

    it "creates item" do
      expect{
        post :create, { data: @data }
      }.to change(Item, :count).by(1)
    end
  end

  describe "DELETE /api/v1/reports/:id" do
    before :each do
      token = FactoryGirl.create(:token)
      request.env["Authorization"] = "Bearer " + token.token

      FactoryGirl.create(:item)
    end

    it {
      delete :destroy, id: "1"
      expect(response).to have_http_status(200)
    }

    it "delete the item" do
      expect {
        delete :destroy, id: "1"
      }.to change(Item, :count).by(-1)
    end
  end
end