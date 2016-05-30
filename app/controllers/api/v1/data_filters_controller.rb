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
    
  end
end