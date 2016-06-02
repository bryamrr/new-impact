require 'rails_helper'

RSpec.describe Api::V1::VouchersController, type: :controller do
  describe "GET /api/v1/vouchers" do
    before :each do
      FactoryGirl.create_list(:sequence_voucher, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :index
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends vouchers list" do
      json = JSON.parse(response.body)
      expect(json.length).to eq(Voucher.count)
    end
  end

  describe "GET /api/v1/vouchers/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_voucher, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "2"
    end

    it { expect(response).to have_http_status(:ok) }

    it "sends voucher selected" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq(Voucher.find(2)[:name])
    end
  end

  describe "PATCH /api/v1/vouchers/:id" do
    before :each do
      FactoryGirl.create_list(:sequence_voucher, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      data = {
        name: "Voucher nuevo"
      }

      patch :update, id: "1", data: data
    end

    it { expect(response).to have_http_status(200) }

    it "update the voucher" do
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Voucher nuevo")
    end
  end

  describe "POST /api/v1/vouchers" do
    before :each do
      FactoryGirl.create_list(:sequence_voucher, 2)
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      @data = {
        name: "Voucher nuevo"
      }
    end

    it "creates voucher" do
      expect{
        post :create, { data: @data }
      }.to change(Voucher, :count).by(1)
    end
  end

  describe "DELETE /api/v1/vouchers/:id" do
    before :each do
      token = FactoryGirl.create(:token)
      request.headers["Authorization"] = "Bearer " + token.token

      FactoryGirl.create(:voucher)
    end

    it {
      delete :destroy, id: "1"
      expect(response).to have_http_status(200)
    }

    it "delete the item" do
      expect {
        delete :destroy, id: "1"
      }.to change(Voucher, :count).by(-1)
    end
  end
end