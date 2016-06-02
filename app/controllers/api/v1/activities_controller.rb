class Api::V1::ActivitiesController < Api::V1::BaseController
  def index
    if @current_user.role[:name] == "Admin"
      @activities = Activity.all
      render :json => @activities
    else
      render :json => { :message => "No tienes acceso"}, status: :unauthorized
    end
  end

  def show
    if @current_user.role[:name] == "Admin"
      @actividy = Activity.find(params[:id])
      render :json => @actividy
    else
      render :json => { :message => "No se encontró la actividad"}, status: :not_found
    end
  end

  def create
    if @current_user.role[:name] == "Admin"
      company = Company.find(params[:data][:company_id])
      activity_type = ActivityType.find(params[:data][:activity_type_id])
      @activity = Activity.new(name: params[:data][:name], company: company, activity_type: activity_type)

      if @activity.save
        render :json => @activity
      else
        render :json => { :errors => @activity.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render :json => { :message => "No tienes acceso"}, status: :unauthorized
    end
  end

  def update
    if @current_user.role[:name] == "Admin"
      @activity = Activity.find(params[:id])
      @activity.update(name: params[:data][:name])
      render :json => @activity
    else
      render :json => { :error => "No se encontró la actividad" }, status: :not_found
    end
  end

  def destroy
    if @current_user.role[:name] == "Admin"
      @activity = Activity.find(params[:id])
      if @activity
        @activity.destroy
        render :json => { :message => "Actividad eliminada" }
      else
        render :json => { :errors => "No se encontró la actividad" }, status: :not_found
      end
    else
      render :json => { :message => "No tienes acceso"}, status: :unauthorized
    end
  end
end