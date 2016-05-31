class Api::V1::DataFiltersController < Api::V1::BaseController
  def data_summary
    if (@current_user.role[:name] == "admin")
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
    elsif (@current_user.role[:name] == "customer")
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
    if (@current_user.role[:name] == "admin")
      @company = Company.find(params[:data][:company]) unless params[:data][:company] == nil
      @activity = Activity.find(params[:data][:activity]) unless params[:data][:company] == nil
      @reports = Report.where(company: @company, activity: @activity, :start_date => params[:data][:start_time]..params[:data][:end_time])

      render :json => @reports.to_json(:include => {
        :expenses => {},
        :point_details => {}
        })
    elsif (@current_user.role[:name] == "customer")
      @activity = Activity.find(params[:data][:activity]) unless params[:data][:company] == nil
      @reports = Report.where(company: @current_user, activity: @activity, :start_date => params[:data][:start_time]..params[:data][:end_time])

      render :json => @reports.to_json(:include => {
        :expenses => {},
        :point_details => {}
        })
    else
      render :json => { :message => "No puedes acceder a esta información" }
    end
  end
end