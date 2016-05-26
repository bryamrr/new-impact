require 'rails_helper'

RSpec.describe Api::V1::ReportsController, type: :controller do
  describe "GET /api/v1/reports" do
    before :each do
      FactoryGirl.create_list(:report, 10)
      get :index
    end

    it { have_http_status(200) }

    it "sends report list" do
      json = JSON.parse(response.body)
      expect(json.length).to eq(Report.count)
    end
  end

  describe "GET /api/v1/reports/:id" do
  end
end