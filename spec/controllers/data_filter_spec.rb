require 'rails_helper'

RSpec.describe Api::V1::DataFiltersController, type: :controller do
  describe "GET /api/v1/data_filter" do
    before :each do
      FactoryGirl.create_list(:activity, 5)
      FactoryGirl.create_list(:province, 10)
      activity_type = ActivityType.find(1)

      FactoryGirl.create_list(:activity_mode, 7, activity_type: activity_type)
      FactoryGirl.create_list(:sequence_item, 15)
      FactoryGirl.create_list(:sequence_voucher, 2)
    end

    context "data summary" do
      context "customer" do
        before :each do
          @user = FactoryGirl.create(:customer_user)
          token = FactoryGirl.create(:token, user: @user)
          request.headers["Authorization"] = "Bearer " + token.token

          get :data_summary
          @json = JSON.parse(response.body)
        end

        it { expect(response).to have_http_status(200) }

        it "has companies list" do
          expect(@json["companies"]).to eq(nil)
        end

        it "has activities list" do
          expect(@json["activities"].length).to eq(Activity.where(company: @user.company).count)
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

      context "admin" do
        before :each do
          token = FactoryGirl.create(:token)
          request.headers["Authorization"] = "Bearer " + token.token

          get :data_summary
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
    end
  end

  describe "POST /api/v1/data_filter" do
    before :each do
      @point_report = FactoryGirl.create(:report)
      @expense_report = FactoryGirl.create(:dummy_report, user: @point_report.user)
      FactoryGirl.create_list(:expense, 4, report: @point_report)
      FactoryGirl.create_list(:point_detail, 8, report: @expense_report)
    end

    context "admin" do
      before :each do
        token = FactoryGirl.create(:token, user: @point_report.user)
        request.headers["Authorization"] = "Bearer " + token.token
      end

      it {
        post :summary, { data: {} }
        expect(response).to have_http_status(200)
      }

      it "sends report list" do
        data = {
          company_id: 1,
          activity_id: 1,
          start_date: "2016-06-23",
          end_date: "2016-06-23"
        }

        post :summary, { data: data }
        @json = JSON.parse(response.body)
        expect(@json.length).to eq(1)
      end

      it "sends empty list" do
        data = {
          company_id: 1,
          activity_id: 1,
          start_date: "2016-06-24",
          end_date: "2016-06-26"
        }

        post :summary, { data: data }
        @json = JSON.parse(response.body)
        expect(@json.length).to eq(0)
      end
    end
  end
end