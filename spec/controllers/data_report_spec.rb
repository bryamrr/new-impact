require 'rails_helper'

RSpec.describe Api::V1::DataReportsController, type: :controller do
  describe "GET /api/v1/data_report" do
    before :each do
      FactoryGirl.create_list(:activity, 5)
      FactoryGirl.create_list(:province, 10)
      activity_type = ActivityType.find(1)

      FactoryGirl.create_list(:activity_mode, 7, activity_type: activity_type)
      FactoryGirl.create_list(:sequence_item, 15)
      FactoryGirl.create_list(:sequence_voucher, 2)
    end

    context "point" do
      before :each do
        token = FactoryGirl.create(:token)
        request.headers["Authorization"] = "Bearer " + token.token

        get :point
        @json = JSON.parse(response.body)
      end

      it { expect(response).to have_http_status(200) }

      it "has companies list" do
        expect(@json["companies"].length).to eq(Company.count)
      end

      it "has activities list" do
        expect(@json["activities"].length).to eq(Activity.count)
      end

      it "has modes list" do
        expect(@json["modes"].length).to eq(ActivityMode.count)
      end

      it "has departments list" do
        expect(@json["departments"].length).to eq(Department.count)
      end

      it "has provinces list" do
        expect(@json["provinces"].length).to eq(Province.count)
      end

      it "hasn't items list" do
        expect(@json["items"]).to eq(nil)
      end
    end

    context "expense" do
      before :each do
        token = FactoryGirl.create(:token)
        request.headers["Authorization"] = "Bearer " + token.token

        get :expense
        @json = JSON.parse(response.body)
      end

      it { expect(response).to have_http_status(200) }

      it "has companies list" do
        expect(@json["companies"].length).to eq(Company.count)
      end

      it "has activities list" do
        expect(@json["activities"].length).to eq(Activity.count)
      end

      it "has departments list" do
        expect(@json["departments"].length).to eq(Department.count)
      end

      it "has provinces list" do
        expect(@json["provinces"].length).to eq(Province.count)
      end

      it "has items list" do
        expect(@json["items"].length).to eq(Item.count)
      end

      it "has vouchers list" do
        expect(@json["vouchers"].length).to eq(Voucher.count)
      end

      it "hasn't activity types list" do
        expect(@json["types"]).to eq(nil)
      end
    end
  end
end