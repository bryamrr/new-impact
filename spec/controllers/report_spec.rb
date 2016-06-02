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

      request.headers["Authorization"] = "Bearer " + other_token.token
      get :index

      json = JSON.parse(response.body)
      expect(json.length).to eq(Report.count)
    end

    it "sends report list created by the user if isn't admin" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token
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

      request.headers["Authorization"] = "Bearer " + other_token.token
      get :show, id: "12"

      json = JSON.parse(response.body)

      expect(json.keys).to include("id", "start_date", "end_date", "company_id", "user_id", "activity_id", "province_id", "report_type_id")
    end

    it "should not send report if user isn't admin and report don't belong to him" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "12"

      expect(response).to have_http_status(:not_found)
    end

    it "should send report if user isn't adnmin but report belong to him" do
      user = User.first
      token = FactoryGirl.create(:token, user: user)
      request.headers["Authorization"] = "Bearer " + token.token
      get :show, id: "1"

      json = JSON.parse(response.body)

      expect(json.keys).to include("id", "start_date", "end_date", "company_id", "user_id", "activity_id", "province_id", "report_type_id")
    end
  end

  describe "POST /api/v1/reports" do
    context "with valid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.headers["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: token.user)
        FactoryGirl.create(:report_type)
        FactoryGirl.create(:report_type_expense)
        FactoryGirl.create_list(:item, 2)
        FactoryGirl.create_list(:voucher, 2)
        FactoryGirl.create_list(:quantity_type, 2)
        FactoryGirl.create_list(:comment_type, 2)
        FactoryGirl.create(:activity_mode)
      end

      context "expense" do
        before :each do
          @data_expense = {
            company_id: 1,
            activity_id: 1,
            province_id: 1,
            report_type_id: 2,
            expenses: []
          }

          hash1 = {
            item_id: 1,
            voucher_id: 1,
            comment: "comentario de prueba 1",
            subtotal: 13.50
          }

          hash2 = {
            item_id: 2,
            voucher_id: 2,
            comment: "comentario de prueba 2",
            subtotal: 16.50
          }

          @data_expense[:expenses].push(hash1)
          @data_expense[:expenses].push(hash2)
        end
        it "creates report with correct data" do
          expect{
            post :create, { data: @data_expense }
          }.to change(Report, :count).by(1)
        end

        it "sends the created report" do
          post :create, { data: @data_expense }

          json = JSON.parse(response.body)
          expect(json["start_date"]).to eq(Date.today.strftime("%Y-%m-%d"))
        end

        it "creates expenses" do
          expect{
            post :create, { data: @data_expense }
          }.to change(Expense, :count).by(2)
        end
      end

      context "point" do
        before :each do
          @data_point = {
            start_date: "2016-06-23",
            end_date: "2016-06-25",
            start_time: "2016-06-25 11:12:13",
            end_time: "2016-06-25 11:12:13",
            company_id: 1,
            activity_id: 1,
            province_id: 1,
            report_type_id: 1,
            activity_mode_id: 1,
            point: "Grifo XX",
            scope: 1000,
            sales: 10000,
            people: 100000,
            product: "KR 1 litro",
            quantities: [],
            comments: [],
            photos: ["test.com", "asr.com", "test"]
          }

          comment1 = {
            for: "Anfitriona",
            comment: "comentario de prueba 1",
            comment_type_id: 1
          }
          comment2 = {
            for: "Público",
            comment: "comentario de prueba 2",
            comment_type_id: 2
          }

          quantity1 = {
            quantity_type_id: 1,
            name: "producto X",
            used: 3,
            remaining: 2
          }
          quantity2 = {
            quantity_type_id: 2,
            name: "Anfitriona",
            used: 6,
            remaining: 3
          }

          @data_point[:comments].push(comment1)
          @data_point[:comments].push(comment2)

          @data_point[:quantities].push(quantity1)
          @data_point[:quantities].push(quantity2)
        end

        it "creates report with correct data" do
          expect{
            post :create, { data: @data_point }
          }.to change(Report, :count).by(1)
        end

        it "sends the created report" do
          post :create, { data: @data_point }

          json = JSON.parse(response.body)
          expect(json["start_date"]).to eq("2016-06-23")
        end

        it "creates expenses" do
          expect{
            post :create, { data: @data_point }
          }.to change(PointDetail, :count).by(1)
        end

        it "creates quantities" do
          expect{
            post :create, { data: @data_point }
          }.to change(Quantity, :count).by(2)
        end

        it "creates comments" do
          expect{
            post :create, { data: @data_point }
          }.to change(Comment, :count).by(2)
        end

        it "creates photos" do
          expect{
            post :create, { data: @data_point }
          }.to change(Photo, :count).by(3)
        end
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
        request.headers["Authorization"] = "Bearer " + token.token

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
        request.headers["Authorization"] = "Bearer " + token.token

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
        request.headers["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: FactoryGirl.create(:dummy_user))
      end

      it { expect(response).to have_http_status(200) }
    end
  end

  describe "DELETE /api/v1/reports/:id" do
    context "with valid token" do
      before :each do
        token = FactoryGirl.create(:token)
        request.headers["Authorization"] = "Bearer " + token.token

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
        request.headers["Authorization"] = "Bearer " + token.token

        FactoryGirl.create(:report, user: FactoryGirl.create(:dummy_user))
      end

      it { expect(response).to have_http_status(200) }
    end
  end
end