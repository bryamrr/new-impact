class Api::V1::CompaniesController < Api::V1::BaseController
  def index
    if @current_user.role[:name] == "Admin"
      @companies = Company.all
      render :json => @companies
    else
      render :json => { :message => "No tienes acceso"}, status: :unauthorized
    end
  end

  def show
    if @current_user.role[:name] == "Admin"
      @company = Company.find(params[:id])
      render :json => @company
    else
      render :json => { :message => "No se encontró la actividad"}, status: :not_found
    end
  end

  def create
    if @current_user.role[:name] == "Admin"
      @company = Company.new(name: params[:data][:name])

      if @company.save
        render :json => @company
      else
        render :json => { :errors => @company.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render :json => { :message => "No tienes acceso"}, status: :unauthorized
    end
  end

  def update
    if @current_user.role[:name] == "Admin"
      @company = Company.find(params[:id])
      @company.update(name: params[:data][:name])
      render :json => @company
    else
      render :json => { :error => "No se encontró la compañía" }, status: :not_found
    end
  end

  def destroy
    if @current_user.role[:name] == "Admin"
      @company = Company.find(params[:id])
      @company.destroy
      render :json => { :message => "Empresa eliminada" }
    else
      render :json => { :errors => "No se encontró la compañía" }, status: :not_found
    end
  end
end