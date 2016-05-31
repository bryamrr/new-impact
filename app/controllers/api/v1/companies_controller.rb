class Api::V1::CompaniesController < Api::V1::BaseController
  def index
    @companies = Company.all
    render :json => @companies
  end

  def show
    @company = Company.find(params[:id])
    render :json => @company
  end

  def create
    @company = Company.new(name: params[:data][:name])

    if @company.save
      render :json => @company
    else
      render :json => { :errors => @company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @company = Company.find(params[:id])
    if @current_user.role[:name] = "admin"
      @company.update(name: params[:data][:name])
      render :json => @company
    else
      render :json => { :error => "No se encontró el empresa" }, status: :not_found
    end
  end

  def destroy
    @company = Company.find(params[:id])
    if @current_user.role[:name] = "admin"
      @company.destroy
      render :json => { :message => "Empresa eliminada" }
    else
      render :json => { :errors => "No se encontró el empresa" }, status: :not_found
    end
  end
end