class Api::V1::ReportsController < Api::V1::BaseController

  def index
    if @current_user.role[:name] == "admin"
      @reports = Report.all
    else
      @reports = Report.where(user: @current_user)
    end

    render :json => @reports.to_json(:include => {
      :user => { :except => [:encrypted_password, :salt] },
      :company => { :only => [:name, :logo_url] },
      :activity => { :only => [:name] },
      :province => { :only => [:name] },
      :report_type => { :only => [:name] }
      })
  end

  def show
    if @current_user.role[:name] == "admin" || Report.find(params[:id]).user == @current_user
      @report = Report.find(params[:id])

      render :json => @report.to_json(:include => {
        :user => { :except => [:encrypted_password, :salt] },
        :company => {},
        :activity => {},
        :province => {},
        :report_type => {}
        })
    else
      render :json => { :error => "No se encontró el reporte" }, status: :not_found
    end
  end

  def create
  end

  def update
  end

  def destroy
  end

end