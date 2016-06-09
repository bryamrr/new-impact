class Api::V1::DataFiltersController < Api::V1::BaseController
  def data_summary
    if (@current_user.role[:name] == "Admin")
      @companies = Company.all
      @types = ActivityType.all
      @modes = ActivityMode.all
      @activities = Activity.all
      @departments = Department.all
      @provinces = Province.all

      render :json => {
        :companies => @companies,
        :types => @types,
        :modes => @modes,
        :activities => @activities,
        :departments => @departments,
        :provinces => @provinces
      }
    elsif (@current_user.role[:name] == "Customer")
      @types = ActivityType.all
      @modes = ActivityMode.all
      @activities = Activity.where(company: @current_user.company)
      @departments = Department.all
      @provinces = Province.all

      render :json => {
        :types => @types,
        :modes => @modes,
        :activities => @activities,
        :departments => @departments,
        :provinces => @provinces
      }
    else
      render :json => { :message => "No puedes acceder a esta información" }
    end
  end

  def summary
    if (@current_user.role[:name] == "Admin")
      @company = Company.find(params[:data][:company_id]) unless params[:data][:company_id] == nil
      @activity = Activity.find(params[:data][:activity_id]) unless params[:data][:activity_id] == nil
      @reports = Report.where(company: @company, activity: @activity, :start_date => params[:data][:start_date]..params[:data][:end_date])

      @reports = Report.where(company: @current_user, activity: @activity, :start_date => params[:data][:start_date]..params[:data][:end_date])

      render :json => @reports.to_json(:include => {
        :expenses => {
          :include => {
            :item => { :except => [:created_at, :updated_at] },
            :voucher => { :except => [:created_at, :updated_at] }
          }
        },
        :point_details => {
          :include => {
            :activity_mode => { :except => [:created_at, :updated_at] }
          }
        },
        :user => {
          :except => [:created_at, :updated_at, :encrypted_password, :salt]
        },
        :province => {
          :except => [:created_at, :updated_at],
          :include => {
            :department => { :except => [:created_at, :updated_at] }
          }
        },
        :activity => {
          :except => [:created_at, :updated_at]
        },
        :company => {
          :except => [:created_at, :updated_at]
        }
      })
    elsif (@current_user.role[:name] == "Customer")
      @activity = Activity.find(params[:data][:activity_id]) unless params[:data][:activity_id] == nil
      @reports = Report.where(company: @current_user, activity: @activity, :start_date => params[:data][:start_date]..params[:data][:end_date])

      render :json => @reports.to_json(:include => {
        :expenses => {
          :include => {
            :item => { :except => [:created_at, :updated_at] },
            :voucher => { :except => [:created_at, :updated_at] }
          }
        },
        :point_details => {
          :include => {
            :activity_mode => { :except => [:created_at, :updated_at] }
          }
        },
        :user => {
          :except => [:created_at, :updated_at, :encrypted_password, :salt]
        },
        :province => {
          :except => [:created_at, :updated_at],
          :include => {
            :department => { :except => [:created_at, :updated_at] }
          }
        },
        :activity => {
          :except => [:created_at, :updated_at]
        },
        :company => {
          :except => [:created_at, :updated_at]
        }
      })
    else
      render :json => { :message => "No puedes acceder a esta información" }, status: :unauthorized
    end
  end
end